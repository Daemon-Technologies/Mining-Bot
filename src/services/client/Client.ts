import { request } from 'umi';
import { keyGen, aes256Decrypt, keyDerive, aes256Encrypt, getNetworkFromStorage } from "@/utils/utils";
import { Account } from '@/services/wallet/data'
import { ChainSyncInfo } from './data';
import { getSysConf } from '../sysConf/conf';
import { message } from 'antd';
import { NodeInfo } from '../sysConf/data';


const { nodeXenonURL, nodeMainnetURL } = require('@/services/constants');

export async function getNodeStatus() {
  return request(`${getSysConf().miningLocalServerUrl}/getNodeStatus`, {
    method: 'POST',
    data: {
      network: getNetworkFromStorage(),
    }
  }).then((resp) => {
    return resp
  }).catch((error) => {
    return error
  })
}

export async function startMining(data: { account: Account, inputBurnFee: number, inputFeeRate: number, debugMode: boolean, nodeInfo: NodeInfo, authCode: string, network: string }) {
  /*
    address: "n4e9BRjiNm8ANt94eyoMofxNQoKQxHN2jJ"
    authTag: "a4df9c8972d554a4108b0aaff87e8ccb"
    balance: 0
    iv: "8391f569a642fae79e61872e528934d1"
    skEnc: "xBw3XtUuI/3sOozEwtKqC5fj/jTt5JLKcpA2enDHuiEZlnPSxVC/rdVdb26RwfFXKQQFK2Jg28c3kBfBAM5FhtuC"
    type: "BTC"
  */
  const account = data.account;
  const burnFee = data.inputBurnFee;
  const feeRate = data.inputFeeRate;
  const debugMode = data.debugMode;
  const authCode = data.authCode;
  const nodeInfo = data.nodeInfo;
  const key = keyGen();
  const seed = aes256Decrypt(account.skEnc, key, account.iv, account.authTag);
  const authKey = keyDerive(authCode);
  if (seed) {
    const encInfo = aes256Encrypt(seed, authKey);
    const nodeInfoStr = JSON.stringify(nodeInfo);
    const encNodeInfo = aes256Encrypt(nodeInfoStr, authKey);
    if (encInfo && encNodeInfo) {
      const [enc, iv, authTag] = encInfo;
      const [nodeEnc, nodeIv, nodeAuthTag] = encNodeInfo;
      return request(`${getSysConf().miningLocalServerUrl}/startMining`, {
        method: 'POST',
        data: {
          address: account.address,
          seed: {
            seedEnc: enc.toString('hex'),
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
          },
          burnchainInfo: {
            infoEnc: nodeEnc.toString('hex'),
            iv: nodeIv.toString('hex'),
            authTag: nodeAuthTag.toString('hex'),
          },
          burn_fee_cap: burnFee,
          satoshi_per_bytes: feeRate,
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
  return request(`${getSysConf().miningLocalServerUrl}/stopMining`, {
    method: 'POST',
    data: {
      network: getNetworkFromStorage(),
    }
  }).then((resp) => {
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
  return request(`${getSysConf().miningLocalChainUrl}/v2/info`, { method: 'GET', timeout: 3000, });
}

export async function getMainChainInfo() {
  let baseURL = nodeXenonURL;
  switch (getNetworkFromStorage()) {
    case "Xenon": baseURL = nodeXenonURL;
      break;
    case "Mainnet": baseURL = nodeMainnetURL;
    default: break;
  }
  return request(`${baseURL}/v2/info`, { method: 'GET', timeout: 3000, });
}

export async function isValidAuthCode(password: string) {
  const ping = 'ping';
  const authKey = keyDerive(password);
  const encInfo = aes256Encrypt(ping, authKey);
  if (encInfo) {
    const [enc, iv, authTag] = encInfo;
    return request(`${getSysConf().miningLocalServerUrl}/isValidAuthCode`, {
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