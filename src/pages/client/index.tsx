import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Divider, ConfigProvider } from 'antd';

import { switchConfigProviderLocale } from '@/services/locale';
import ChainSyncInfoTable from './component/ChainSyncInfoTable';
import MinerInfoTable from './component/MinerInfoTable';
import OperationBoard from './component/OperationBoard';
import MiningInfoTable from './component/MiningInfoTable';


const TableList: React.FC<{}> = () => {

  return (
    <PageContainer>
      <ConfigProvider
        locale={switchConfigProviderLocale()}
      >
        <OperationBoard />
        <Divider />
        <ChainSyncInfoTable />
        <Divider />
        <MinerInfoTable />
        <MiningInfoTable />
      </ConfigProvider>
    </PageContainer >
  );
};


export default TableList;
