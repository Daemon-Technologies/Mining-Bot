// import { request } from 'umi';
import { Account } from "./data";
import request from "umi-request";
import { getCurrentNetwork } from '@/utils/utils'

const { sidecarURLKrypton, sidecarURLXenon, bitcoinTestnet3 } = require('@/services/constants')


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

  let baseURL = sidecarURLKrypton;

  switch(getCurrentNetwork()) {
      case "Krypton": baseURL = `${sidecarURLKrypton}/v1/address/${stxAddress}/balances`;
                      break;
      case "Xenon": baseURL = `${sidecarURLXenon}/v1/address/${stxAddress}/balances`;
                    break;
      case "Mainnet": break; //TODO
      default: break;
  }
  return request(`${baseURL}`, {
    method: 'GET',
  });
}



export async function getBtcBalance(btcAddress: string) {
  let baseURL = sidecarURLKrypton;
  // https://api.blockcypher.com/v1/btc/test3/addrs/mzYBtAjNzuEvEMAp2ahx8oT9kWWvb5L2Rj/balance
  switch(getCurrentNetwork()) {
      case "Krypton": baseURL = `${sidecarURLKrypton}/v1/faucets/btc/${btcAddress}`;
                      break;
      //{"balance":0}
      case "Xenon": baseURL = `${bitcoinTestnet3}/addrs/${btcAddress}/balance`
                    //`${sidecarURLXenon}/v1/faucets/btc/${btcAddress}`;
                    break;
      /*
        {
          "address": "mzYBtAjNzuEvEMAp2ahx8oT9kWWvb5L2Rj",
          "total_received": 0,
          "total_sent": 0,
          "balance": 0,
          "unconfirmed_balance": 0,
          "final_balance": 0,
          "n_tx": 0,
          "unconfirmed_n_tx": 0,
          "final_n_tx": 0
        }
      */
      case "Mainnet": break; //TODO
      default: break;
  }
  
  return request(`${baseURL}`, {
    method: "GET",
  });
}



export async function queryAccount(type: number = 0 ): Promise<API.RequestResult> {
  // type 
  // 0 all
  // 1 btc only
  // 2 stx only
  const { btcAccounts, stxAccounts } = getAccount();
  const btcAccountsInfo: Account[] = [];
  const stxAccountsInfo: Account[] = [];
  let newAccountsInfo: Account[] = [];
  // update btc account balance
  if (type === 0 || type === 1) {
    for (var i = 0; i < btcAccounts.length; i++) {
      const row = btcAccounts[i];
      const btcAddress = row.address;
      let balanceResp = { balance: "NaN" };
      try {
        balanceResp = await getBtcBalance(btcAddress);
      } catch (error) {
        console.log("get btc balance error:",error)
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
  }
  if (type === 0 || type === 2) {
    // update stx account balance
    for (var i = 0; i < stxAccounts.length; i++) {
      const row = stxAccounts[i];
      const stxAddress = row.address;
      let balanceResp = { stx: { balance: "NaN" } };
      try {
        balanceResp = await getStxBalance(stxAddress);
      } catch (error) {
        console.log("get stx balance error:",error)
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
  }
  newAccountsInfo = btcAccountsInfo.concat(stxAccountsInfo);
  return { data: newAccountsInfo, status: 200 };
}
