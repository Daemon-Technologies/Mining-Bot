import { getMinerInfo } from "@/services/client/miningInfo";
import { MinerInfo, MinerInfoQueryParams } from "@/services/client/data";
import { useState } from "react";

export interface MinerInfoState {
    minerInfoList: MinerInfo[],
}

export default () => {
    // state
    let [minerInfoState, setMinerInfoState] = useState<MinerInfoState>({ minerInfoList: [] });
    // query funciton
    const queryMinerInfo = async (params: MinerInfoQueryParams) => {
        let minerInfo = await getMinerInfo(params);

        let data = minerInfo.data.filter((row: MinerInfo) => row.stx_address.includes(params.stx_address || ''));
        data = data.filter((row: MinerInfo) => row.btc_address.includes(params.btc_address || ''));
        minerInfo.data = data;
        minerInfoState = {
            minerInfoList: minerInfo.data,
        };
        setMinerInfoState(minerInfoState)
        return minerInfo;
    }

    return {
        minerInfoState,
        queryMinerInfo,
    }

}
