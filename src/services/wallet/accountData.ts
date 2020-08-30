// import { request } from 'umi';
import { Account } from "./data"

export function getAccount(){
    const resp:Account[] = [];
    const STX_STJ = localStorage.getItem("STX");
    const BTC_STJ = localStorage.getItem("BTC");
    console.log(STX_STJ, BTC_STJ)
    if (STX_STJ){
        const STX_RES : Account = JSON.parse(STX_STJ);
        resp.push(STX_RES)
    }  
    return resp
}

export function updateAccount(){
    return {'stx': "STX123456789"}
}


