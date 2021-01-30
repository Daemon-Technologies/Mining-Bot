import { getChainSyncInfo } from "@/services/client/Client";
import { ChainSyncInfo } from "@/services/client/data";
import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useState } from "react";

export interface ChainSyncInfoState {
    chainSyncInfoList: ChainSyncInfo[],
}

export default () => {
    // state
    let [chainSyncInfoState, setChainSyncInfoState] = useState<ChainSyncInfoState>();
    // query funciton
    const queryChainSyncInfo = async () => {
        const chainSyncInfo: API.RequestResult = await getChainSyncInfo();
        if (chainSyncInfo.status === 201) {
            message.warning(showMessage('链信息无法获取', 'Can not get chain info'));
        }
        chainSyncInfoState = {
            chainSyncInfoList: chainSyncInfo.data,
        }
        // update state
        setChainSyncInfoState(chainSyncInfoState);
        return chainSyncInfo;
    }

    return {
        chainSyncInfoState,
        queryChainSyncInfo,
    }

}
