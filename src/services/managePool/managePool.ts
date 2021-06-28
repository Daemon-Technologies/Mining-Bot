import { getNetworkFromStorage } from "@/utils/utils";
import request from "umi-request";
import { Address, Tx, PoolContributerInfo } from "./data";
import { message } from "antd";
const {
  sidecarURLXenon,
  sidecarURLMainnet,
  bitcoinTestnet3,
  bitcoinMainnet2,
  firstStackingBlock,
  balanceCoef,
} = require("@/services/constants");

export interface PoolContributerInfoState {
  poolContributerInfoList: PoolContributerInfo[];
}

// used for saving to local storage. btcAddress => PoolContributorInfo[]
export interface LocalPoolContributors {
  [key: string]: PoolContributerInfo[];
}

export interface LocalPoolBalances {
  [key: string]: number;
}

export async function getCurrentCycle(): Promise<{ cycle: number }> {
  let baseURL = sidecarURLXenon;

  switch (getNetworkFromStorage()) {
    case "Xenon":
      baseURL = bitcoinTestnet3;
      break;
    case "Mainnet":
      baseURL = bitcoinMainnet2;
      break;
    default:
      break;
  }

  return request(`${baseURL}`, { method: "GET", timeout: 6000 }).then(
    (resp) => {
      let height: number = resp.height;
      return { cycle: Math.ceil((height - firstStackingBlock) / 2100) };
    }
  );
}

export function getCycleBlocks(cycle: number): {
  startBlock: number;
  endBlock: number;
} {
  return {
    startBlock: firstStackingBlock + (cycle - 1) * 2100,
    endBlock: firstStackingBlock + cycle * 2100,
  };
}

export function getPoolStartCycleBlocks(): {
  startBlock: number;
  endBlock: number;
} {
  let poolStartCycle = localStorage.getItem("poolStartCycle");
  if (poolStartCycle) {
    return getCycleBlocks(parseInt(poolStartCycle));
  } else {
    return {
      startBlock: firstStackingBlock,
      endBlock: firstStackingBlock + 2100,
    };
  }
}

export function getCycleForBlock(blockHeight: number): number {
  return Math.floor((blockHeight - firstStackingBlock) / 2100) + 1;
}

// used to get pool balance from local storage
// cached so you don't have to requery
export const getLocalPoolBalance = (): number => {
  let poolBalances = localStorage.getItem("poolBalances");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;

  if (poolBalances) {
    let poolBalancesMap: LocalPoolBalances = JSON.parse(poolBalances);
    if (pooledBtcAddress in poolBalancesMap) {
      return poolBalancesMap[pooledBtcAddress];
    }
  }
  return 0;
};

// used to set pool balance from in local storage
// cached so you don't have to requery

export const setLocalPoolBalances = (balance: number) => {
  let poolBalances = localStorage.getItem("poolBalances");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  let poolBalancesMap = {};
  if (poolBalances && pooledBtcAddress) {
    poolBalancesMap = JSON.parse(poolBalances);
  }
  if (pooledBtcAddress) {
    poolBalancesMap[pooledBtcAddress] = balance;
    localStorage.setItem("poolBalances", JSON.stringify(poolBalancesMap));
  }
};

// used to get pool contributer info from local storage
// cached so you don't have to requery tx
export const getLocalPoolContributorInfo = (): PoolContributerInfo[] => {
  let poolContributors = localStorage.getItem("poolContributors");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;

  if (poolContributors) {
    let poolContributorsMap: LocalPoolContributors =
      JSON.parse(poolContributors);
    if (pooledBtcAddress in poolContributorsMap) {
      return poolContributorsMap[pooledBtcAddress];
    }
  }
  return [];
};

// used to set pool contributor info in local storage
// cached so you don't have to requery tx
export const setLocalPoolContributorInfo = (
  contributions: PoolContributerInfo[]
) => {
  let poolContributors = localStorage.getItem("poolContributors");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  let poolContributorsMap = {};
  if (poolContributors && pooledBtcAddress) {
    poolContributorsMap = JSON.parse(poolContributors);
  }
  if (pooledBtcAddress) {
    poolContributorsMap[pooledBtcAddress] = contributions.sort((a, b) =>
      a.blockContribution < b.blockContribution ? 1 : -1
    );
    localStorage.setItem(
      "poolContributors",
      JSON.stringify(poolContributorsMap)
    );
  }
};

// sometimes the api will return 0 balance and 0 tx, so just return -1 if that happens
export async function getBalance(): Promise<number> {
  let baseURL = sidecarURLXenon;
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      //TODO: remember to add before and after
      //   baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}&limit=2000`;
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}/balance`;
      // baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}/full?limit=50`;
      break;
    }
    case "Mainnet": {
      let pooledBtcAddress = "1BFfc2e6Kk82ut7S3C5yaN3pWRxEFRLLu5";
      baseURL = `${bitcoinMainnet2}/addrs/${pooledBtcAddress}/balance`;
      break;
    }
    default:
      break;
  }
  return request(`${baseURL}`, { method: "GET", timeout: 6000 }).then(
    (resp: Address) => {
      console.log(resp);
      if (resp.n_tx == 0 && getLocalPoolBalance() > 0) {
        return -1;
      }
      return resp.balance / balanceCoef;
    }
  );
}

// async function to get the balance? or change result of queryPoolContributerInfo
export function getBalanceAtBlock(blockHeight: number): number {
  let balance = getLocalPoolBalance();
  let transactions = getLocalPoolContributorInfo();
  let index = 0;
  let transaction = transactions[index];
  console.log("blockHeight", blockHeight);
  console.log("transaction height", transaction.blockContribution);
  while (
    index < transactions.length &&
    transaction.blockContribution >= blockHeight
  ) {
    console.log("transaction height", transaction.blockContribution);
    balance -= transaction.contribution;
    index += 1;
    transaction = transactions[index];
  }
  return balance;
}

// gets pool contributors between blocks
export async function getPoolContributorsHelper(
  startBlock: number,
  endBlock: number
): Promise<Address> {
  let baseURL = sidecarURLXenon;
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  // stx mainnet miner

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      //TODO: remember to add before and after
      //   baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}&limit=2000`;
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}/full?limit=50&before=${endBlock}&after=${startBlock}&confidence=99`;
      // baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}/full?limit=50`;
      break;
    }
    case "Mainnet": {
      let pooledBtcAddress = "1BFfc2e6Kk82ut7S3C5yaN3pWRxEFRLLu5";
      baseURL = `${bitcoinMainnet2}/addrs/${pooledBtcAddress}/full?limit=50&before=${endBlock}&after=${startBlock}`;
      break;
    }
    default:
      break;
  }

  return request(`${baseURL}`, { method: "GET", timeout: 6000 }).then(
    (resp: Address) => {
      console.log(resp);
      return resp;
    }
  );
}

export async function getPoolContributors(
  startBlock: number,
  endBlock: number
): Promise<{ transactions: Tx[]; balance: number }> {
  let hasMore = true;
  let transactions: Tx[] = [];
  let balance = -1;

  // TODO: if you get rate limited halfway through, you'll have the most recent
  // transactions cached but you'll be missing the transactions starting
  // from startBlock. Then when you try again later, it'll only query from
  // the highest cached transaction to end block, so you'll still be missing the
  // middle transactions. either find a way to fix this, or return an empty array
  // if any error occurs
  while (hasMore) {
    try {
      const addressResult = await getPoolContributorsHelper(
        startBlock,
        endBlock
      );

      if (balance == -1) {
        balance = addressResult.balance;
      }

      if (addressResult.txs.length > 0) {
        const [lastTx] = addressResult.txs.slice(-1);
        endBlock = lastTx.block_height;
        transactions = [...transactions, ...addressResult.txs];
      }

      hasMore = addressResult.hasMore!;
    } catch (error) {
      console.log(error);
      message.error("Failed to get newest pool contributors");
      hasMore = false;
    }
  }

  return { transactions, balance };
}
