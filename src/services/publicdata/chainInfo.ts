import { request } from 'umi';
import { ChainInfo, BlockInfo, TxInfo } from './data';

const {
    nodeKryptonURL,
    sidecarURL,
    sidecarURLKrypton
} = require('@/services/constants')


export async function getChainInfo() {
    return request(`${nodeKryptonURL}/v2/info`, {
        method: 'GET',
    }).then((resp: { stacks_tip_height: string; stable_burn_block_height: string; }) => {
        const chainInfoList: ChainInfo[] = [];
        chainInfoList.push({
            stacksChainHeight: resp.stacks_tip_height,
            burnChainHeight: resp.stable_burn_block_height,
        })
        // let chainInfo: ChainInfo = { stacksChainHeight: '', burnChainHeight: '' }
        // chainInfo.stacksChainHeight = resp.lastStacksChainTipHeight;
        // chainInfo.burnChainHeight = resp.lastBurnBlockHeight;
        return { 'data': chainInfoList };
    })
}

export async function getBlockInfo() {
    return request(`${sidecarURLKrypton}/v1/block?limit=5`, {
        method: "GET"
    }).then(async (resp) => {
        console.log(resp)
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
    return request(`${sidecarURLKrypton}/v1/tx/${tx_id}`, {
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
