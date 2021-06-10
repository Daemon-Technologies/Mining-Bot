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
  let [poolContributerInfoState, setPoolcontributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async () => {
    const { cycle } = await getCurrentCycle();
    const poolContributers = await getPoolContributors(cycle);
    if (poolContributers.transactions) {
      console.log(poolContributers);
    }
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
