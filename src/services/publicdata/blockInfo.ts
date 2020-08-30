import { request } from 'umi';
import { ChainInfo } from './data'

export async function getBlockChainInfo() {
    return request('https://status.test-blockstack.com/json', {
        method: 'GET',
    }).then((resp: { lastStacksChainTipHeight: string; lastBurnBlockHeight: string; }) => {
        const chainInfoList: ChainInfo[] = [];
        chainInfoList.push({
            stacksChainHeight: resp.lastStacksChainTipHeight,
            burnChainHeight: resp.lastBurnBlockHeight,
        })
        // let chainInfo: ChainInfo = { stacksChainHeight: '', burnChainHeight: '' }
        // chainInfo.stacksChainHeight = resp.lastStacksChainTipHeight;
        // chainInfo.burnChainHeight = resp.lastBurnBlockHeight;
        return { 'data': chainInfoList };
    })
}