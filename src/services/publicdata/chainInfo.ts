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
    return request('https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/block?limit=3',{
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
                const t:BlockInfo = {...item, total_fee:totalFee, canonical:item.canonical ? "success" : "pending"}
                return t
            })
        )
        console.log({'data':results})
        return {'data':results}
    })
}

export async function getTxInfo(tx_id: any){
    return request(`https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/tx/${tx_id}`,{
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