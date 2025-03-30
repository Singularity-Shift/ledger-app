"use client";
import { DefaultABITable } from "@thalalabs/surf";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FeesABI, SubscriptionABI, LedgeABI } from "../abis";
import { aptosClient, surfClient } from "../utils/aptosClient";
import { Client } from "node_modules/@thalalabs/surf/build/types/core/Client";

type FeesABITypes = typeof FeesABI;
type SubscriptionABITypes = typeof SubscriptionABI;
type LedgeABITypes = typeof LedgeABI;

export type AbiContextProp = {
  abi: Client<DefaultABITable> | undefined;
  feesABI: FeesABITypes;
  subscriptionABI: SubscriptionABITypes;
  ledgeABI: LedgeABITypes;
};

const AbiContext = createContext<AbiContextProp>({} as AbiContextProp);

export const AbiProvider = ({ children }: { children: ReactNode }) => {
  const [abi, setAbi] = useState<Client<DefaultABITable>>();
  const [feesABI, setFeesABI] = useState<FeesABITypes>(FeesABI);
  const [subscriptionABI, setSubscriptionABI] = useState<SubscriptionABITypes>(SubscriptionABI);
  const [ledgeABI, setLedgeABI] = useState<LedgeABITypes>(LedgeABI);
  const aptos = aptosClient();

  useEffect(() => {
    if (!aptos) return;

    setFeesABI(FeesABI);
    setSubscriptionABI(SubscriptionABI);
    setLedgeABI(LedgeABI);

    setAbi(surfClient());
  }, [aptos]);

  const values = { abi, feesABI, subscriptionABI, ledgeABI };

  return <AbiContext.Provider value={values}>{children}</AbiContext.Provider>;
};

export const useAbiClient = () => {
  return useContext(AbiContext);
};
