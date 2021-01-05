import { getNetworkFromStorage } from '@/utils/utils';
import { io } from 'socket.io-client';
import { getSysConf } from '../sysConf/conf';
let socket: any;
export const initiateSocket = () => {
    const sysConf = getSysConf();
    socket = io(sysConf.miningLocalServerUrl + ':5000', { transports: ['websocket'] });
    console.log(`Connecting socket...`);

}

export const subscribePercent = (cb) => {
    if (!socket) return (true);
    socket.on('download_info', (msg: any) => {
        //console.log(msg*100)
        return cb(null, msg);
    })
}

export const subscribeDownloadFinish = (cb) => {
    if (!socket) return (true);
    socket.on('download_complete', (msg: any) => {
        //console.log(msg*100)
        return cb(null, msg);
    })
}

export const startDownload = () => {
    console.log("in")
    if (socket) socket.emit('download', getNetworkFromStorage());
}

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
}