import { getNetworkFromStorage, getPageQuery } from "@/utils/utils";
import { message } from "antd";
import { stringify } from "qs";
import { history, request } from "umi";
import { NodeInfo, SysConf } from "./data";

const miningLocalServer_endpoint = "http://" + window.location.hostname;

const { miningMonitorServer_endpoint,
    MiningPasswordAuthorization, MiningPassword,
    miningNodeListServer_endpoint } = require('@/services/constants');

const officialNodeInfo: NodeInfo = {
    peerHost: 'bitcoind.xenon.blockstack.org',
    username: 'blockstack',
    password: 'blockstacksystem',
    rpcPort: 18332,
    peerPort: 18333,
}

export function getSysConf(): SysConf {
    let confInfo: SysConf = {
        miningLocalServerUrl: miningLocalServer_endpoint,
        miningMonitorUrl: miningMonitorServer_endpoint,
        btcNodeInfo: officialNodeInfo,
    }
    const conf_STJ = localStorage.getItem('BOT_SysConf');
    if (conf_STJ) {
        confInfo = JSON.parse(conf_STJ);
    }
    return confInfo;
}

export function updateSysConf(conf: SysConf) {
    if (conf && conf.miningMonitorUrl && conf.miningLocalServerUrl && conf.btcNodeInfo) {
        const confStr = JSON.stringify(conf);
        localStorage.setItem('BOT_SysConf', confStr);
        message.success('Update sytem configuraton successfully');
    } else {
        message.error('Params error');
    }
    window.location.reload();
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