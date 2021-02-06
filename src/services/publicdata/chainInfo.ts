import { request } from 'umi';
import { ChainInfo, BlockInfo, TxInfo } from './data';
import { getNetworkFromStorage } from '@/utils/utils'
import { getSysConf } from '../sysConf/conf';

const {
    nodeXenonURL,
    nodeMainnetURL,
    sidecarURLMainnet
} = require('@/services/constants')



export async function getChainInfo() {
    let baseURL = nodeXenonURL;
    switch (getNetworkFromStorage()) {
        case "Xenon": baseURL = nodeXenonURL;
            break;
        case "Mainnet": baseURL = nodeMainnetURL;
            break; //TODO
        default: break;
    }
    let result;
    try {
        result = await request(`${baseURL}/v2/info`, {
            method: 'GET',
            timeout: 5000,
        })
    }
    catch (error) {
        result = undefined
    }
    const chainInfoList: ChainInfo[] = [];
    chainInfoList.push({
        stacksChainHeight: (result == undefined ? "NaN" : result.stacks_tip_height),
        burnChainHeight: (result == undefined ? "NaN" : result.stable_burn_block_height),
    })

    return { 'data': chainInfoList } //new Promise((resolve)=>{resolve(chainInfoList)})
}

export async function getBlockInfo() {
    let baseURL = sidecarURLMainnet;
    const confInfo = getSysConf();
    switch (getNetworkFromStorage()) {
        case "Xenon": baseURL = confInfo.sidecarUrl; break;
        case "Mainnet": baseURL = confInfo.sidecarUrl; break;
        default: break;
    }
    return request(`${baseURL}/v1/block?limit=5`, {
        method: "GET"
    }).then(async (resp) => {
        const results: BlockInfo = await Promise.all(
            resp.results.map(async (item: BlockInfo) => {
                const { txs } = item
                let totalFee = 0;
                await Promise.all(txs.map(async (itemTxInfo: any) => {
                    const respTxInfo = await getTxInfo(itemTxInfo)
                    totalFee += parseInt(respTxInfo.data.fee_rate as string, 10);
                    return itemTxInfo
                }))
                return { ...item, total_fee: totalFee, canonical: item.canonical ? "success" : "pending" } as BlockInfo
            })
        )
        return { 'data': results }
    })
}

export async function getTxInfo(tx_id: any) {
    let baseURL = sidecarURLMainnet;
    const confInfo = getSysConf();
    console.log('confINfo:', confInfo.sidecarUrl)
    switch (getNetworkFromStorage()) {
        case "Xenon": baseURL = confInfo.sidecarUrl; break;
        case "Mainnet": baseURL = confInfo.sidecarUrl; break;
        default: break;
    }
    return request(`${baseURL}/v1/tx/${tx_id}`, {
        method: "GET"
    }).then((resp: TxInfo) => {
        return { 'data': resp }
    })
}

export async function getTxsInfo(txs: string[]) {

    const data: TxInfo[] = [];
    await Promise.all(txs.map(async (item: any) => {
        const resp = await getTxInfo(item)
        data.push(resp.data as TxInfo)
    }))
    return { data: data }
}
