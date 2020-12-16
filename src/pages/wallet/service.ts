// import { request } from 'umi';
import { Account, NewAccount } from '@/services/wallet/data'
import { getAccount, getStxBalance, getBtcBalance } from '@/services/wallet/accountData'
import { getBtcAddress, mnemonicToEcPair, getPrivateKeyFromEcPair, getStxAddressFromPriKey, isMnemonicValid } from '@/services/wallet/key'
import { message } from 'antd';
import { aes256Encrypt, keyGen } from '@/utils/utils';
import { getLocale } from 'umi';

const { btcType, stxType, CN } = require('@/services/constants');


export async function addAccount(params: NewAccount): Promise<API.RequestResult> {
  const result: API.RequestResult = { status: 200, data: {} };
  try {
    const { mnemonic, type } = params;
    if (!mnemonic || !type) {
      throw message.error(getLocale() === CN ? '非法输入参数' : 'invalid params');
    }
    if (isMnemonicValid(mnemonic)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(getLocale() === CN ? '非法助记词' : 'invalid mnemonic');
    }
    // get ecPair
    const ecPair = await mnemonicToEcPair(mnemonic);
    if (ecPair === null) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw message.error(getLocale() === CN ? '非法助记词' : 'invalid mnemonic');
    }

    // get private key
    const priKey = await getPrivateKeyFromEcPair(ecPair);
    // encrypt private key by password and salt
    const key = keyGen();
    const encryptedData = aes256Encrypt(priKey, key);
    if (!encryptedData) {
      throw message.error(getLocale() === CN ? '加密失败' : 'error when make the encryption');
    }
    const [enc, iv, authTag] = encryptedData;
    let { stxAccounts, btcAccounts } = getAccount();
    if (type === btcType) {
      // get btc address
      const btcAddress = await getBtcAddress(ecPair);
      if (btcAddress === undefined || btcAddress === null) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw message.error(getLocale() === CN ? '获取BTC地址失败' : 'invalid btc address');
      }
      // get btc balance
      const btcBalance = await getBtcBalance(btcAddress);
      // find if the address is already exist
      btcAccounts = btcAccounts.filter(row => row.address !== btcAddress)
      const newBtcAccount: Account = {
        address: btcAddress,
        type: 'BTC',
        balance: btcBalance,
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
        throw message.error(getLocale() === CN ? '获取STX地址失败' : 'invalid stx address');
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

