// https://www.blockcypher.com/dev/bitcoin/#txref
export interface TXRef {
  address?: string;
  block_height: number;
  tx_hash: string;
  tx_input_n: number;
  tx_output_n: number;
  value: number;
  prference: string;
  spent: boolean;
  double_spend: boolean;
  confirmations: boolean;
  script?: string;
  ref_balance?: number;
  confidence?: number;
  confirmed?: time;
  spent_by?: string;
  received?: time;
  receive_count?: number;
  double_of?: string;
}

export interface TxInput {
  prev_hash: string;
  output_index: number;
  output_value: number;
  script_type: string;
  script: string;
  addresses: string[];
  sequence: number;
  age?: number;
  wallet_name?: string;
  wallet_token?: string;
}

export interface TxOutput {
  value: number;
  script: string;
  addresses: string[];
  script_type?: string;
  data_hex?: string;
  data_string?: string;
}

export interface Tx {
  block_height: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by: string;
  received: string;
  ver: number;
  lock_time: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  inputs: TxInput[];
  outputs: TxOutput[];
  opt_in_rbf?: boolean;
  confidence?: number;
  confirmed?: string;
  receive_count?: number;
  change_address?: string;
  block_hash?: string;
  block_index?: number;
  double_of?: string;
  data_protocol?: string;
  hex?: string;
  next_inputs?: string;
  next_outputs?: string;
}

export interface Wallet {
  token: string;
  name: string;
  addresses: string[];
}

export interface Address {
  address?: string;
  wallet?: Wallet;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  tx_url?: string;
  txrefs?: TxRef[];
  txs: Tx[];
  unconfirmed_txrefs?: Txref[];
  hasMore?: boolean;
}
export interface PoolContributerInfo {
  address: string;
  contribution: number;
  lastCycleContribution?: number;
  lastBlockContribution?: number;
}
