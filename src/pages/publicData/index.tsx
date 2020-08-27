import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType } from '@ant-design/pro-table';

import { TokenPrice, ChainInfo } from '@/services/publicdata/data'
import { getTokenPrice } from '@/services/publicdata/tokenInfo';
import { getBlockChainInfo } from '@/services/publicdata/blockInfo';
import { Divider } from 'antd';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const tokenPriceColumns: ProColumns<TokenPrice>[] = [
    {
      title: 'Trading Pair',
      dataIndex: 'tradingPair',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      valueType: 'text',
    },
  ];

  const chainInfoColumns: ProColumns<ChainInfo>[] = [
    {
      title: 'Last Seen Stacks Chain Tip Height',
      dataIndex: 'stacksChainHeight',
    },
    {
      title: 'Last Seen Burn Chain Block Height',
      dataIndex: 'burnChainHeight',
      valueType: 'text',
    },
  ];

  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: enUSIntl,
        }}
      >
        <ProTable<TokenPrice>
          headerTitle="Token Price Info"
          actionRef={actionRef}
          rowKey="tradingPair"
          request={() => getTokenPrice()}
          columns={tokenPriceColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />
        <ProTable<ChainInfo>
          headerTitle="BlockStack Chain Info"
          actionRef={actionRef}
          rowKey="stacksChainHeight"
          request={() =>
            getBlockChainInfo()
          }
          columns={chainInfoColumns}
          search={false}
          pagination={false}
        />
      </ConfigProvider>
    </PageContainer >
  );
};

export default TableList;
