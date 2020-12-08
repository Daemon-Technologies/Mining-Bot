import { request } from 'umi';
import { ChainInfo, BlockInfo, TxInfo } from './data';

const {
  nodeStatusURL,
  sidecarURL,
  sidecarTxURL
} = require('@/services/constants')


export async function getChainInfo() {
    return request(`${nodeStatusURL}/json`, {
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
    return request(`${sidecarURL}/v1/block?limit=5`,{
        method: "GET"
    }).then(async (resp) =>{
        console.log(resp)
        const results:BlockInfo = await Promise.all(
            resp.results.map(async (item: BlockInfo) => {
                const {txs} = item
                let totalFee = 0;
                await Promise.all(txs.map(async (itemTxInfo: any)=>{
                    const respTxInfo = await getTxInfo(itemTxInfo)
                    totalFee += parseInt(respTxInfo.data.fee_rate as string, 10);
                    return itemTxInfo
                }))
                return {...item, total_fee:totalFee, canonical:item.canonical ? "success" : "pending"} as BlockInfo
            })
        )
        return {'data':results}
    })
}

export async function getTxInfo(tx_id: any){
    return request(`${sidecarTxURL}/${tx_id}`,{
        method: "GET"
    }).then((resp:TxInfo)=>{
        return {'data' : resp}
    })
}

export async function getTxsInfo(txs: string[]){
    const data : TxInfo[] = [];
    await Promise.all(txs.map(async (item: any)=>{
        const resp = await getTxInfo(item)
        data.push(resp.data as TxInfo)
    }))
    return {'data' : data}
}
