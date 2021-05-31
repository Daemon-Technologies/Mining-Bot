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
