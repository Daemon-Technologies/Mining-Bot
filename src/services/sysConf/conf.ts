import { getNetworkFromStorage, getPageQuery } from "@/utils/utils";
import { message } from "antd";
import { stringify } from "qs";
import { history, request } from "umi";
import { NodeInfo, SysConf } from "./data";

const miningLocalServer_endpoint = "http://" + window.location.hostname;

const { miningMonitorServer_endpoint,
    MiningPasswordAuthorization, MiningPassword,
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
        miningMonitorUrl: miningMonitorServer_endpoint,
    };
    switch (network) {
        case 'Krypton': {
            const conf_STJ = localStorage.getItem('Krypton_SysConf');
            if (conf_STJ) {
                confInfo = JSON.parse(conf_STJ);
            }
            break;
        }
        case 'Xenon': {
            confInfo = {
                miningLocalServerUrl: miningLocalServer_endpoint,
                miningMonitorUrl: miningMonitorServer_endpoint,
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
    if (conf && conf.miningMonitorUrl && conf.miningLocalServerUrl && conf.btcNodeInfo) {
        const confStr = JSON.stringify(conf);
        switch (network) {
            case 'Krypton': {
                localStorage.setItem('Krypton_SysConf', confStr);
                break;
            }
            case 'Xenon': {
                localStorage.setItem('Xenon_SysConf', confStr);
                break;
            }
            case 'Mainnet': {
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
