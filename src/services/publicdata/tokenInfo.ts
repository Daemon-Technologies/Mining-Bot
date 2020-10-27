import { request } from 'umi';
import { TokenPrice, BinanceResp } from './data.d';
const { binanceAPIURL } = require('@/services/constants')

export async function getTokenPrice() {
    // initialize the response entity
    const tokenInfo: TokenPrice[] = [];
    // get price of STXUSDT
    await request(`${binanceAPIURL}/ticker/price?symbol=STXUSDT`, {
        method: 'GET',
    }).then((resp: BinanceResp) => {
        tokenInfo.push({
            tradingPair: 'STX/USDT',
            price: resp.price,
        })
    });
    // get price of BTCUSDT
    await request(`${binanceAPIURL}/ticker/price?symbol=BTCUSDT`, {
        method: 'GET',
    }).then((resp: BinanceResp) => {
        tokenInfo.push({
            tradingPair: 'BTC/USDT',
            price: resp.price,
        })
    });
    // get price of STXBTC
    // eslint-disable-next-line no-return-await
    return await request(`${binanceAPIURL}/ticker/price?symbol=STXBTC`, {
        method: 'GET',
    }).then((resp: BinanceResp) => {
        tokenInfo.push({
            tradingPair: 'STX/BTC',
            price: resp.price,
        })
        return { 'data': tokenInfo }
    });
}
