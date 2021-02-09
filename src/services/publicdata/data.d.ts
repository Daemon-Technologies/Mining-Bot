// wrapped token price entity

export interface BinanceResp {
    symbol: string,
    price: string
}

export interface TokenPrice {
    tradingPair: string; // such as STX/USDT
    price: string; // such as 0.23493812
}

// wrapped chain info entity
export interface ChainInfo {
    stacksChainHeight: string; // such as 500
    burnChainHeight: string; // such as 600
}

export interface BlockInfo {
    results: any;
    canonical: boolean | string;
    height: number;
    hash: string;
    parent_block_hash: string;
    burn_block_time: number;
    burn_block_time_iso: string;
    txs: string[];
    total_fee?: number;
}

export interface TxInfo {
    tx_id: string;
    tx_status: string;
    tx_type: string;
    fee_rate: string;
    sender_address?: string;
    sponsored?: boolean;
    post_condition_mode?: string;
    block_hash?: string;
    block_height?: number;
    burn_block_time?: number;
    canonical?: boolean;
    tx_index?: number;
    tx_result?: {
        hex: string,
        repr: string
    };
    coinbase_payload?: {
        data: string
    };
}




/*
STX address - actual wins/total wins/total mined - % won - % actual wins - burn satoshis
ST1ZFAP71CCAHCM54VSRN8AWTZ29M8R6WYE4YA3WW 105/656/1859 35.29% 2.40% 18590000
ST2BP6PK4V5FKBZS5Q3T2QXF1DGWTF17EBBTKAT72 34/241/474 50.84% 0.78% 4740000
ST2TJRHDHMYBQ417HFB0BDX430TQA5PXRX6495G1V 3469/5618/9950 56.46% 79.16% 99500000
ST2Z840ZWSF54AFGB1QAEVJ8S8ME7H5BP81C6HJ19 388/1695/3964 42.76% 8.85% 39640000
ST3RMK4C9TXHE2CPYB58WB5MK8R4SZE8E0K6EJED5 0/813/1886 43.11% 0.00% 18860000
ST3WCQ6S0DFT7YHF53M8JPKGDS1N1GSSR91677XF1 357/712/1884 37.79% 8.15% 18840000
ST4ZD7PZ8VVF4G5T2F7QH84TS7CTRHX52ECJ2A2Q 0/68/195 34.87% 0.00% 1950000
ST539ZESD7D7RDNHD7MYSM1E3RQ9MNB77QC5CQG2 29/149/333 44.74% 0.66% 3330000
*/
