import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getPoolContributors,
} from "@/services/managePool/managePool";
import { useState } from "react";
export interface PoolContributerInfoState {
  poolContributerInfoList: PoolContributerInfo[];
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

export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async () => {
    const { cycle } = await getCurrentCycle();
    // console.log(cycle);
    const transactions = await getPoolContributors(cycle);
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;

    let res: PoolContributerInfo[] = [];
    transactions.data.map((transaction) => {
      let sender = "";
      let contribution = 0;

      if (!isTransactionContribution(transaction)) {
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
            });
          }
        }
      }
      // return { address: transaction.address, contribution: transaction.value };
    });
    // setPoolContributerInfoState({ poolContributerInfoList: res });
    return { data: res };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
