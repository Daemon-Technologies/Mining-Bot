import { Account, AccountPk, NewAccount } from "./data";
import request from "umi-request";
import { getNetworkFromStorage } from '@/utils/utils'
import { getBtcAddress, mnemonicToEcPair, getPrivateKeyFromEcPair, isMnemonicValid, getBtcAddressFromPubkey, getPublicKeyFromEcPair, getStxAddressFromPublicKey, getPublickeyFromPrivate } from '@/services/wallet/key'
import { message } from 'antd';
import { aes256Encrypt, keyGen } from '@/utils/utils';
import { showMessage } from "@/services/locale";

const { btcType, stxType } = require('@/services/constants');

const { sidecarURLXenon, sidecarURLMainnet, bitcoinTestnet3, bitcoinMainnet } = require('@/services/constants')

export function getAccount() {
  const stxAccounts: AccountPk[] = [];
  const btcAccounts: AccountPk[] = [];
  const STX_STJ = localStorage.getItem("STX");
  const BTC_STJ = localStorage.getItem("BTC");
  if (STX_STJ) {
    const STX_RES: AccountPk[] = JSON.parse(STX_STJ);
    stxAccounts.push(...STX_RES);
  }
  if (BTC_STJ) {
    const BTC_RES: AccountPk[] = JSON.parse(BTC_STJ);
    btcAccounts.push(...BTC_RES);
  }
  return { stxAccounts, btcAccounts };
}

export async function getStxBalance(stxAddress: string) {

  let baseURL = sidecarURLXenon;

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      baseURL = `${sidecarURLXenon}/v1/address/${stxAddress}/balances`;
      break;
    }
    case "Mainnet": {
      baseURL = `${sidecarURLMainnet}/v1/address/${stxAddress}/balances`;
      break;
    }
    default: break;
  }
  return request(`${baseURL}`, {
    method: 'GET',
    timeout: 5000,
  }).catch(err => {
    return { stx: { balance: 'NaN' } };
  });
}



export async function getBtcBalance(btcAddress: string) {
  let baseURL = sidecarURLXenon;
  let balanceCoef = 1;
  // https://api.blockcypher.com/v1/btc/test3/addrs/mzYBtAjNzuEvEMAp2ahx8oT9kWWvb5L2Rj/balance
  switch (getNetworkFromStorage()) {
    //{"balance":0}
    case "Xenon": {
      baseURL = `${bitcoinTestnet3}/addrs/${btcAddress}/balance`
      //`${sidecarURLXenon}/v1/faucets/btc/${btcAddress}`;
      balanceCoef = 100000000
      break;
    }
    case "Mainnet": {
      baseURL = `${bitcoinMainnet}/balance?active=${btcAddress}&cors=true`;
      //`${sidecarURLXenon}/v1/faucets/btc/${btcAddress}`;
      balanceCoef = 100000000
      break;
    }
    default: break;
  }

  return request(`${baseURL}`, {
    method: "GET",
    timeout: 5000,

  }).then((resp) => {
    return { 'balance': (resp[`${btcAddress}`].final_balance / balanceCoef).toString() };
  }).catch(err => {
    return { 'balance': 'NaN' };
  });
}



export async function queryAccount(type: number = 0): Promise<API.RequestResult> {
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
      const btcAddress = await getBtcAddressFromPubkey(row.pk);
      if (!btcAddress) {
        localStorage.removeItem('BTC');
        break;
      }
      let balanceResp = { balance: "NaN" };
      try {
        balanceResp = await getBtcBalance(btcAddress);
      } catch (error) {
        console.log("get btc balance error:", error)
      }
      const accountInfo: Account = {
        address: btcAddress,
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
      const stxAddress = await getStxAddressFromPublicKey(row.pk);
      let balanceResp = { stx: { balance: "NaN" } };
      try {
        balanceResp = await getStxBalance(stxAddress);
      } catch (error) {
        console.log("get stx balance error:", error)
      }
      const accountInfo: Account = {
        address: stxAddress,
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
      throw message.error(showMessage('非法输入参数', 'invalid params'));
    }
    if (isMnemonicValid(mnemonic)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(showMessage('非法助记词', 'invalid mnemonic'));
    }
    // get ecPair
    const ecPair = await mnemonicToEcPair(mnemonic);
    if (ecPair === null) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(showMessage('非法助记词', 'invalid mnemonic'));
    }
    // get private key
    const priKey = await getPrivateKeyFromEcPair(ecPair);
    const pk = await getPublicKeyFromEcPair(ecPair);
    // encrypt private key by password and salt
    const key = keyGen();
    const encryptedData = aes256Encrypt(priKey, key);
    if (!encryptedData) {
      throw message.error(showMessage('加密失败', 'error when make the encryption'));
    }
    const [enc, iv, authTag] = encryptedData;
    let { stxAccounts, btcAccounts } = getAccount();
    if (type === btcType) {
      // get btc address
      const btcAddress = await getBtcAddress(ecPair);
      if (btcAddress === undefined || btcAddress === null) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw message.error(showMessage('获取BTC地址失败', 'invalid btc address'));
      }
      // find if the address is already exist
      btcAccounts = btcAccounts.filter(row => row.pk !== pk)
      const newBtcAccount: AccountPk = {
        pk: pk,
        type: 'BTC',
        skEnc: enc.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
      // update local storage btc accounts
      btcAccounts.push(newBtcAccount);
      localStorage.setItem('BTC', JSON.stringify(btcAccounts));
    } else if (type === stxType) {
      // find if the address is already exist
      stxAccounts = stxAccounts.filter(row => row.pk !== pk)
      const newStxAccount: AccountPk = {
        pk: pk,
        type: 'STX',
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
  let stxAccounts: AccountPk[] = [];
  let btcAccounts: AccountPk[] = [];
  let newStxAccounts: AccountPk[] = [];
  let newBtcAccounts: AccountPk[] = [];
  let stxAccountsChanged = false;
  let btcAccountsChanged = false;
  const STX_STJ = localStorage.getItem("STX");
  const BTC_STJ = localStorage.getItem("BTC");
  if (STX_STJ) {
    const STX_RES: AccountPk[] = JSON.parse(STX_STJ);
    stxAccounts.push(...STX_RES);
  }
  if (BTC_STJ) {
    const BTC_RES: AccountPk[] = JSON.parse(BTC_STJ);
    btcAccounts.push(...BTC_RES);
  }
  for (var i = 0; i < accounts.length; i++) {
    const type = accounts[i].type;
    const address = accounts[i].address;
    if (type === 'STX') {
      for (var j = 0; j < stxAccounts.length; j++) {
        stxAccountsChanged = true;
        const localAddr = await getStxAddressFromPublicKey(stxAccounts[j].pk);
        if (localAddr && localAddr !== address) {
          newStxAccounts.push(stxAccounts[i]);
        }
      }
    } else if (type === 'BTC') {
      for (var j = 0; j < btcAccounts.length; j++) {
        btcAccountsChanged = true;
        const localAddr = await getBtcAddressFromPubkey(btcAccounts[j].pk);
        if (localAddr && localAddr !== address) {
          newBtcAccounts.push(btcAccounts[i]);
        }
      }
    }
  }
  if (stxAccountsChanged) {
    localStorage.setItem('STX', JSON.stringify(newStxAccounts));
  }
  if (btcAccountsChanged) {
    localStorage.setItem('BTC', JSON.stringify(newBtcAccounts));
  }

  return result;
}
