import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType } from '@ant-design/pro-table';

import { TokenPrice, ChainInfo, MiningInfo, BlockInfo, TxInfo } from '@/services/publicdata/data'
import { getTokenPrice } from '@/services/publicdata/tokenInfo';
import { getChainInfo, getBlockInfo, getTxsInfo } from '@/services/publicdata/chainInfo';
import { getMiningInfo } from '@/services/publicdata/miningInfo'
import { Divider, Tag} from 'antd';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const tokenPriceColumns: ProColumns<TokenPrice>[] = [
    { title: 'Trading Pair', dataIndex: 'tradingPair', },
    { title: 'Price', dataIndex: 'price', valueType: 'text', },
  ];

  const chainInfoColumns: ProColumns<ChainInfo>[] = [
    { title: 'Last Seen Stacks Chain Tip Height', dataIndex: 'stacksChainHeight'},
    { title: 'Last Seen Burn Chain Block Height', dataIndex: 'burnChainHeight'},
  ];

  const miningInfoColumns: ProColumns<MiningInfo>[] = [
    { title: 'stxAddress', dataIndex: 'stxAddress'},
    { title: 'actualWins', dataIndex: 'actualWins'},
    { title: 'totalWins', dataIndex: 'totalWins'},
    { title: 'totalMined', dataIndex: 'totalMined'},
    { title: 'wonRate', dataIndex: 'wonRate'},
    { title: 'actualWonRate', dataIndex: 'actualWonRate'},
    { title: 'burnBTCAmount', dataIndex: 'burnBTCAmount'}
  ];

  const blockInfoColumns: ProColumns<BlockInfo>[] = [
    { title: 'Height',
      dataIndex: 'height',
      render: (_) => <Tag color="blue">{_}</Tag>,
      width: 100,
      align: 'center'
    },
    {
      title: 'Block Hash',
      dataIndex: 'hash',
      width : 200

    },
    {
      title: 'Total Gas',
      dataIndex: 'total_fee',
      width : 80
    },
    { title: 'Status', dataIndex: 'canonical',
      initialValue: 'success',
      valueEnum: {
        success: { text: 'Success', status: 'Success' },
        pending: { text: 'Pending', status: 'Processing' }
      },
      width: 150
    }
  ];

  const txInfoColumns: ProColumns<TxInfo>[] = [
    { title: 'TX Hash', dataIndex: 'tx_id', key:'tx_id'},
    {
        title: 'Status',
        dataIndex: 'tx_status',
        key:'tx_status',
        initialValue: 'success',
        valueEnum: {
          success: { text: 'Success', status: 'Success' },
          pending: { text: 'Pending', status: 'Processing' }
        },
    },
    { title: 'Fee Rate', dataIndex: 'fee_rate', key:'fee_rate' },
    { title: 'TX Type', dataIndex: 'tx_type', key:'tx_type' }
  ];



  const TxTable = (record: { txs: any; }) => {
    const TXs = record.txs;
    return (
      <ProTable
        columns={txInfoColumns}
        search={false}
        options={false}
        request={() => getTxsInfo(TXs)}
        pagination={false}
        key="tx_id"
      />
    );
  };


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
          rowKey="id"
          request={() => getTokenPrice()}
          columns={tokenPriceColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />

        <ProTable<ChainInfo>
          headerTitle="Chain Info"
          actionRef={actionRef}
          rowKey="id"
          request={() => getChainInfo()}
          columns={chainInfoColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />

        <ProTable<BlockInfo>
          headerTitle="Block Info"
          actionRef={actionRef}
          rowKey="height"
          request={() => getBlockInfo()}
          expandable={{expandedRowRender:TxTable}}
          columns={blockInfoColumns}
          pagination={false}
          dateFormatter="string"
          search={false}
        />

        <Divider type="horizontal" />

        <ProTable<MiningInfo>
          headerTitle="Mining Info"
          actionRef={actionRef}
          rowKey="stxAddress"
          request={() => getMiningInfo()}
          columns={miningInfoColumns}
          search={false}
          pagination={false}
        />
      </ConfigProvider>
    </PageContainer >
  );
};

// TODO => InitialState store
// TODO => Add Block TX Info


export default TableList;
