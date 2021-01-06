import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';

import { switchConfigProviderLocale } from '@/services/locale';
import ChainSyncInfoTable from './component/ChainSyncInfoTable';
import OperationBoard from './component/OperationBoard';


const TableList: React.FC<{}> = () => {

  return (
    <PageContainer>
      <ConfigProvider
        locale={switchConfigProviderLocale()}
      >
        <OperationBoard />
        <ChainSyncInfoTable />
      </ConfigProvider>
    </PageContainer >
  );
};


export default TableList;
