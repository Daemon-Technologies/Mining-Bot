import { PoolContributerInfo } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getPoolContributors,
} from "@/services/managePool/managePool";
import { useState } from "react";
export interface PoolContributerInfoState {
  poolContributerInfoList: PoolContributerInfo[];
}
export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async () => {
    const { cycle } = await getCurrentCycle();
    // console.log(cycle);
    const transactions = await getPoolContributors(cycle);
    // console.log(JSON.stringify(transactions));
    // const inputs = transactions.filter((txref) => !txref.spent);
    // console.log(JSON.stringify(inputs));

    // const res: PoolContributerInfo[] = [
    //   { address: "wow", contribution: 1 },
    //   { address: "wee", contribution: 2 },
    // ];

    const res = transactions.data.map((transaction) => {
      const sender = "";
      const contribution = ""
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
