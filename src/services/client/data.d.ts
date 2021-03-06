// wrapped token price entity
export interface Client {

}

export interface BitcoinAccountInfo {
  address: string; // such as n4e9BRjiNm8ANt94eyoMofxNQoKQxHN2jJ
  balance: string; // such as 0.093812
}

export interface MinerInfo {
  stx_address: string;
  btc_address: string;
  actual_win: number;
  total_win?: number;
  total_mined: number;
  miner_burned: number;
}

export interface MinerInfoQueryParams {
  stx_address?: string;
  btc_address?: string;
  current?: number;
  pageSize?: number;
}


export interface MiningInfo {
  stx_address: string;
  btc_address: string;
  burn_fee: number;
  stacks_block_height: number;
}

export interface BlockCommitInfo {
  leader_key_address: string;
  btc_address: string;
  burn_fee: string;
}

export interface BlockInfo {
  block_commit: BlockCommitInfo;
  stacks_block_height: number;
  sum_miners_amount: number;
  sum_burn_fee: number;
}

export interface MiningInfoQueryParams {
  stx_address?: string;
  btc_address?: string;
  burn_fee?: number;
  stacks_block_height?: number;
  current?: number;
  pageSize?: number;
}

export interface ChainSyncInfo {
  burn_block_height: number | string;
  stacks_tip_height: number | string;
  stacks_tip: string;
  type: number;
}

export interface SpendInfo {
  per_tx: number;
  register_spend: number;
  one_hour_spend: number;
}