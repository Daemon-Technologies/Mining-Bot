import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getCycleBlocks,
  getCycleForBlock,
  getPoolContributors,
} from "@/services/managePool/managePool";
import { useState } from "react";
export interface PoolContributerInfoState {
  poolContributerInfoList: PoolContributerInfo[];
}

// used for saving to local storage. btcAddress => PoolContributorInfo[]
export interface LocalPoolContributors {
  [key: string]: PoolContributerInfo[];
}

const { balanceCoef } = require("@/services/constants");

// used to check if transaction is an input to the address
const isTransactionContribution = (transaction: Tx): boolean => {
  let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
  for (const input of transaction.inputs) {
    if (input.addresses && input.addresses.includes(pooledBtcAddress)) {
      return false;
    }
  }
  return true;
};

// if transaction positive, this was an input / contribution, else output / spent on mining
const getTransactionValue = (
  pooledBtcAddress: string,
  transaction: Tx
): number => {
  let value = 0;
  for (const input of transaction.inputs) {
    if (input.addresses && input.addresses.includes(pooledBtcAddress)) {
      value -= input.output_value;
    }
  }
  for (const output of transaction.outputs) {
    if (output.addresses && output.addresses.includes(pooledBtcAddress)) {
      value += output.value;
    }
  }
  // if this was an output, we also paid the fees
  if (value < 0) {
    value -= transaction.fees;
  }
  return value;
};

// used to get pool contributer info from local storage
// cached so you don't have to requery tx
const getLocalPoolContributorInfo = (): PoolContributerInfo[] => {
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

// used to set pool contributor info from local storage
// cached so you don't have to requery tx
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

    if (endBlock > highestHeight) {
      const transactions = await getPoolContributors(highestHeight, endBlock);

      let txHashes = new Set(res.map((o) => o.transactionHash));
      transactions.data.map((transaction) => {
        // if we already stored this transaction or its not confirmed yet, skip
        if (txHashes.has(transaction.hash) || transaction.block_height == -1) {
          return;
        }

        let contribution = getTransactionValue(pooledBtcAddress, transaction);
        if (contribution > 0) {
          // sometimes the inputs can have multiple addresses, so we weigh contributions based on each address input
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
              cycleContribution: getCycleForBlock(transaction.block_height),
              blockContribution: transaction.block_height,
              isContribution: true,
            });
          }
        } else {
          res.push({
            address: "output",
            contribution: contribution / balanceCoef,
            transactionHash: transaction.hash,
            cycleContribution: getCycleForBlock(transaction.block_height),
            blockContribution: transaction.block_height,
            isContribution: false,
          });
        }
      });
    }

    setLocalPoolContributorInfo(res);
    res = res.filter(
      (contribution) =>
        contribution.blockContribution >= startBlock &&
        contribution.blockContribution <= endBlock &&
        contribution.isContribution
    );

    return { data: res, success: true };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
