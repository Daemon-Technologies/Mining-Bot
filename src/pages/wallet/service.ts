// import { request } from 'umi';
import { Account, NewAccount } from '@/services/wallet/data'
import { getAccount, mnemonicToPrivateKey, getStxAddress, getBtcAddress, getStxBalance, getBtcBalance, mnemonicToEcPair, getPrivateKeyFromEcPair, getStxAddressFromPriKey } from '@/services/wallet/accountData'
import * as bip39 from 'bip39';
import { message } from 'antd';

export async function addAccount(params: NewAccount) {
  const { mnemonic, password } = params;
  if (!bip39.validateMnemonic(mnemonic)) {
    throw message.error('invalid mnemonic');
  }
  // get ecPair
  const ecPair = await mnemonicToEcPair(mnemonic);
  console.log('ecPair:', ecPair)
  if (ecPair === null) {
    throw message.error('invalid mnemonic');
  }
  // get private key
  const priKey = await getPrivateKeyFromEcPair(ecPair);
  // get stx address
  const stxAddress = await getStxAddressFromPriKey(priKey);
  console.log('stxAddress:', stxAddress)
  if (stxAddress === null) {
    throw message.error('invalid stx address');
  }
  // get stx balance
  const stxBalance = await getStxBalance(stxAddress);
  console.log('stx balance:', stxBalance)
  // get btc address
  const btcAddress = await getBtcAddress(ecPair);
  if (btcAddress === undefined || btcAddress === null) {
    throw message.error('invalid btc address');
  }
  console.log('stx address:', stxAddress, " btcAddress:", btcAddress)
  // get btc balance
  const btcBalance = await getBtcBalance(btcAddress);
  let { stxAccounts, btcAccounts } = getAccount();
  // find if the address is already exist
  stxAccounts = stxAccounts.filter(row => row.address !== stxAddress)
  const newStxAccount: Account = {
    address: stxAddress,
    type: 'STX',
    balance: stxBalance,
  };
  // update local storage stx accounts
  stxAccounts.push(newStxAccount);
  localStorage.setItem('STX', JSON.stringify(stxAccounts))
  // 
  btcAccounts = btcAccounts.filter(row => row.address !== btcAddress)
  const newBtcAccount: Account = {
    address: btcAddress,
    type: 'BTC',
    balance: btcBalance,
  };
  // update local storage btc accounts
  btcAccounts.push(newBtcAccount);
  localStorage.setItem('BTC', JSON.stringify(btcAccounts));
  // store private key
  localStorage.setItem('PRIVATEKEY', priKey);
  return { 'data': {} }
}
// TODO => adding localstorage getting and setting module

export async function queryAccount() {
  const { btcAccounts, stxAccounts } = getAccount();
  const newAccounts: Account[] = [];
  // update btc account balance
  await Promise.all(btcAccounts.map(async (row) => {
    const btcAddress = row.address;
    const balance = await getBtcBalance(btcAddress);
    const accountInfo: Account = {
      address: row.address,
      type: row.type,
      balance,
    };
    newAccounts.push(accountInfo)
  }));
  // update stx account balance
  await Promise.all(stxAccounts.map(async (row) => {
    const stxAddress = row.address;
    const balance = await getStxBalance(stxAddress);
    const accountInfo: Account = {
      address: row.address,
      type: row.type,
      balance,
    };
    newAccounts.push(accountInfo);
  }));
  return { 'data': newAccounts }
}

// TODO => request fail resp
// TODO => adding STX/BTC Account Status Checking Module(Address valid)
// TODO => importing privkey service

