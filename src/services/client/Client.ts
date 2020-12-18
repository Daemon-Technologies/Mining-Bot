import { request } from 'umi';
const { miningMonitorServer_endpoint } = require('@/services/constants')
import { keyGen, aes256Decrypt } from "@/utils/utils";
import { Account } from '@/services/wallet/data'
import { ChainSyncInfo } from './data';


const { nodeKryptonURL } = require('@/services/constants')
const miningLocalServer_endpoint: string = "http://" + window.location.hostname + ":5000"
const localChainURL: string = 'http://' + window.location.hostname + ":20443"

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

export async function startMining(data: { account: Account, inputBurnFee: number, network: string }) {
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

export async function getMinerInfo(){
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

export async function getChainSyncInfo(): Promise<API.RequestResult> {
  let infoList: ChainSyncInfo[] = [];
  let result: API.RequestResult = { status: 200, data: [] };
  let mainChainInfo: Partial<ChainSyncInfo> = {};
  let localChainInfo: Partial<ChainSyncInfo> = {};
  try {
    mainChainInfo = await getMainChainInfo();
    localChainInfo = await getLocalChainSyncInfo();
  } catch (error) {
    result.status = 201;
  }
  infoList.push({
    burn_block_height: mainChainInfo.burn_block_height === undefined ? 'NaN' : mainChainInfo.burn_block_height,
    stacks_tip_height: mainChainInfo.stacks_tip_height === undefined ? 'NaN' : mainChainInfo.stacks_tip_height,
    stacks_tip: mainChainInfo.stacks_tip === undefined ? 'NaN' : mainChainInfo.stacks_tip,
    type: 0,
  });
  infoList.push({
    burn_block_height: localChainInfo.burn_block_height === undefined ? 'NaN' : localChainInfo.burn_block_height,
    stacks_tip_height: localChainInfo.stacks_tip_height === undefined ? 'NaN' : localChainInfo.stacks_tip_height,
    stacks_tip: localChainInfo.stacks_tip === undefined ? 'NaN' : localChainInfo.stacks_tip,
    type: 1,
  });
  result.data = infoList;
  return result;
}

export async function getLocalChainSyncInfo() {
  return request(`${localChainURL}/v2/info`, { method: 'GET' });
}

export async function getMainChainInfo() {
  return request(`${nodeKryptonURL}/v2/info`, { method: 'GET' });
}
