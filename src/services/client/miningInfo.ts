import { request } from 'umi';
import { getSysConf } from '../sysConf/conf';

const sysConf = getSysConf();
const miningMonitorServer_endpoint = sysConf.miningMonitorUrl;


export async function getMinerInfo() {
    return request(`${miningMonitorServer_endpoint}/miner_info`, {
        method: 'GET',
        timeout: 30000,
    }).then(data => {
        return { 'data': data.miner_info, 'success': true };
    });
}

export async function getMiningInfo() {
    return request(`${miningMonitorServer_endpoint}/mining_info`, {
        method: 'GET',
        timeout: 30000,
    }).then(data => {
        return { 'data': data.mining_info, 'success': true };
    });
}