import { WebUploader } from "@irys/web-upload";
import { WebAptos } from "@irys/web-upload-aptos";
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";
import { Aptos, Ed25519Account, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { aptosClient } from "./aptosClient";
import { WalletSigner } from "./walletSigner";

const getWebIrys = async (provider: WalletContextState | WalletSigner) => {
  const irysUploader = await WebUploader(WebAptos).withProvider(provider);
  return irysUploader;
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

  return new WalletSigner(account, aptos.config.network);
};

export const checkIfFund = async (aptosWallet: WalletContextState, files: File[], aptos: Aptos) => {
  // 1. estimate the gas cost based on the data size https://docs.irys.xyz/developer-docs/irys-sdk/api/getPrice
  let pairAccount: WalletSigner | undefined;

  if (aptosWallet.wallet?.name === "Continue with Google" || aptosWallet.wallet?.name === "Continue with Apple") {
    const privatePairKey = await localStorage.getItem("privatePairKey");

    pairAccount = await getPairAccount(aptosWallet, privatePairKey);

    const tx = await pairAccount.signAndSubmitTransaction({
      data: {
        function: "0x1::aptos_account::transfer_coins",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [aptosWallet.account?.address, 1000],
      },
    });

    console.log(`Transaction sent by Pair Account: ${tx.hash}`);
  }

  const webIrys = await getWebIrys(pairAccount || aptosWallet);
  const costToUpload = await webIrys.utils.estimateFolderPrice(files.map((f) => f.size));
  // 2. check the wallet balance on the irys node: irys.getLoadedBalance()
  const irysBalance = await webIrys.getBalance();

  // 3. if balance is enough, then upload without funding
  if (irysBalance.toNumber() > costToUpload.toNumber()) {
    return true;
  }
  // 4. if balance is not enough,  check the payer balance
  const currentAccountAddress = pairAccount?.getAddress() || aptosWallet.account!.address.toString();

  const currentAccountBalance = await aptos.account.getAccountCoinAmount({
    accountAddress: currentAccountAddress,
    coinType: "0x1::aptos_coin::AptosCoin",
  });

  // 5. if payer balance > the amount based on the estimation, fund the irys node irys.fund, then upload
  if (currentAccountBalance > costToUpload.toNumber()) {
    try {
      await fundNode(aptosWallet, costToUpload.toNumber(), pairAccount);
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
      const tx = await aptosWallet.signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer_coins",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [pairAccount.getAddress(), costToUpload.toNumber()],
        },
      });

      await fundNode(aptosWallet, costToUpload.toNumber(), pairAccount);

      console.log(`Transaction sent: ${tx.hash}`);
    }
  }
  // 6. if payer balance < the amount, replenish the payer balance*/
  return false;
};

export const fundNode = async (aptosWallet: WalletContextState, amount?: number, pairAccount?: WalletSigner) => {
  const webIrys = await getWebIrys(pairAccount || aptosWallet);

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
  const webIrys = await getWebIrys(aptosWallet);
  try {
    const receipt = await webIrys.uploadFile(fileToUpload, { tags: [] });
    return `https://gateway.irys.xyz/${receipt.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading file ${e}`);
  }
};

export const uploadFolder = async (aptosWallet: WalletContextState, files: File[]) => {
  const webIrys = await getWebIrys(aptosWallet);

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
