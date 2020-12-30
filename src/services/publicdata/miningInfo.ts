import { request } from 'umi';

const { miningMonitorServer_endpoint } = require('@/services/constants')

export async function getMinerInfo() {
    return request(`${miningMonitorServer_endpoint}/mining_info`, {
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