import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Ed25519PublicKey,
  Ed25519Signature,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from '@aptos-labs/ts-sdk';
import { createSurfClient } from '@thalalabs/surf';

const VITE_APP_NETWORK = process.env.VITE_APP_NETWORK as string;

export const validateSignature = ({
  publicKey,
  signature,
  message,
}: {
  publicKey: string;
  signature: string;
  message: string;
}) => {
  return new Ed25519PublicKey(publicKey).verifySignature({
    message,
    signature: new Ed25519Signature(signature),
  });
};

export const getAptosClient = () =>
  new Aptos(
    new AptosConfig({
      network:
        VITE_APP_NETWORK === 'mainnet' ? Network.MAINNET : Network.TESTNET,
    }),
  );

export const abis = () => createSurfClient(getAptosClient());

export const getAccount = async () => {
  const aptos = getAptosClient();

  const account = await aptos.account.deriveAccountFromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(
        process.env.APTOS_PRIVATE_KEY as string,
        PrivateKeyVariants.Ed25519,
      ),
    ),
  });

  return account;
};
