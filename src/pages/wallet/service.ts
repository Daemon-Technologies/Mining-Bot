import { request } from 'umi';
import { Account } from '@/services/wallet/data'

export async function addAccount(params: Account) {
  const {address, type} = params
  if (type === "STX"){
    localStorage.setItem('STX', JSON.stringify({'address':address, 'type': 'STX'}));
  }
  else if (type === "BTC"){
    localStorage.setItem('BTC', {'address':address, 'type': 'BTC'})
  }
  console.log(params)
  return {'data' : params}
}


export async function queryAccount( params: Account) {
  const BTCAddress = localStorage.getItem('BTC')
  const STXAddress = localStorage.getItem('STX')
  console.log(STXAddress,BTCAddress)
  return {'data': [{'address':"ST3YTDS27Y8YW155EMNQ53ZE655FHPF0TAEVRYMV5", 'type':'STX', 'key':1 , 'balance': "0.00"}]}
}

