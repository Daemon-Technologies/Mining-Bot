import { request } from 'umi';

import { TokenPrice } from './data.d';

export async function getTokenPrice() {
    // initialize the response entity
    let tokenInfo: TokenPrice[] = [];
    // get price of STXUSDT
    await request('https://api.binance.com/api/v3/avgPrice?symbol=STXUSDT', {
        method: 'GET',
    }).then((resp: { mins: number; price: number; }) => {
        tokenInfo.push({
            tradingPair: 'STX/USDT',
            price: resp.price,
        })
    });
    // get price of BTCUSDT
    await request('https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT', {
        method: 'GET',
    }).then((resp: { mins: number; price: number; }) => {
        tokenInfo.push({
            tradingPair: 'BTC/USDT',
            price: resp.price,
        })
    });
    // get price of STXBTC
    return await request('https://api.binance.com/api/v3/avgPrice?symbol=STXBTC', {
        method: 'GET',
    }).then((resp: { mins: number; price: number; }) => {
        tokenInfo.push({
            tradingPair: 'STX/BTC',
            price: resp.price,
        })
        return { 'data': tokenInfo }
    });
}