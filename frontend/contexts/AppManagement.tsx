import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { ReactNode, useEffect } from "react";
import { useAbiClient } from "./AbiProvider";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export interface AppManagementType {
  isAdmin: boolean;
  hasSubscription: boolean;
}

export const AppManagementContext = React.createContext<AppManagementType>({} as AppManagementType);

export const AppManagementProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [hasSubscription, setHasSubscription] = React.useState(false);
  const { account, connected } = useWallet();
  const { abi, feesABI, subscriptionABI } = useAbiClient();

  useEffect(() => {
    if (!account || !abi) return;

    void (async () => {
      const adminResult = await abi.useABI(feesABI).view.get_admin({
        typeArguments: [],
        functionArguments: [],
      });

      const admin = adminResult[0];

      setIsAdmin(account.address.toString() === AccountAddress.from(admin).toString());

      const [_starTime, _endTime, _upgrades, trial_version] = await abi.useABI(subscriptionABI).view.get_plan({
        typeArguments: [],
        functionArguments: [account.address.toString() as `0x${string}`],
      });

      const responseHasSubscription = await abi.useABI(subscriptionABI).view.has_subscription_active({
        typeArguments: [],
        functionArguments: [account.address.toString() as `0x${string}`],
      });

      setHasSubscription(responseHasSubscription[0] && !trial_version);
    })();
  }, [account, abi, subscriptionABI, feesABI, connected]);

  return <AppManagementContext.Provider value={{ isAdmin, hasSubscription }}>{children}</AppManagementContext.Provider>;
};

export const useAppManagement = () => {
  return React.useContext(AppManagementContext);
};
