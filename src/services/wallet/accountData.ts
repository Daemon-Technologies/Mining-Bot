// import { request } from 'umi';
import { Account } from "./data";
import request from "umi-request";
import { message } from "antd";

const { sidecarURL } = require('@/services/constants')

export function getAccount() {
  const stxAccounts: Account[] = [];
  const btcAccounts: Account[] = [];
  const STX_STJ = localStorage.getItem("STX");
  const BTC_STJ = localStorage.getItem("BTC");
  if (STX_STJ) {
    const STX_RES: Account[] = JSON.parse(STX_STJ);
    stxAccounts.push(...STX_RES);
  }
  if (BTC_STJ) {
    const BTC_RES: Account[] = JSON.parse(BTC_STJ);
    btcAccounts.push(...BTC_RES);
  }
  return { stxAccounts, btcAccounts };
}

export function updateAccount() {
  return { 'stx': "STX123456789" }
}

export async function getStxBalance(stxAddress: string) {
  const baseUrl = `${sidecarURL}/v1/address/`;
  return request(`${baseUrl + stxAddress}/balances`, {
    method: 'GET',
  });
}

export async function getBtcBalance(btcAddress: string) {
  const btcUrl = `${sidecarURL}/v1/faucets/btc/`;
  return request(`${btcUrl + btcAddress}`, {
    method: "GET",
  });
}

export async function queryAccount() {
  const { btcAccounts, stxAccounts } = getAccount();
  const btcAccountsInfo: Account[] = [];
  const stxAccountsInfo: Account[] = [];
  let newAccountsInfo: Account[] = [];
  // update btc account balance
  for (var i = 0; i < btcAccounts.length; i++) {
    const row = btcAccounts[i];
    const btcAddress = row.address;
    const balanceResp = await getBtcBalance(btcAddress);
    if (!balanceResp || balanceResp.balance === undefined) {
      message.error(`query address${btcAddress} btc balance time out.`);
      continue;
    }
    const accountInfo: Account = {
      address: row.address,
      type: row.type,
      balance: balanceResp.balance,
      skEnc: row.skEnc,
      iv: row.iv,
      authTag: row.authTag,
    };
    btcAccountsInfo.push(accountInfo);
  }

  // update stx account balance
  for (var i = 0; i < stxAccounts.length; i++) {
    const row = stxAccounts[i];
    const stxAddress = row.address;
    const balanceResp = await getStxBalance(stxAddress);
    if (!balanceResp || !balanceResp.stx) {
      message.error(`query address${stxAddress} stx balance time out.`);
      return;
    }
    const accountInfo: Account = {
      address: row.address,
      type: row.type,
      balance: balanceResp.stx.balance,
      skEnc: row.skEnc,
      iv: row.iv,
      authTag: row.authTag,
    };
    stxAccountsInfo.push(accountInfo);
  }

  newAccountsInfo = btcAccountsInfo.concat(stxAccountsInfo);
  return { 'data': newAccountsInfo };
}
