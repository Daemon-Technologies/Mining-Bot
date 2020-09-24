// import { request } from 'umi';
import { Account, NewAccount } from '@/services/wallet/data'
import { getAccount,  getStxBalance, getBtcBalance } from '@/services/wallet/accountData'
import { getBtcAddress, mnemonicToEcPair, getPrivateKeyFromEcPair, getStxAddressFromPriKey, isMnemonicValid} from '@/services/wallet/key'
import { message } from 'antd';

export async function addAccount(params: NewAccount) {
  const { mnemonic} = params;

  if (isMnemonicValid(mnemonic)) {
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
  return { 'data': {}, 'status': 1}
}


