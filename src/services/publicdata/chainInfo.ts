import { request } from 'umi';
import { ChainInfo, BlockInfo } from './data'

export async function getChainInfo() {
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

export async function getBlockInfo(){
    return request('https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/block?limit=10',{
        method: "GET"
    }).then((resp:BlockInfo) =>{
        console.log(resp);
        console.log({'data':resp.results})
        return {'data':resp.results}
    })
}