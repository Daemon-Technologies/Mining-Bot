// wrapped token price entity
export interface Client {

}

export interface BitcoinAccountInfo {
  address: string; // such as n4e9BRjiNm8ANt94eyoMofxNQoKQxHN2jJ
  balance: string; // such as 0.093812
}

export interface MiningInfo {
  stx_address: string;
  btc_address: string;
  actual_win: number;
  total_win: number;
  total_mined: number;
  miner_burned: number;
}