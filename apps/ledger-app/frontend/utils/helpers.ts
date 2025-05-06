import { PublicKey } from "@aptos-labs/ts-sdk";

export const dateToSeconds = (date: Date | undefined) => {
  if (!date) return;
  const dateInSeconds = Math.floor(+date / 1000);
  return dateInSeconds;
};

export const APT_DECIMALS = 8;

export const LEDGER_COIN_TYPE =
  "0xd99d02e42aa3a59aeb4fee6e885b5a6237bffddfa9408ebb8cafab513743e708::coin_factory::Emojicoin";

export const LEDGER_COIN_LIQUIDITY =
  "0xd99d02e42aa3a59aeb4fee6e885b5a6237bffddfa9408ebb8cafab513743e708::coin_factory::EmojicoinLP";

export const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
  return value * Math.pow(10, decimal);
};

export interface IAuth {
  message: string;
  address: string;
  publicKey: string | PublicKey;
  signature: unknown;
}

export interface IJWTUser {
  account: string;
  token: string;
}

export interface IJwt {
  authToken: string;
}
