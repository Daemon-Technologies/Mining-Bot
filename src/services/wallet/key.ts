import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as blockstack from "blockstack";
import * as c32check from 'c32check';
import { coerceAddress, getNetworkFromStorage } from "@/utils/utils";
import * as bitcoin from "bitcoinjs-lib";

const PATH = 'm/44\'/5757\'/0\'/0/0';

export async function mnemonicToEcPair(mnemonic: string) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const master = bip32.fromSeed(seed);
  const child = master.derivePath(PATH);     // taken from stacks-wallet. See https://github.com/blockstack/stacks-wallet
  if (child === undefined || child.privateKey === undefined) {
    return null;
  }
  const ecPair = bitcoin.ECPair.fromPrivateKey(child.privateKey);
  return ecPair;
}

export async function mnemonicToPrivateKey(mnemonic: string) {
  const ecPair = await mnemonicToEcPair(mnemonic);
  if (ecPair === null) {
    return null;
  }
  const priKey = blockstack.ecPairToHexString(ecPair);
  return priKey;
}

export async function getPrivateKeyFromEcPair(ecPair: bitcoin.ECPair.ECPairInterface) {
  const priKey = blockstack.ecPairToHexString(ecPair);
  return priKey;
}

export async function getStxAddressFromEcPair(ecPair: bitcoin.ECPair.ECPairInterface) {
  if (ecPair === undefined || ecPair.privateKey === undefined) {
    return null;
  }
  const priKey = ecPair.privateKey.toString();
  const ecKeyPair = blockstack.hexStringToECPair(priKey);
  const addr = blockstack.ecPairToAddress(ecKeyPair);
  const stxAddr = coerceAddress(addr);
  return c32check.b58ToC32(stxAddr);
}

export async function getStxAddressFromPriKey(priKey: string) {
  const ecKeyPair = blockstack.hexStringToECPair(priKey);
  const addr = blockstack.ecPairToAddress(ecKeyPair);
  const stxAddr = coerceAddress(addr);
  return c32check.b58ToC32(stxAddr);
}

export async function getBtcAddress(ecPair: bitcoin.ECPair.ECPairInterface) {
  if (ecPair === undefined || ecPair.privateKey === undefined) {
    return null;
  }
  const pubKey = ecPair.publicKey;
  let btcNetwork = bitcoin.networks.bitcoin;
  switch (getNetworkFromStorage()) {
    case 'Xenon': {
      btcNetwork = bitcoin.networks.regtest;
      break;
    }
    default: {
      break;
    }
  }
  const { address } = bitcoin.payments.p2pkh({ pubkey: pubKey, network: btcNetwork });
  return address;
}

export async function getBtcAddressFromPubkey(pubKey: string) {
  const pubkey = Buffer.from(pubKey, 'hex');
  let btcNetwork = bitcoin.networks.bitcoin;
  switch (getNetworkFromStorage()) {
    case 'Xenon': {
      btcNetwork = bitcoin.networks.regtest;
      break;
    }
    default: {
      break;
    }
  }
  const { address } = bitcoin.payments.p2pkh({ pubkey, network: btcNetwork });
  return address;
}

export function isMnemonicValid(mnemonic: string) {
  return !bip39.validateMnemonic(mnemonic)
}
