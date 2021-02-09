import { getBlockInfo } from "@/services/client/miningInfo";
import { BlockCommitInfo, BlockInfo } from "@/services/client/data";
import { useState } from "react";



export default () => {
    // state
    let [blockInfoState, setBlockInfoState] = useState<BlockInfo>();
    // query funciton
    const queryBlockInfo = async () => {
        let blockInfo = await getBlockInfo();
        console.log(blockInfo.data[0].commit_value_list)
        
        return {data: blockInfo.data[0].commit_value_list};
    }

    return {
        blockInfoState,
        queryBlockInfo,
    }

}
