import { getNetworkFromStorage } from "@/utils/utils";
import request from "umi-request";
import { Address, Tx } from "./data";

const {
  sidecarURLXenon,
  sidecarURLMainnet,
  bitcoinTestnet3,
  bitcoinMainnet2,
  firstStackingBlock,
} = require("@/services/constants");

export interface LocalTxs {
  [key: string]: Tx[];
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

  console.log(baseURL);
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
): Promise<{ data: Tx[] }> {
  let hasMore = true;
  let transactions: Tx[] = [];

  while (hasMore) {
    try {
      const addressResult = await getPoolContributorsHelper(
        startBlock,
        endBlock
      );
      if (addressResult.txs.length > 0) {
        const [lastTx] = addressResult.txs.slice(-1);
        endBlock = lastTx.block_height;
        transactions = [...transactions, ...addressResult.txs];
      }

      hasMore = addressResult.hasMore!;
    } catch (error) {
      console.log(error);
      hasMore = false;
    }
  }

  return { data: transactions };
}
