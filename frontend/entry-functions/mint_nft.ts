import { MODULE_ADDRESS, MODULE_NAME } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type MintNftArguments = {
  collectionId: string;
  amount: number;
  drawingTimeSeconds?: number;
};

export const mintNFT = (args: MintNftArguments): InputTransactionData => {
  const { collectionId, amount, drawingTimeSeconds = 0 } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::mint`,
      typeArguments: [],
      functionArguments: [collectionId, amount, drawingTimeSeconds],
    },
  };
};
