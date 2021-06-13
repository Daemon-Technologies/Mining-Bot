import { getNetworkFromStorage } from "@/utils/utils";
import request from "umi-request";
import { Address, Tx } from "./data";

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

export async function getPoolContributors(
  cycle: number
): Promise<{ data: Tx[] }> {
  let baseURL = sidecarURLXenon;
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  // let pooledBtcAddress = "tb1q46cjfj593k0dz44arfpfdlz3j24n5jqdad0xu9";

  const { startBlock, endBlock } = getCycleBlocks(cycle);

  switch (getNetworkFromStorage()) {
    case "Xenon": {
      //TODO: remember to add before and after
      //   baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}&limit=2000`;
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}/full?limit=50`;
      break;
    }
    case "Mainnet": {
      baseURL = `${bitcoinTestnet3}/addrs/${pooledBtcAddress}?before=${endBlock}&after=${startBlock}`;
      break;
    }
    default:
      break;
  }

  return request(`${baseURL}`, { method: "GET", timeout: 6000 }).then(
    (resp: Address) => {
      console.log(resp);
      return { data: resp.txs };
    }
  );
}
