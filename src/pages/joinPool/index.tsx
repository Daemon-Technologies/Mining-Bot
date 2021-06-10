import React, { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { ConfigProvider } from "antd";

import { switchConfigProviderLocale } from "@/services/locale";
import {
  getCurrentCycle,
  getCycleBlocks,
  getPoolContributors,
} from "@/services/managePool/managePool";

const TableList: React.FC<{}> = () => {
  const [currentCycle, setCurrentCycle] = useState<number>(-1);
  useEffect(() => {
    getCurrentCycle().then(({ cycle }) => {
      if (cycle) {
        setCurrentCycle(cycle!);
      }
    });
  }, []);

  useEffect(() => {
    getPoolContributors(currentCycle).then((transactions) => {
      if (transactions) {
        console.log(transactions);
      }
    });
  }, [currentCycle]);
  return (
    <PageContainer>
      <ConfigProvider locale={switchConfigProviderLocale()}>
        <div>joinPool</div>
        <div>Cycle #{currentCycle}</div>
        <div>
          From block {getCycleBlocks(currentCycle).startBlock} to 
          {getCycleBlocks(currentCycle).endBlock}
        </div>
      </ConfigProvider>
    </PageContainer>
  );
};

export default TableList;
