import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { ReactNode, useEffect } from "react";
import { useAbiClient } from "./AbiProvider";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export interface AppManagementType {
  isAdmin: boolean;
}

export const AppManagementContext = React.createContext<AppManagementType>({} as AppManagementType);

export const AppManagementProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const { account, connected } = useWallet();
  const { abi, feesABI } = useAbiClient();

  useEffect(() => {
    if (!account || !abi) return;

    void (async () => {
      const adminResult = await abi.useABI(feesABI).view.get_admin({
        typeArguments: [],
        functionArguments: [],
      });

      const admin = adminResult[0];

      setIsAdmin(account.address === AccountAddress.from(admin).toString());
    })();
  }, [account, abi, connected]);

  return <AppManagementContext.Provider value={{ isAdmin }}>{children}</AppManagementContext.Provider>;
};

export const useAppManagement = () => {
  return React.useContext(AppManagementContext);
};
