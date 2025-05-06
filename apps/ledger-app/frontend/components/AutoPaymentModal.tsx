import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useAbiClient } from "@/contexts/AbiProvider";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LEDGER_COIN_TYPE } from "@/utils/helpers";
import { toast } from "@/components/ui/use-toast";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { aptosClient } from "@/utils/aptosClient";
import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";

interface AutoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  requiredAmount: number;
}

export const AutoPaymentModal = ({ isOpen, onClose, onPaymentSuccess }: AutoPaymentModalProps) => {
  const [isPaying, setIsPaying] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const { account } = useWallet();
  const { client } = useWalletClient();
  const { ledgeABI, autocompleteABI, abi } = useAbiClient();
  const aptos = aptosClient();

  useEffect(() => {
    if (isOpen && account?.address) {
      setIsLoading(true);

      void (async () => {
        try {
          const balanceResult = await aptos.account.getAccountCoinAmount({
            accountAddress: account.address.toString(),
            coinType: LEDGER_COIN_TYPE,
          });

          setBalance(Number(convertAmountFromOnChainToHumanReadable(balanceResult, 8).toFixed(2)));
        } catch (error) {
          console.error("Error fetching token balance:", error);
          setBalance(0);
        } finally {
          setIsLoading(false);
        }

        const requiredAmountResult = await abi?.useABI(autocompleteABI).view.get_config({
          typeArguments: [],
          functionArguments: [],
        });

        setRequiredAmount(
          Number(convertAmountFromOnChainToHumanReadable(Number(requiredAmountResult?.[0]), 8).toFixed(2)),
        );
      })();
    }
  }, [abi, account, isOpen]);

  const handlePay = async () => {
    if (!account || !client || !ledgeABI) return;

    setIsPaying(true);
    try {
      const tx = await client?.useABI(autocompleteABI).buy_autocomplete({
        type_arguments: [LEDGER_COIN_TYPE],
        arguments: [],
      });
      toast({
        title: "Payment Successful",
        description: (
          <>
            <span>Payment sent successfully!</span>
            <a href={`https://explorer.aptoslabs.com/txn/${tx?.hash}`} target="_blank">
              {truncateAddress(tx?.hash)}
            </a>
          </>
        ),
      });

      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
      });
    } finally {
      setIsPaying(false);
    }
  };

  const hasInsufficientBalance = balance !== null && balance < requiredAmount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auto Feature - Payment Required</DialogTitle>
          <DialogDescription>
            The Auto feature requires {requiredAmount} 📒 tokens to generate an AI-enhanced image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner size="md" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span>Your Balance:</span>
                <span className="font-medium">{balance?.toFixed(2) || "0.00"} 📒</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cost:</span>
                <span className="font-medium">{requiredAmount.toFixed(2)} 📒</span>
              </div>
              {hasInsufficientBalance && (
                <div className="text-red-500 text-sm">
                  You don't have enough 📒 tokens. Please add more to your wallet.
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handlePay} className="w-full" disabled={isPaying || isLoading || hasInsufficientBalance}>
            {isPaying ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ${requiredAmount} 📒`
            )}
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
