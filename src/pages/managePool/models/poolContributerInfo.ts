import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getCycleBlocks,
  getPoolContributors,
} from "@/services/managePool/managePool";
import { pick } from "lodash";
import { useState } from "react";
export interface PoolContributerInfoState {
  poolContributerInfoList: PoolContributerInfo[];
}

// used for saving to local storage. btcAddress => PoolContributorInfo[]
export interface PoolContributors {
  [key: string]: PoolContributerInfo[];
}

const { balanceCoef } = require("@/services/constants");

const isTransactionContribution = (transaction: Tx): boolean => {
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  for (const input of transaction.inputs) {
    if (input.addresses && input.addresses.includes(pooledBtcAddress)) {
      return false;
    }
  }
  return true;
};

const getLocalPoolContributorInfo = (): PoolContributerInfo[] => {
  let poolContributors = localStorage.getItem("poolContributors");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;

  if (poolContributors) {
    let poolContributorsMap: PoolContributors = JSON.parse(poolContributors);
    if (pooledBtcAddress in poolContributorsMap) {
      return poolContributorsMap[pooledBtcAddress];
    }
  }
  return [];
};

const setLocalPoolContributorInfo = (contributions: PoolContributerInfo[]) => {
  let poolContributors = localStorage.getItem("poolContributors");
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  let poolContributorsMap = {};
  if (poolContributors && pooledBtcAddress) {
    poolContributorsMap = JSON.parse(poolContributors);
  }
  if (pooledBtcAddress) {
    poolContributorsMap[pooledBtcAddress] = contributions;
    localStorage.setItem(
      "poolContributors",
      JSON.stringify(poolContributorsMap)
    );
  }
};

export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async (cycle: number) => {
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
    let res: PoolContributerInfo[] = getLocalPoolContributorInfo();
    let { startBlock, endBlock } = getCycleBlocks(cycle);

    // get highest height from local info
    const highestHeight = Math.max(...res.map((o) => o.blockContribution));

    const transactions = await getPoolContributors(highestHeight, endBlock);

    let txHashes = new Set(res.map((o) => o.transactionHash));
    console.log(txHashes);
    transactions.data.map((transaction) => {
      let sender = "";
      let contribution = 0;
      console.log(transaction.hash);

      if (
        !isTransactionContribution(transaction) ||
        txHashes.has(transaction.hash)
      ) {
        return;
      }

      // if our pooled btc address is in a transaction output, we count this as a contribution
      for (const output of transaction.outputs) {
        if (output.addresses && output.addresses.includes(pooledBtcAddress)) {
          contribution = output.value;
          // sometimes there are two inputs in a transaction, we weigh contribution based on value of inputs
          const totalInputvalue = transaction.inputs.reduce(
            (prev, next) => prev + next.output_value,
            0
          );

          for (const input of transaction.inputs) {
            let weightedContribution =
              contribution * (input.output_value / totalInputvalue);
            res.push({
              address: input.addresses[0], // TODO: deal with edge case where input has multiple addresses?
              contribution: weightedContribution / balanceCoef,
              transactionHash: transaction.hash,
              cycleContribution: cycle,
              blockContribution: transaction.block_height,
            });
          }
        }
      }
      // return { address: transaction.address, contribution: transaction.value };
    });
    // setPoolContributerInfoState({ poolContributerInfoList: res });

    setLocalPoolContributorInfo(res);
    res = res.filter(
      (contribution) =>
        contribution.blockContribution >= startBlock &&
        contribution.blockContribution <= endBlock
    );

    return { data: res, success: true };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
