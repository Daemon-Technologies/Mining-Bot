import { getNodeInfo } from "@/services/sysConf/conf";
import { NodeInfo } from "@/services/sysConf/data";
import { useState } from "react";

export default () => {
    const [nodeList, setNodeList] = useState<NodeInfo[]>([]);

    const getNodeList = async () => {
        const nodeInfo_STJ = localStorage.getItem('Xenon_NodeInfo');
        let nodeInfo: NodeInfo[] = [];
        if (nodeInfo_STJ) {
            nodeInfo = JSON.parse(nodeInfo_STJ);
            setNodeList(state => [...state, ...nodeInfo])
        }
        const nodeInfoRes: { status: number; data?: any; message?: string; } = await getNodeInfo();
        if (nodeInfoRes && nodeInfoRes.status === 200) {
            setNodeList(state => [...state, ...nodeInfoRes.data])
        }

    }

    return {
        nodeList,
        getNodeList,
    }

}