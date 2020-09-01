// wrapped token price entity
export interface TokenPrice {
    tradingPair: string; // such as STX/USDT
    price: number; // such as 0.23493812
}

// wrapped chain info entity
export interface ChainInfo {
    stacksChainHeight: string; // such as 500
    burnChainHeight: string; // such as 600
}
