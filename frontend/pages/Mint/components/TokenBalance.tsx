import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";
import { COIN_TYPE } from "@/constants";
import { useAbiClient } from "@/contexts/AbiProvider";
import { LEDGER_COIN_TYPE } from "@/utils/helpers";

export function TokenBalance() {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { account } = useWallet();
  const aptos = aptosClient();
  const { ledgeABI } = useAbiClient();

  useEffect(() => {
    if (!account?.address) {
      setIsLoading(false);
      return;
    }

    void (async () => {
      setIsLoading(true);
      try {
        const balanceResult = await aptos.account.getAccountCoinAmount({
          accountAddress: account.address,
          coinType: LEDGER_COIN_TYPE,
        });

        setBalance(convertAmountFromOnChainToHumanReadable(balanceResult, 8).toFixed(2));
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setBalance("0");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [account?.address, aptos, ledgeABI]);

  if (!account?.address) return null;

  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-black">
      <span className="text-sm font-medium">{isLoading ? "..." : balance}</span>
      <span className="text-lg">📒</span>
    </div>
  );
}
