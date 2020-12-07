import { request } from 'umi';
const { miningLocalServer_endpoint } = require('@/services/constants')
import { keyGen, aes256Decrypt } from "@/utils/utils";
import { Account } from '@/services/wallet/data'

export async function getNodeStatus() {
  return request(`${miningLocalServer_endpoint}/getNodeStatus`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    return resp
  }).catch((error) => {
    console.log("catch:", error)
    return error
  })
}

export async function startMining(data: {account: Account, inputBurnFee: number}) {
  /*
    address: "n4e9BRjiNm8ANt94eyoMofxNQoKQxHN2jJ"
    authTag: "a4df9c8972d554a4108b0aaff87e8ccb"
    balance: 0
    iv: "8391f569a642fae79e61872e528934d1"
    skEnc: "xBw3XtUuI/3sOozEwtKqC5fj/jTt5JLKcpA2enDHuiEZlnPSxVC/rdVdb26RwfFXKQQFK2Jg28c3kBfBAM5FhtuC"
    type: "BTC"
  */
  console.log(data)
  const account = data.account
  const burnFee = data.inputBurnFee
  const key = keyGen()
  const seed = aes256Decrypt(account.skEnc, key, account.iv, account.authTag)
  console.log(seed)

  return request(`${miningLocalServer_endpoint}/startMining`, {
    method: 'POST',
    data: {
      seed: seed,
      burn_fee_cap: burnFee
    }
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}


export async function stopMining() {
  return request(`${miningLocalServer_endpoint}/stopMining`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}

export async function getMiningInfo() {
  return request('http://8.210.105.204:23456/minerList', {
    method: 'GET',
    timeout: 300000,
  }).then(data => {
    return { 'data': data };
  });
}
