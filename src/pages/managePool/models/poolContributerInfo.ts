import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getCycleBlocks,
  getCycleForBlock,
  getPoolContributors,
  PoolContributerInfoState,
  LocalPoolContributors,
  getLocalPoolContributorInfo,
  setLocalPoolContributorInfo,
  getBalanceAtBlock,
  setLocalPoolBalances,
  getLocalPoolBalance,
  getPoolStartCycleBlocks,
  getCycleContributions,
} from "@/services/managePool/managePool";
import { useState } from "react";
import { message } from "antd";
import { getStxAddressFromPublicKey } from "@/services/wallet/key";
import { getNetworkFromStorage } from "@/utils/utils";
const { btcBalanceCoef } = require("@/services/constants");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
import { b58ToC32 } from "c32check";

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

export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async (cycle: number) => {
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
    let res: PoolContributerInfo[] = getLocalPoolContributorInfo();
    let { endBlock } = getCycleBlocks(cycle - 1);

    // get highest height from local info
    let highestHeight = Math.max(...res.map((o) => o.blockContribution));
    // if no saved transactions yet, set start block as the pool cycle start block
    if (highestHeight < 0) {
      highestHeight = getPoolStartCycleBlocks().startBlock;
    }
    let currentBalance = 0;

    if (endBlock > highestHeight) {
      let { transactions, balance } = await getPoolContributors(
        highestHeight,
        endBlock
      );

      let txHashes = new Set(res.map((t) => t.transactionHash));
      transactions.map((transaction) => {
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
            let address = input.addresses[0];
            let stxAddress = input.addresses[0];
            // BECH32 not supported
            try {
              stxAddress = b58ToC32(address);
            } catch (err) {
              stxAddress = "UNSUPPORTED";
            }
            res.push({
              address: address, // TODO: deal with edge case where input has multiple addresses?
              stxAddress: stxAddress, // b58ToC32(input.addresses[0]),
              contribution: weightedContribution / btcBalanceCoef,
              transactionHash: transaction.hash,
              cycleContribution: getCycleForBlock(transaction.block_height),
              blockContribution: transaction.block_height,
              isContribution: true,
              rewardPercentage: 0,
            });
          }
        } else {
          res.push({
            address: "output",
            stxAddress: "output",
            contribution: contribution / btcBalanceCoef,
            transactionHash: transaction.hash,
            cycleContribution: getCycleForBlock(transaction.block_height),
            blockContribution: transaction.block_height,
            isContribution: false,
            rewardPercentage: 0,
          });
        }
      });
      currentBalance = balance / btcBalanceCoef;
    } else {
      //       currentBalance = await getBalance();
    }

    // sometimes API will return 0 tx for address, so only change local pool balance if we have a valid response
    if (currentBalance > 0) {
      setLocalPoolBalances(currentBalance);
    } else {
      currentBalance = getLocalPoolBalance();
    }

    let poolStartCycle = parseInt(
      localStorage.getItem("poolStartCycle") ?? "-1"
    );
    if (poolStartCycle == -1) {
      message.error("poolStartCycle cannot be -1");
    }

    // cache of reward percentages per contribution
    let cache = {};
    // sort from earlier contribution to later contribution
    res = res
      .filter(
        (contribution) => contribution.cycleContribution >= poolStartCycle - 1
      )
      .sort((a, b) => (a.blockContribution > b.blockContribution ? 1 : -1));
    let currentCycle = poolStartCycle;
    for (let contribution of res) {
      if (
        !contribution.isContribution ||
        contribution.cycleContribution >= cycle
      ) {
        continue;
      }
      currentCycle = contribution.cycleContribution + 1;
      for (currentCycle; currentCycle <= cycle; currentCycle += 1) {
        const totalBtcContributedLastCycle = getCycleContributions(
          currentCycle - 1
        ); //X
        const { endBlock } = getCycleBlocks(currentCycle - 1);
        const totalBtcAtEndOfLastCycle = getBalanceAtBlock(endBlock); // Y
        const totalBtcRemainingInPool =
          totalBtcAtEndOfLastCycle - totalBtcContributedLastCycle; // Z
        if (contribution.transactionHash in cache) {
          cache[contribution.transactionHash] =
            (cache[contribution.transactionHash] * totalBtcRemainingInPool) /
            totalBtcAtEndOfLastCycle;
        } else {
          cache[contribution.transactionHash] =
            contribution.contribution / totalBtcAtEndOfLastCycle;
        }
      }
      contribution.rewardPercentage =
        cache[contribution.transactionHash].toFixed(4) * 100;
    }

    res = res
      .slice()
      .sort((a, b) => (a.blockContribution > b.blockContribution ? 1 : -1));
    console.log(res);
    setLocalPoolContributorInfo(res);

    const { startBlock } = getCycleBlocks(poolStartCycle - 1);

    res = res.filter(
      (contribution) =>
        contribution.blockContribution >= startBlock &&
        contribution.blockContribution <= endBlock &&
        contribution.isContribution
    );
    console.log(res.slice());

    return { data: res, success: true };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
