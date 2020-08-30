// import { request } from 'umi';
import { Account } from '@/services/wallet/data'
import { getAccount } from '@/services/wallet/accountData'
import { request } from 'umi';

export async function addAccount( params: Account ) {
  const {address, type} = params
  if (type === "STX"){
    localStorage.setItem('STX', JSON.stringify({'address':address, 'type': 'STX'}));
  }
  else if (type === "BTC"){
    localStorage.setItem('BTC', JSON.stringify({'address':address, 'type': 'BTC'}));
  }
  return {'data' : params}
}
// TODO => adding localstorage getting and setting module

export async function queryAccount() {
  const account = getAccount()
  console.log(account)
  const address = 'ST3YTDS27Y8YW155EMNQ53ZE655FHPF0TAEVRYMV5'
  const baseUrl = 'https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/address/';

  // eslint-disable-next-line no-return-await
  return await request(`${baseUrl+address}/balances`,{
    method: 'GET'
  }).then((resp)=>{
    console.log(resp);
    return { 'data': [{'address':address, 'type': 'STX', 'balance': resp.stx.balance}] as Account[]}
  })
}

// TODO => request fail resp
// TODO => adding STX/BTC Account Status Checking Module(Address valid)
// TODO => importing privkey service

