import { request } from 'umi';
import { ChainInfo, BlockInfo, TxInfo } from './data'

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

export async function getTxInfo(tx_id){
    console.log("in")
    return request(`https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/tx/${tx_id}`,{
        method: "GET"
    }).then((resp:TxInfo)=>{
        console.log(resp)
    })
}