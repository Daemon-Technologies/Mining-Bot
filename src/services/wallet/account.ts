// import { request } from 'umi';
import { Account, NewAccount } from "./data";
import request from "umi-request";
import { getCurrentNetwork } from '@/utils/utils'
import { getBtcAddress, mnemonicToEcPair, getPrivateKeyFromEcPair, getStxAddressFromPriKey, isMnemonicValid } from '@/services/wallet/key'
import { message } from 'antd';
import { aes256Encrypt, keyGen } from '@/utils/utils';
import { showMessage } from "@/services/locale";

const { btcType, stxType } = require('@/services/constants');

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
  let balanceCoef = 1;
  // https://api.blockcypher.com/v1/btc/test3/addrs/mzYBtAjNzuEvEMAp2ahx8oT9kWWvb5L2Rj/balance
  switch(getCurrentNetwork()) {
      case "Krypton": baseURL = `${sidecarURLKrypton}/v1/faucets/btc/${btcAddress}`;
                      balanceCoef = 1
                      break;
      //{"balance":0}
      case "Xenon": baseURL = `${bitcoinTestnet3}/addrs/${btcAddress}/balance`
                    //`${sidecarURLXenon}/v1/faucets/btc/${btcAddress}`;
                    balanceCoef = 100000000
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
  }).then((resp)=>{
    console.log(resp)
    return {'balance': resp.balance/balanceCoef}
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


export async function addAccount(params: NewAccount): Promise<API.RequestResult> {
  const result: API.RequestResult = { status: 200, data: {} };
  try {
    const { mnemonic, type } = params;
    if (!mnemonic || !type) {
      throw message.error(showMessage('非法输入参数' , 'invalid params'));
    }
    if (isMnemonicValid(mnemonic)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(showMessage('非法助记词' , 'invalid mnemonic'));
    }
    // get ecPair
    const ecPair = await mnemonicToEcPair(mnemonic);
    if (ecPair === null) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(showMessage( '非法助记词' , 'invalid mnemonic'));
    }

    // get private key
    const priKey = await getPrivateKeyFromEcPair(ecPair);
    // encrypt private key by password and salt
    const key = keyGen();
    const encryptedData = aes256Encrypt(priKey, key);
    if (!encryptedData) {
      throw message.error(showMessage('加密失败' , 'error when make the encryption'));
    }
    const [enc, iv, authTag] = encryptedData;
    let { stxAccounts, btcAccounts } = getAccount();
    if (type === btcType) {
      // get btc address
      const btcAddress = await getBtcAddress(ecPair);
      if (btcAddress === undefined || btcAddress === null) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw message.error(showMessage( '获取BTC地址失败' , 'invalid btc address'));
      }
      // get btc balance
      const btcBalance = await getBtcBalance(btcAddress);
      // find if the address is already exist
      btcAccounts = btcAccounts.filter(row => row.address !== btcAddress)
      const newBtcAccount: Account = {
        address: btcAddress,
        type: 'BTC',
        balance: btcBalance.balance.toString(),
        skEnc: enc.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
      // update local storage btc accounts
      btcAccounts.push(newBtcAccount);
      localStorage.setItem('BTC', JSON.stringify(btcAccounts));
    } else if (type === stxType) {
      // get stx address
      const stxAddress = await getStxAddressFromPriKey(priKey);
      if (stxAddress === null) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw message.error(showMessage('获取STX地址失败' , 'invalid stx address'));
      }
      // get stx balance
      const stxBalance = await getStxBalance(stxAddress);
      // find if the address is already exist
      stxAccounts = stxAccounts.filter(row => row.address !== stxAddress)
      const newStxAccount: Account = {
        address: stxAddress,
        type: 'STX',
        balance: stxBalance,
        skEnc: enc.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
      // update local storage stx accounts
      stxAccounts.push(newStxAccount);
      localStorage.setItem('STX', JSON.stringify(stxAccounts))
    }
  } catch (error) {
    result.status = 500;
  }
  return result;
}

export async function deleteAccount(accounts: Account[]): Promise<API.RequestResult> {
  const result: API.RequestResult = { status: 200, data: {} };
  let stxAccounts: Account[] = [];
  let btcAccounts: Account[] = [];
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
  for (var i = 0; i < accounts.length; i++) {
    const type = accounts[i].type;
    if (type === 'STX') {
      stxAccounts = stxAccounts.filter(row => row.address !== accounts[i].address);
    } else if (type === 'BTC') {
      btcAccounts = btcAccounts.filter(row => row.address !== accounts[i].address);
    }
  }
  localStorage.setItem('STX', JSON.stringify(stxAccounts));
  localStorage.setItem('BTC', JSON.stringify(btcAccounts));
  return result;
}
