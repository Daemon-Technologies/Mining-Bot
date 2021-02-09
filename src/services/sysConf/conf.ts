import { getNetworkFromStorage, getPageQuery } from "@/utils/utils";
import { message } from "antd";
import { stringify } from "qs";
import { history, request } from "umi";
import { NodeInfo, SysConf } from "./data";

const miningLocalServer_endpoint = "http://" + window.location.hostname + ':5000';
const miningLocalChain_endpoint = "http://" + window.location.hostname + ':20443';

const { miningMonitorServer_endpoint, miningMonitorServer_Mainnet,
    MiningPasswordAuthorization, MiningPassword, sidecarURLMainnet, sidecarURLXenon,
    miningNodeListServer_endpoint } = require('@/services/constants');

const defaultNodeInfo: NodeInfo = {
    peerHost: 'Your Bitcoin Peer Host',
    username: 'Your Username',
    password: 'Your Password',
    rpcPort: 18332,
    peerPort: 18333,
}

export function getSysConf(): SysConf {
    const network = getNetworkFromStorage();
    let confInfo: SysConf = {
        miningLocalServerUrl: miningLocalServer_endpoint,
        miningLocalChainUrl: miningLocalChain_endpoint,
        miningMonitorUrl: miningMonitorServer_endpoint,
        sidecarUrl: sidecarURLMainnet,
    };
    switch (network) {
        case 'Xenon': {
            confInfo = {
                miningLocalServerUrl: miningLocalServer_endpoint,
                miningLocalChainUrl: miningLocalChain_endpoint,
                miningMonitorUrl: miningMonitorServer_endpoint,
                sidecarUrl: sidecarURLXenon,
                btcNodeInfo: defaultNodeInfo,
            }
            const conf_STJ = localStorage.getItem('Xenon_SysConf');
            if (conf_STJ) {
                confInfo = JSON.parse(conf_STJ);
                if (!confInfo.btcNodeInfo) {
                    confInfo.btcNodeInfo = defaultNodeInfo;
                }
            }
            break;
        }
        case 'Mainnet': {
            confInfo = {
                miningLocalServerUrl: miningLocalServer_endpoint,
                miningLocalChainUrl: miningLocalChain_endpoint,
                miningMonitorUrl: miningMonitorServer_Mainnet,
                sidecarUrl: sidecarURLMainnet,
                btcNodeInfo: defaultNodeInfo,
            }
            const conf_STJ = localStorage.getItem('Mainnet_SysConf');
            if (conf_STJ) {
                confInfo = JSON.parse(conf_STJ);
                if (!confInfo.btcNodeInfo) {
                    confInfo.btcNodeInfo = defaultNodeInfo;
                }
            }
            break;
        }
        default: {
            break;
        }

    }
    return confInfo;
}

export function updateSysConf(conf: SysConf) {
    const network = getNetworkFromStorage();
    if (conf && conf.miningMonitorUrl && conf.miningLocalServerUrl && conf.miningLocalChainUrl && conf.sidecarUrl && conf.btcNodeInfo) {
        const confStr = JSON.stringify(conf);
        switch (network) {
            case 'Xenon': {
                localStorage.setItem('Xenon_SysConf', confStr);
                break;
            }
            case 'Mainnet': {
                localStorage.setItem('Mainnet_SysConf', confStr);
                break;
            }
            default: {
                break;
            }
        }
        message.success('Update sytem configuraton successfully');
    } else {
        message.error('Params error');
    }
    // window.location.reload();
    return;
}

export function updateNodeInfo(nodeInfo: NodeInfo) {
    let sysConf = getSysConf();
    if (nodeInfo) {
        sysConf.btcNodeInfo = nodeInfo;
        updateSysConf(sysConf);
    }
}

export async function getNodeInfo() {
    const currentNetwork = getNetworkFromStorage();

    return request(miningNodeListServer_endpoint, {
        method: 'POST',
        data: {
            network: currentNetwork
        }
    });
}

export function resetLockPassword() {
    localStorage.removeItem(MiningPasswordAuthorization);
    localStorage.removeItem('BTC');
    localStorage.removeItem('STX');
    sessionStorage.removeItem(MiningPassword);
    const { redirect } = getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: window.location.href,
            }),
        });
    }
}
