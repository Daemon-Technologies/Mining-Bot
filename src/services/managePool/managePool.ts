import { getNetworkFromStorage } from "@/utils/utils";
import request from "umi-request";
import { TXRef } from "./data";

const {
  sidecarURLXenon,
  sidecarURLMainnet,
  bitcoinTestnet3,
  bitcoinMainnet,
  firstStackingBlock,
} = require("@/services/constants");

export async function getCurrentCycle() {
  let baseURL = sidecarURLXenon;

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      baseURL = bitcoinTestnet3;
      return request(`${baseURL}`, { method: "GET", timeout: 6000 })
        .then((resp) => {
          let height: number = resp.height;
          return { cycle: Math.ceil((height - firstStackingBlock) / 2100) };
        })
        .catch((err) => {
          console.log(err);
          return { cycle: -1 };
        });
    }
    case "Mainnet": {
      baseURL = "https://api.blockcypher.com/v1/btc/main";
      return request(`${baseURL}`, {
        method: "GET",
        timeout: 6000,
      })
        .then((resp) => {
          console.log(resp);
          let height: number = resp.height;
          return { cycle: Math.ceil((height - firstStackingBlock) / 2100) };
        })
        .catch((err) => {
          console.log(err);
          return { cycle: -1 };
        });
    }
    default:
      break;
  }
  return { cycle: -1 };
}

export function getCycleBlocks(cycle: number) {
  return {
    startBlock: firstStackingBlock + (cycle - 1) * 2100,
    endBlock: firstStackingBlock + cycle * 2100,
  };
}

export async function getPoolContributors(cycle: number) {
  if (
    localStorage.getItem("isPooling") !== "true" ||
    !localStorage.getItem("pooledBtcAddress") ||
    cycle < 0
  ) {
    return {};
  }

  let baseURL = sidecarURLXenon;
  let balanceCoef = 1;

  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress");

  const { startBlock, endBlock } = getCycleBlocks(cycle);

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      //TODO: remember to add before and after
      //   baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}&limit=2000`;
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?limit=2000`;
      console.log(baseURL);
      balanceCoef = 100000000;
      await request(`${baseURL}`, { method: "GET", timeout: 6000 })
        .then((resp) => {
          if (resp.txrefs) {
            let transactions: TXRef[] = resp.txrefs;
            console.log(transactions);
            return { transactions: transactions };
          }
          return { transactions: null };
        })
        .catch((err) => {
          console.log(err);
          return { transactions: null };
        });
      break;
    }
    case "Mainnet": {
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}`;
      balanceCoef = 100000000;
      await request(`${baseURL}`, { method: "GET", timeout: 6000 })
        .then((resp) => {
          let transactions: TXRef[] = resp.txrefs;
          console.log(transactions);
          return { transactions: transactions };
        })
        .catch((err) => {
          console.log(err);
          return { transactions: null };
        });
      break;
    }
    default:
      break;
  }
  return { transactions: null };
}
