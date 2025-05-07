import {
  type Account,
  AccountAddress,
  AccountAuthenticator,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  HexInput,
  Network,
} from "@aptos-labs/ts-sdk";
import type {
  AptosSignMessageOutput,
  InputTransactionData,
  PendingTransactionResponse,
} from "@aptos-labs/wallet-adapter-react";

type SignedTransactionResponse = {
  senderAuthenticator?: AccountAuthenticator;
  signature?: Uint8Array<ArrayBufferLike>;
};

abstract class BaseSigner {
  protected constructor(
    protected readonly account: Account,
    protected readonly aptos: Aptos,
  ) {}

  public getAddress(): AccountAddress {
    return this.account.accountAddress;
  }

  //  abstract getAccount(): Account;
  abstract signTransaction(transaction: AnyRawTransaction): Promise<SignedTransactionResponse>;
  abstract sendTransaction(transaction: InputTransactionData | AnyRawTransaction): Promise<string>;
  abstract signMessage(message: HexInput): Promise<AptosSignMessageOutput | string>;
  abstract signAndSubmitTransaction(transaction: InputTransactionData): Promise<PendingTransactionResponse>;
}

export class WalletSigner extends BaseSigner {
  constructor(account: Account, network: Network = Network.DEVNET) {
    const config = new AptosConfig({
      network,
      clientConfig: {
        API_KEY: import.meta.env.VITE_APTOS_API_KEY,
      },
    });
    const aptos = new Aptos(config);
    super(account, aptos);
  }

  public getAddress(): AccountAddress {
    return this.account.accountAddress;
  }

  async signTransaction(transaction: AnyRawTransaction) {
    const senderAuthenticator = this.aptos.transaction.sign({
      signer: this.account,
      transaction,
    });

    return {
      senderAuthenticator,
    };
  }

  async signAndSubmitTransaction(transaction: InputTransactionData): Promise<PendingTransactionResponse> {
    const txBuilt = await this.aptos.transaction.build.simple({
      sender: this.account.accountAddress,
      data: transaction.data,
    });

    const result = await this.aptos.signAndSubmitTransaction({
      signer: this.account,
      transaction: txBuilt,
    });

    return result;
  }

  async sendTransaction(transaction: AnyRawTransaction) {
    const signedTx = await this.signTransaction(transaction);

    const submittedTx = await this.aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator: signedTx.senderAuthenticator,
    });

    const result = await this.aptos.waitForTransaction({
      transactionHash: submittedTx.hash,
    });

    return result.hash;
  }

  async signMessage(message: HexInput): Promise<string> {
    const signedMessage = this.account.signWithAuthenticator(message);

    return signedMessage.toString();
  }
}
