export interface SysConf {
    miningLocalServerUrl: string;
    miningMonitorUrl: string;
    btcNodeInfo?: NodeInfo;
}

export interface NodeInfo {
    peerHost: string;
    username: string;
    password: string;
    rpcPort: number;
    peerPort: number;
}