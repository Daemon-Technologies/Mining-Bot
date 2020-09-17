// wrapped token price entity
export interface Account {
    address: string; // such as ST1ZFAP71CCAHCM54VSRN8AWTZ29M8R6WYE4YA3WW
    type: string; // such as STX/BTC
    balance: string; // such as 0.23493812
}

export interface NewAccount {
    password: string;
    mnemonic: string;
}

class CLITransactionSigner implements TransactionSigner {
  address: string;
  isComplete: boolean;
   
  constructor(address: string = '') {
    this.address = address;
    this.isComplete = false;
  }

  getAddress() : Promise<string> {
    return Promise.resolve().then(() => this.address);
  }

  signTransaction(_txIn: bitcoinjs.TransactionBuilder, _signingIndex: number) : Promise<void> {
    return Promise.resolve().then(() => {});
  }

  signerVersion() : number { return 0; }
}