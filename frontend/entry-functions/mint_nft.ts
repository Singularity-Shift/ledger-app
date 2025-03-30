import { MODULE_ADDRESS, MODULE_NAME } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type MintNftArguments = {
  collectionId: string;
  amount: number;
  drawingTimeSeconds?: number;
  usedTracing?: boolean;
  securityToken?: string;
};

export const mintNFT = (args: MintNftArguments): InputTransactionData => {
  const { 
    collectionId, 
    amount, 
    drawingTimeSeconds = 0,
    usedTracing = false,
    securityToken = ""
  } = args;
  
  return {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::mint`,
      typeArguments: [],
      functionArguments: [
        collectionId, 
        amount, 
        drawingTimeSeconds,
        usedTracing,
        securityToken
      ],
    },
  };
};
