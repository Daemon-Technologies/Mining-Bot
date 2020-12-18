import { io } from 'socket.io-client';
let socket : any;
export const initiateSocket = () => {
    socket = io('http://'+window.location.hostname+':5000',{transports: ['websocket']});
    console.log(`Connecting socket...`);

}
  
export const subscribePercent = (cb) => {
    if (!socket) return(true);
    socket.on('download_info', (msg:any) => {
        //console.log(msg*100)
        return cb(null, msg);
    })
}

export const subscribeDownloadFinish = (cb) => {
    if (!socket) return(true);
    socket.on('download_complete', (msg:any) => {
        //console.log(msg*100)
        return cb(null, msg);
    })
}

export const startDownload = () => {
    console.log("in")
    if (socket) socket.emit('download', "1");
}

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if(socket) socket.disconnect();
}