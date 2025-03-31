import { NETWORK } from "@/constants";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";

const aptos = new Aptos(new AptosConfig({ network: NETWORK }));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}

export const surfClient = () => createSurfClient(aptosClient());
