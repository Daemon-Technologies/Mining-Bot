import { getMiningInfo } from "@/services/publicdata/miningInfo";
import { MiningInfo, MiningInfoQueryParams } from "@/services/publicdata/data";
import { useState } from "react";

export interface MiningInfoState {
    miningInfoList: MiningInfo[],
}

export default () => {
    let [minerInfoState, setMiningInfoState] = useState<MiningInfoState>();
    const queryMiningInfo = async (params: MiningInfoQueryParams) => {
        const miningInfo = await getMiningInfo();
        let data = miningInfo.data.filter((row: MiningInfo) => row.stx_address.includes(params.stx_address || ''));
        data = data.filter((row: MiningInfo) => row.btc_address.includes(params.btc_address || ''));
        miningInfo.data = data;
        setMiningInfoState({
            miningInfoList: miningInfo.data,
        })
        return miningInfo;
    }
    return {
        minerInfoState,
        queryMiningInfo,
    }
}