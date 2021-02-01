// wrapped token price entity
export interface Account {
    address: string; // such as ST1ZFAP71CCAHCM54VSRN8AWTZ29M8R6WYE4YA3WW
    type: string; // such as STX/BTC
    balance: string; // such as 0.23493812
    skEnc: string; // encrypted private key
    iv: string;
    authTag: string;
}

export interface NewAccount {
    mnemonic?: string;
    type?: 1 | 2;
}
