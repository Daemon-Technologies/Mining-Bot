import { request } from 'umi';
import { keyGen, aes256Decrypt, keyDerive, aes256Encrypt, getNetworkFromStorage } from "@/utils/utils";
import { Account } from '@/services/wallet/data'
import { ChainSyncInfo } from './data';
import { getSysConf } from '../sysConf/conf';
import { message } from 'antd';


const { nodeKryptonURL } = require('@/services/constants');
const sysConf = getSysConf();
const miningLocalServer_endpoint: string = sysConf.miningLocalServerUrl + ':5000';
const localChainURL: string = sysConf.miningLocalServerUrl + ":20443";


export async function getNodeStatus() {
  return request(`${miningLocalServer_endpoint}/getNodeStatus`, {
    method: 'POST',
    data: {
      network: getNetworkFromStorage(),
    }
  }).then((resp) => {
    console.log(resp);
    return resp
  }).catch((error) => {
    console.log("catch:", error)
    return error
  })
}

export async function startMining(data: { account: Account, inputBurnFee: number, debugMode: boolean, authCode: string, network: string }) {
  /*
    address: "n4e9BRjiNm8ANt94eyoMofxNQoKQxHN2jJ"
    authTag: "a4df9c8972d554a4108b0aaff87e8ccb"
    balance: 0
    iv: "8391f569a642fae79e61872e528934d1"
    skEnc: "xBw3XtUuI/3sOozEwtKqC5fj/jTt5JLKcpA2enDHuiEZlnPSxVC/rdVdb26RwfFXKQQFK2Jg28c3kBfBAM5FhtuC"
    type: "BTC"
  */
  console.log('data:', data)
  const account = data.account;
  const burnFee = data.inputBurnFee;
  const debugMode = data.debugMode;
  const authCode = data.authCode;


  const key = keyGen();
  const seed = aes256Decrypt(account.skEnc, key, account.iv, account.authTag);
  const authKey = keyDerive(authCode);
  if (seed) {
    const encInfo = aes256Encrypt(seed, authKey);
    if (encInfo) {
      const [enc, iv, authTag] = encInfo;
      return request(`${miningLocalServer_endpoint}/startMining`, {
        method: 'POST',
        data: {
          address: account.address,
          seed: {
            seedEnc: enc.toString('hex'),
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
          },
          burnchainInfo: {
            peerHost: sysConf.btcNodeInfo?.peerHost || '',
            username: sysConf.btcNodeInfo?.username || '',
            password: sysConf.btcNodeInfo?.password || '',
            rpcPort: sysConf.btcNodeInfo?.rpcPort || 0,
            peerPort: sysConf.btcNodeInfo?.peerPort || 0,
          },
          burn_fee_cap: burnFee,
          debugMode: debugMode,
          network: data.network
        }
      });
    }
  } else {
    message.error('Params error');
    return;
  }
}


export async function stopMining() {
  return request(`${miningLocalServer_endpoint}/stopMining`, {
    method: 'POST',
    data: {
      network: getNetworkFromStorage(),
    }
  }).then((resp) => {
    console.log(resp);
    return resp
  })
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

export async function isValidAuthCode(password: string) {
  const ping = 'ping';
  const authKey = keyDerive(password);
  const encInfo = aes256Encrypt(ping, authKey);
  if (encInfo) {
    const [enc, iv, authTag] = encInfo;
    return request(`${miningLocalServer_endpoint}/isValidAuthCode`, {
      method: 'POST',
      data: {
        pingEnc: enc.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      },
    });
  } else {
    message.error('Params error');
    return { status: 500 };
  }
}