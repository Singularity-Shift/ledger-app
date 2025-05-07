import { NETWORK } from "@/constants";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";

const aptos = new Aptos(
  new AptosConfig({
    network: NETWORK,
    clientConfig: {
      API_KEY: import.meta.env.VITE_APTOS_API_KEY,
    },
  }),
);

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}

export const surfClient = () => createSurfClient(aptosClient());
