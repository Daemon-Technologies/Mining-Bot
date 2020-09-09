// import { request } from 'umi';
import { Account } from "./data";
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { ECPair, payments } from "bitcoinjs-lib";
import { ecPairToHexString, ecPairToAddress } from "blockstack";
import { b58ToC32 } from 'c32check';
import request from "umi-request";

const PATH = `m/44'/5757'/0'/0/0`;

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

export async function mnemonicToPrivateKey(mnemonic: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = bip32.fromSeed(seed);
    const child = master.derivePath(PATH);
    const ecPair = ECPair.fromPrivateKey(child.privateKey);
    return ecPairToHexString(ecPair)
}

export async function mnemonicToStxAddress(mnemonic: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const master = bip32.fromSeed(seed)
    const child = master.derivePath(PATH)
    const address = b58ToC32(ecPairToAddress(ECPair.fromPrivateKey(child.privateKey)))
    return address
}

export async function mnemonicToBtcAddress(mnemonic: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic)

    const master = bip32.fromSeed(seed)
    const PATH = `m/44'/5757'/0'/0/0`;
    const child = master.derivePath(PATH)
    const publicKey = child.publicKey
    const { address } = payments.p2pkh({ pubkey: publicKey })
    return address
}


