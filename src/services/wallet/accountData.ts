// import { request } from 'umi';
import { Account } from "./data";
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as bitcoin from "bitcoinjs-lib";
import * as blockstack from "blockstack";
import * as c32check from 'c32check';
import request from "umi-request";
import { coerceAddress } from "@/utils/utils";

const PATH = 'm/44\'/5757\'/0\'/0/0';

export function getAccount() {
    const stxAccounts: Account[] = [];
    const btcAccounts: Account[] = [];
    const STX_STJ = localStorage.getItem("STX");
    const BTC_STJ = localStorage.getItem("BTC");
    console.log(STX_STJ, BTC_STJ)
    if (STX_STJ) {
        const STX_RES: Account[] = JSON.parse(STX_STJ);
        stxAccounts.push(...STX_RES)
    }
    if (BTC_STJ) {
        const BTC_RES: Account[] = JSON.parse(BTC_STJ);
        btcAccounts.push(...BTC_RES)
    }
    return { stxAccounts: stxAccounts, btcAccounts: btcAccounts }
}

export function updateAccount() {
    return { 'stx': "STX123456789" }
}

export async function getStxBalance(stxAddress: string) {
    const baseUrl = 'https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/address/';
    const stxBalance = await request(`${baseUrl + stxAddress}/balances`).then((resp: { stx: { balance: string; }; }) => {
        return resp.stx.balance
    });
    return stxBalance;
}

export async function getBtcBalance(btcAddress: string) {
    const btcUrl = 'https://api.blockcypher.com/v1/btc/main/addrs/';
    const btcBalance = await request(`${btcUrl + btcAddress}/balance`).then((resp: { balance: string; }) => {
        return resp.balance
    });
    return btcBalance;
}

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
    const { address } = bitcoin.payments.p2pkh({ pubkey: pubKey, network: bitcoin.networks.regtest });
    return address;
}


