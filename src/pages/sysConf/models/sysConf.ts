import { getNodeInfo } from "@/services/sysConf/conf";
import { NodeInfo } from "@/services/sysConf/data";
import { useState } from "react";

export default () => {
    const [nodeList, setNodeList] = useState<NodeInfo[]>([]);

    const getNodeList = async () => {
        const nodeInfoRes: { status: number; data?: any; message?: string; } = await getNodeInfo();
        if (nodeInfoRes && nodeInfoRes.status === 200) {
            setNodeList(nodeInfoRes.data);
        }
    }

    return {
        nodeList,
        getNodeList,
    }

}