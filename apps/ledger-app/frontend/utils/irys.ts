import { WebUploader } from "@irys/web-upload";
import { Aptos as AptosNode } from "@irys/upload-aptos";
import { WebAptos } from "@irys/web-upload-aptos";
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";
import {
  Account,
  Aptos,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
  Ed25519Account,
  Ed25519PrivateKey,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { aptosClient } from "./aptosClient";
import { MintStep } from "@/components/MintStepsModal";
import { updateMintData } from "./assetsUploader";
import { APT_DECIMALS } from "./helpers";
// import { WalletSigner } from "./walletSigner";

const getWebIrys = async (provider: WalletContextState | string) => {
  const irysUploader =
    typeof provider === "string"
      ? await WebUploader(AptosNode as any).withProvider(provider)
      : await WebUploader(WebAptos).withProvider(provider);
  return irysUploader;
};

const checkIsAptosConnectWallet = (wallet: WalletContextState) => {
  if (wallet.wallet?.name === "Continue with Google" || wallet.wallet?.name === "Continue with Apple") {
    return true;
  }

  return false;
};

const getPairAccount = async (aptosWallet: WalletContextState, privatePairKey: string | null) => {
  const aptos = aptosClient();

  const account = privatePairKey
    ? await aptos.deriveAccountFromPrivateKey({
        privateKey: new Ed25519PrivateKey(
          PrivateKey.formatPrivateKey(privatePairKey as string, PrivateKeyVariants.Ed25519),
        ),
      })
    : Ed25519Account.generate();

  if (!privatePairKey) {
    const tx = await aptosWallet.signAndSubmitTransaction({
      data: {
        function: "0x1::aptos_account::transfer_coins",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [account.accountAddress, 1000],
      },
    });

    console.log(`Transaction sent: ${tx.hash}`);

    localStorage.setItem("privatePairKey", (account as Ed25519Account).privateKey.toHexString());
  }

  return account;
};

export const checkIfFund = async (aptosWallet: WalletContextState, files: File[], aptos: Aptos) => {
  // 1. estimate the gas cost based on the data size https://docs.irys.xyz/developer-docs/irys-sdk/api/getPrice
  let pairAccount: Account | undefined;
  let privatePairKey: string | null = null;

  if (checkIsAptosConnectWallet(aptosWallet)) {
    privatePairKey = localStorage.getItem("privatePairKey");

    pairAccount = await getPairAccount(aptosWallet, privatePairKey);
  }

  const webIrys = await getWebIrys(privatePairKey || aptosWallet);
  const costToUpload = await webIrys.utils.estimateFolderPrice(files.map((f) => f.size));

  // 2. check the wallet balance on the irys node: irys.getLoadedBalance()
  const irysBalance = await webIrys.getBalance();

  // 3. if balance is enough, then upload without funding
  if (irysBalance.toNumber() > costToUpload.toNumber()) {
    return true;
  }
  // 4. if balance is not enough,  check the payer balance
  const currentAccountAddress = pairAccount?.accountAddress.toString() || aptosWallet.account!.address.toString();

  const currentAccountBalance = await aptos.account.getAccountCoinAmount({
    accountAddress: currentAccountAddress,
    coinType: "0x1::aptos_coin::AptosCoin",
  });

  // 5. if payer balance > the amount based on the estimation, fund the irys node irys.fund, then upload
  if (currentAccountBalance > costToUpload.toNumber()) {
    try {
      await fundNode(aptosWallet, costToUpload.toNumber(), privatePairKey);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error funding node ${error}`);
    }
  } else if (pairAccount) {
    const mainAccountBalance = await aptos.account.getAccountCoinAmount({
      accountAddress: aptosWallet.account!.address,
      coinType: "0x1::aptos_coin::AptosCoin",
    });

    if (mainAccountBalance > costToUpload.toNumber()) {
      const gasfees = (await webIrys.tokenConfig.getFee(costToUpload)) as {
        gasUnitPrice: number;
        maxGasAmount: number;
      };

      const fundFees = convertAmountFromOnChainToHumanReadable(
        costToUpload.toNumber() + gasfees.gasUnitPrice * gasfees.maxGasAmount,
        APT_DECIMALS,
      );

      const saveFees = fundFees + fundFees * 0.2;

      const fees = Math.ceil(convertAmountFromHumanReadableToOnChain(saveFees, APT_DECIMALS));

      const tx = await aptosWallet.signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer_coins",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [pairAccount.accountAddress, fees],
        },
      });

      await fundNode(aptosWallet, costToUpload.toNumber(), privatePairKey);

      console.log(`Transaction sent: ${tx.hash}`);
    }
  }
  // 6. if payer balance < the amount, replenish the payer balance*/
  return false;
};

export const fundNode = async (aptosWallet: WalletContextState, amount?: number, privatePairKey?: string | null) => {
  const webIrys = await getWebIrys(privatePairKey || aptosWallet);

  try {
    const fundTx = await webIrys.fund(amount ?? 1000000);
    console.log(`Successfully funded ${webIrys.utils.fromAtomic(fundTx.quantity)} ${webIrys.token}`);
    return true;
  } catch (e) {
    throw new Error(`Error uploading data ${e}`);
  }
};

export const uploadFile = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aptosWallet: any,
  fileToUpload: File,
): Promise<string> => {
  let privatePairKey: string | null = null;

  if (checkIsAptosConnectWallet(aptosWallet)) {
    privatePairKey = localStorage.getItem("privatePairKey");
  }

  const webIrys = await getWebIrys(privatePairKey || aptosWallet);
  try {
    const receipt = await webIrys.uploadFile(fileToUpload, { tags: [] });
    return `https://gateway.irys.xyz/${receipt.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading file ${e}`);
  }
};

export const uploadFolder = async (aptosWallet: WalletContextState, files: File[]) => {
  let privatePairKey: string | null = null;

  if (checkIsAptosConnectWallet(aptosWallet)) {
    privatePairKey = localStorage.getItem("privatePairKey");
  }

  const webIrys = await getWebIrys(privatePairKey || aptosWallet);

  try {
    const receipt = await webIrys.uploadFolder(files); //returns the manifest ID

    console.log(
      `Files uploaded. Manifest Id=${receipt.manifestId} Receipt Id=${receipt.id}
      access with: https://gateway.irys.xyz/${receipt.manifestId}/<image-name>`,
    );
    return `https://gateway.irys.xyz/${receipt.manifestId}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading folder ${e}`);
  }
};

// New function to handle the minting process with steps tracking
export const processMintWithSteps = async (
  aptosWallet: WalletContextState,
  files: File[],
  updateSteps: (steps: MintStep[], currentStepId: string) => void,
  mintPageCallback: (manifestUrl: string) => Promise<void>,
) => {
  const aptos = aptosClient();
  const isAptosConnect = checkIsAptosConnectWallet(aptosWallet);

  // Check if private key already exists for Aptos Connect
  let privatePairKey = isAptosConnect ? localStorage.getItem("privatePairKey") : null;
  const pairWalletExists = isAptosConnect && privatePairKey;

  // Define all possible steps
  const allSteps: MintStep[] = [
    {
      id: "create-pair-wallet",
      label: "Creating Pair Wallet",
      status: "pending",
    },
    {
      id: "check-funds",
      label: "Checking Account Funds",
      status: "pending",
    },
    {
      id: "fund-account",
      label: "Funding Account",
      status: "pending",
    },
    {
      id: "upload-sources",
      label: "Uploading Sources",
      status: "pending",
    },
    {
      id: "mint-page",
      label: "Minting Page",
      status: "pending",
    },
  ];

  // Filter steps based on wallet type and whether pair wallet already exists
  let steps = allSteps.filter((step) => {
    // Skip create-pair-wallet step if not using Aptos Connect or if pair wallet exists
    if (step.id === "create-pair-wallet" && (!isAptosConnect || pairWalletExists)) {
      return false;
    }
    return true;
  });

  try {
    // Step 1: Create pair wallet (only for Aptos Connect without existing pair wallet)
    let pairAccount: Account | undefined;

    if (isAptosConnect && !pairWalletExists) {
      const createWalletStep = steps.find((s) => s.id === "create-pair-wallet");
      if (createWalletStep) {
        updateSteps([...steps], "create-pair-wallet");
        steps = steps.map((s) => (s.id === "create-pair-wallet" ? { ...s, status: "in-progress" } : s));
        updateSteps([...steps], "create-pair-wallet");

        try {
          pairAccount = await getPairAccount(aptosWallet, privatePairKey);

          if (!privatePairKey) {
            privatePairKey = (pairAccount as Ed25519Account).privateKey.toHexString();
          }

          steps = steps.map((s) => (s.id === "create-pair-wallet" ? { ...s, status: "completed" } : s));
          // Find the next step after create-pair-wallet
          const nextStep = steps.find((s) => s.id !== "create-pair-wallet");
          if (nextStep) {
            updateSteps([...steps], nextStep.id);
          }
        } catch (error) {
          steps = steps.map((s) =>
            s.id === "create-pair-wallet"
              ? {
                  ...s,
                  status: "error",
                  errorMessage: "Failed to create pair wallet",
                }
              : s,
          );
          updateSteps([...steps], "create-pair-wallet");
          throw error;
        }
      }
    } else if (isAptosConnect && pairWalletExists) {
      // If pair wallet exists, just load it
      try {
        pairAccount = await getPairAccount(aptosWallet, privatePairKey);
      } catch (error) {
        console.error("Failed to load existing pair wallet:", error);
        // If loading fails, we'll continue without the pair account
      }
    }

    // Step 2: Check funds
    const checkFundsStep = steps.find((s) => s.id === "check-funds");
    if (checkFundsStep) {
      updateSteps([...steps], "check-funds");
      steps = steps.map((s) => (s.id === "check-funds" ? { ...s, status: "in-progress" } : s));
      updateSteps([...steps], "check-funds");

      let needsFunding = false;
      let webIrys;
      let costToUpload;

      try {
        webIrys = await getWebIrys(privatePairKey || aptosWallet);
        costToUpload = await webIrys.utils.estimateFolderPrice(files.map((f) => f.size));
        const irysBalance = await webIrys.getBalance();

        needsFunding = irysBalance.toNumber() <= costToUpload.toNumber();

        // Mark check-funds step as completed
        steps = steps.map((s) => (s.id === "check-funds" ? { ...s, status: "completed" } : s));

        // Now filter out the fund-account step if no funding is needed
        if (!needsFunding) {
          steps = steps.filter((s) => s.id !== "fund-account");
        }

        // Find the next step after check-funds
        const nextStep = steps.find((s) => s.id !== "create-pair-wallet" && s.id !== "check-funds");
        if (nextStep) {
          updateSteps([...steps], nextStep.id);
        }
      } catch (error) {
        console.error("Error checking Irys balance:", error);
        // Assume funding is needed if we can't check the balance
        needsFunding = true;

        steps = steps.map((s) =>
          s.id === "check-funds"
            ? {
                ...s,
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Failed to check account funds",
              }
            : s,
        );
        updateSteps([...steps], "check-funds");
        throw error;
      }

      // Step 3: Fund account (only if needed)
      if (needsFunding) {
        const fundAccountStep = steps.find((s) => s.id === "fund-account");
        if (fundAccountStep) {
          updateSteps([...steps], "fund-account");
          steps = steps.map((s) => (s.id === "fund-account" ? { ...s, status: "in-progress" } : s));
          updateSteps([...steps], "fund-account");

          try {
            // We already have webIrys and costToUpload from earlier
            if (!webIrys || !costToUpload) {
              webIrys = await getWebIrys(privatePairKey || aptosWallet);
              costToUpload = await webIrys.utils.estimateFolderPrice(files.map((f) => f.size));
            }

            const currentAccountAddress =
              pairAccount?.accountAddress.toString() || aptosWallet.account!.address.toString();
            const currentAccountBalance = await aptos.account.getAccountCoinAmount({
              accountAddress: currentAccountAddress,
              coinType: "0x1::aptos_coin::AptosCoin",
            });

            if (currentAccountBalance > costToUpload.toNumber()) {
              await fundNode(aptosWallet, costToUpload.toNumber(), privatePairKey);
            } else if (pairAccount) {
              const mainAccountBalance = await aptos.account.getAccountCoinAmount({
                accountAddress: aptosWallet.account!.address,
                coinType: "0x1::aptos_coin::AptosCoin",
              });

              if (mainAccountBalance > costToUpload.toNumber()) {
                const gasfees = (await webIrys.tokenConfig.getFee(costToUpload)) as {
                  gasUnitPrice: number;
                  maxGasAmount: number;
                };

                const fundFees = convertAmountFromOnChainToHumanReadable(
                  costToUpload.toNumber() + gasfees.gasUnitPrice * gasfees.maxGasAmount,
                  APT_DECIMALS,
                );

                const saveFees = fundFees + fundFees * 0.2;

                const fees = Math.ceil(convertAmountFromHumanReadableToOnChain(saveFees, APT_DECIMALS));

                const tx = await aptosWallet.signAndSubmitTransaction({
                  data: {
                    function: "0x1::aptos_account::transfer_coins",
                    typeArguments: ["0x1::aptos_coin::AptosCoin"],
                    functionArguments: [pairAccount.accountAddress, fees],
                  },
                });

                await fundNode(aptosWallet, costToUpload.toNumber(), privatePairKey);

                console.log(`Transaction sent: ${tx.hash}`);
              }
            } else {
              throw new Error("Insufficient funds in the account to cover the upload cost.");
            }

            steps = steps.map((s) => (s.id === "fund-account" ? { ...s, status: "completed" } : s));
            // Find the next step after fund-account
            const nextStep = steps.find(
              (s) => s.id !== "create-pair-wallet" && s.id !== "check-funds" && s.id !== "fund-account",
            );
            if (nextStep) {
              updateSteps([...steps], nextStep.id);
            }
          } catch (error) {
            steps = steps.map((s) =>
              s.id === "fund-account"
                ? {
                    ...s,
                    status: "error",
                    errorMessage: error instanceof Error ? error.message : "Failed to fund account",
                  }
                : s,
            );
            updateSteps([...steps], "fund-account");
            throw error;
          }
        }
      }
    }

    // Step 4: Upload sources
    const uploadStep = steps.find((s) => s.id === "upload-sources");
    if (uploadStep) {
      updateSteps([...steps], "upload-sources");
      steps = steps.map((s) => (s.id === "upload-sources" ? { ...s, status: "in-progress" } : s));
      updateSteps([...steps], "upload-sources");

      try {
        // Use updateMintData instead of directly calling webIrys.uploadFolder
        const mintId = files.find((file) => file.name.endsWith(".json"))?.name.replace(".json", "") || "default";
        const { imageUrl } = await updateMintData(mintId, aptosWallet, files);

        steps = steps.map((s) => (s.id === "upload-sources" ? { ...s, status: "completed" } : s));
        updateSteps([...steps], "mint-page");

        // Step 5: Mint page
        steps = steps.map((s) => (s.id === "mint-page" ? { ...s, status: "in-progress" } : s));
        updateSteps([...steps], "mint-page");

        try {
          await mintPageCallback(imageUrl);

          steps = steps.map((s) => (s.id === "mint-page" ? { ...s, status: "completed" } : s));
          updateSteps([...steps], "mint-page");
        } catch (error) {
          steps = steps.map((s) =>
            s.id === "mint-page"
              ? {
                  ...s,
                  status: "error",
                  errorMessage: error instanceof Error ? error.message : "Failed to mint page",
                }
              : s,
          );
          updateSteps([...steps], "mint-page");
          throw error;
        }
      } catch (error) {
        steps = steps.map((s) =>
          s.id === "upload-sources"
            ? {
                ...s,
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Failed to upload sources",
              }
            : s,
        );
        updateSteps([...steps], "upload-sources");
        throw error;
      }
    }
  } catch (error) {
    console.error("Error during minting process:", error);
    throw error;
  }
};
