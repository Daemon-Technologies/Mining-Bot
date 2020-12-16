import { request } from 'umi';
const { miningLocalServer_endpoint, miningMonitorServer_endpoint } = require('@/services/constants')
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

export async function startMining(data: {account: Account, inputBurnFee: number, network: string}) {
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
      address: account.address,
      seed: seed,
      burn_fee_cap: burnFee,
      network: data.network
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

export async function getMinerInfo() {
  return request(`${miningMonitorServer_endpoint}/mining_info`, {
    method: 'GET',
    timeout: 30000,
  }).then(data => {
    return { 'data': data.miner_info, 'success': true };
  });
}

export async function getMiningInfo() {
  return request(`${miningMonitorServer_endpoint}/mining_info`, {
    method: 'GET',
    timeout: 30000,
  }).then(data => {
    return { 'data': data.mining_info, 'success': true };
  });
}
