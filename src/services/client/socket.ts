import { io } from 'socket.io-client';
let socket;
export const initiateSocket = () => {
    socket = io('http://localhost:5000',{transports: ['websocket']});
    console.log(`Connecting socket...`);

  }
  
export const subscribePercent = (cb) => {
    if (!socket) return(true);
    socket.on('download_info', msg => {
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