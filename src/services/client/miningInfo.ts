import { request } from 'umi';
import { getSysConf } from '../sysConf/conf';

const sysConf = getSysConf();
const miningMonitorServer_endpoint = sysConf.miningMonitorUrl;


export async function getMinerInfo(params: any) {
    return request(`${miningMonitorServer_endpoint}/miner_info?page=${params.current}&size=${params.pageSize}`, {
        method: 'GET',
        timeout: 30000,
    }).then(data => {
        
        return { 'data': data.data, 'success': true, 'total': data.total };
    });
}

export async function getMiningInfo() {
    return request(`${miningMonitorServer_endpoint}/mining_info?latest=9`, {
        method: 'GET',
        timeout: 30000,
    }).then(data => {
        return { 'data': data, 'success': true };
    });
}

export async function getBlockInfo() {
    console.log("in getBlockInfo")
    return request(`${miningMonitorServer_endpoint}/block_info?latest=0`, {
        method: 'GET',
        timeout: 30000,
    }).then(data => {
        return { 'data': data, 'success': true };
    });
}