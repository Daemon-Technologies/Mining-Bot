import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider, Divider } from 'antd';
import { switchConfigProviderLocale } from '@/services/locale';
import TokenPriceInfoTable from './component/TokenPriceInfoTable';
import ChainInfoTable from './component/ChainInfoTable';
import BlockInfoTable from './component/BlockInfoTable';
import MinerInfoTable from './component/MinerInfoTable';
import MiningInfoTable from './component/MiningInfoTable';

const TableList: React.FC<{}> = () => {

  return (
    <PageContainer>
      <ConfigProvider
        locale={switchConfigProviderLocale()}
      >
        <TokenPriceInfoTable />
        <Divider type="horizontal" />
        <MinerInfoTable />
        <Divider type="horizontal" />
        <MiningInfoTable />
        <Divider type="horizontal" />
        <ChainInfoTable />
        <Divider type="horizontal" />
        <BlockInfoTable />
      </ConfigProvider>
    </PageContainer >
  );
};

export default TableList;
