import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider, Divider } from 'antd';

import { switchConfigProviderLocale } from '@/services/locale';
import ChainSyncInfoTable from './component/ChainSyncInfoTable';
import OperationBoard from './component/OperationBoard';
import MinerInfoTable from './component/MinerInfoTable';
import MiningInfoTable from './component/MiningInfoTable';
import BlockCommitInfoTable from './component/BlockInfoTable';


const TableList: React.FC<{}> = () => {

  return (
    <PageContainer>
      <ConfigProvider
        locale={switchConfigProviderLocale()}
      >
        <OperationBoard />
        <ChainSyncInfoTable />
        <MinerInfoTable />
        <Divider type="horizontal" />
        <MiningInfoTable />
        <Divider type="horizontal" />
        <BlockCommitInfoTable />
      </ConfigProvider>
    </PageContainer >
  );
};


export default TableList;
