import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useAbiClient } from "@/contexts/AbiProvider";
import { APT_DECIMALS, LEDGER_COIN_LIQUIDITY, LEDGER_COIN_TYPE } from "@/utils/helpers";
import { convertAmountFromHumanReadableToOnChain, truncateAddress } from "@aptos-labs/ts-sdk";
import { getPrice } from "@/utils/panoraClient";

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredAmount: number;
  currentBalance: number;
  mintNFT: () => void;
}

export const InsufficientBalanceModal = ({
  isOpen,
  onClose,
  requiredAmount,
  currentBalance,
  mintNFT,
}: InsufficientBalanceModalProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { account } = useWallet();
  const { client } = useWalletClient();
  const { ledgeABI, feesABI, abi } = useAbiClient();

  const amountNeeded = Math.max(0, requiredAmount - currentBalance);

  const handleBuyWithAPT = async () => {
    if (!account || !client || !ledgeABI) return;

    setIsPurchasing(true);
    try {
      // Calculate amount to buy (with 10% buffer for gas fees)

      const aptPrice = await getPrice("0x1::aptos_coin::AptosCoin");

      const ledgerPrice = await getPrice(LEDGER_COIN_TYPE);

      const ledgerPriceToBuyApt = Math.max((ledgerPrice * amountNeeded) / aptPrice).toFixed(2);

      const integratorAddressResult = await abi?.useABI(feesABI).view.get_resource_account_address({
        typeArguments: [],
        functionArguments: [],
      });

      const integratorAddress = integratorAddressResult?.[0];

      // Execute the purchase transaction
      const tx = await client.submitTransaction({
        function: "0xface729284ae5729100b3a9ad7f7cc025ea09739cd6e7252aff0beb53619cafe::emojicoin_dot_fun::swap",
        typeArguments: [LEDGER_COIN_TYPE, LEDGER_COIN_LIQUIDITY],
        functionArguments: [
          "0xd99d02e42aa3a59aeb4fee6e885b5a6237bffddfa9408ebb8cafab513743e708",
          convertAmountFromHumanReadableToOnChain(parseFloat(ledgerPriceToBuyApt), APT_DECIMALS),
          false,
          integratorAddress,
          50,
          1,
        ],
      });

      toast({
        title: "Purchase Successful",
        description: (
          <div>
            <p>
              Successfully purchased ${amountNeeded} 📒 tokens. Transcation hash:
              <a href={`https://explorer.aptoslabs.com/txn/${tx?.hash}`} target="_blank">
                {truncateAddress(tx?.hash)}
              </a>
            </p>
          </div>
        ),
      });

      onClose();
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
      });
    } finally {
      setIsPurchasing(false);
      await mintNFT();
    }
  };

  const handleBuyOnPanora = () => {
    // Open Panora in a new tab
    window.open("https://app.panora.exchange/swap/aptos?pair=USDC-LEDGER", "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insufficient 📒 Balance</DialogTitle>
          <DialogDescription>You need {amountNeeded.toFixed(2)} more 📒 tokens to mint this NFT.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span>Current Balance:</span>
            <span className="font-medium">{currentBalance.toFixed(2)} 📒</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Required Balance:</span>
            <span className="font-medium">{requiredAmount.toFixed(2)} 📒</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-semibold">Amount Needed:</span>
            <span className="font-semibold">{amountNeeded.toFixed(2)} 📒</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleBuyWithAPT} className="w-full" disabled={isPurchasing}>
            {isPurchasing ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>Purchasing...</span>
              </div>
            ) : (
              "Buy with APT"
            )}
          </Button>
          <Button onClick={handleBuyOnPanora} variant="outline" className="w-full">
            Buy on Panora
          </Button>
          <Button onClick={onClose} variant="ghost" className="w-full">
            Don't Mint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
