// import { request } from 'umi';
import { Account } from "./data";
import request from "umi-request";

const { sidecarURL } = require('@/services/constants')

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
    return { stxAccounts, btcAccounts }
}

export function updateAccount() {
    return { 'stx': "STX123456789" }
}

export async function getStxBalance(stxAddress: string) {
    const baseUrl = `${sidecarURL}/v1/address/`;
    const stxBalance = await request(`${baseUrl + stxAddress}/balances`).then((resp: { stx: { balance: string; }; }) => {
        return resp.stx.balance
    });
    return stxBalance;
}

export async function getBtcBalance(btcAddress: string) {
    const btcUrl = `${sidecarURL}/v1/faucets/btc/`;
    const btcBalance = await request(`${btcUrl + btcAddress}`).then((resp: { balance: string; }) => {
        return resp.balance
    });
    return btcBalance;
}

export async function queryAccount(type? : 0 | 1 | 2 = 0) {
  const { btcAccounts, stxAccounts } = getAccount();
  const btcAccountsInfo: Account[] = [];
  const stxAccountsInfo: Account[] = [];
  let newAccountsInfo: Account[] = [];

  if (type === 0 || type === 1){
    // update btc account balance
    await Promise.all(btcAccounts.map(async (row) => {
      const btcAddress = row.address;
      const balance = await getBtcBalance(btcAddress);
      const accountInfo: Account = {
        address: row.address,
        type: row.type,
        balance,
      };
      btcAccountsInfo.push(accountInfo)
    }));
  }

  if (type === 0 || type === 2){
    // update stx account balance
    await Promise.all(stxAccounts.map(async (row) => {
      const stxAddress = row.address;
      const balance = await getStxBalance(stxAddress);
      const accountInfo: Account = {
        address: row.address,
        type: row.type,
        balance,
      };
      stxAccountsInfo.push(accountInfo);
    }));
  }
  newAccountsInfo = btcAccountsInfo.concat(stxAccountsInfo)

  return { 'data': newAccountsInfo }
}
