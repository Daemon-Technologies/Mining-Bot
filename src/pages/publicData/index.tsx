import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType, zhCNIntl } from '@ant-design/pro-table';

import { TokenPrice, ChainInfo, MiningInfo, BlockInfo, TxInfo } from '@/services/publicdata/data'
import { getTokenPrice } from '@/services/publicdata/tokenInfo';
import { getChainInfo, getBlockInfo, getTxsInfo } from '@/services/publicdata/chainInfo';
import { getMiningInfo } from '@/services/publicdata/miningInfo'
import { Divider, Tag } from 'antd';
import { FormattedMessage } from 'umi';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';

const { CN } = require('@/services/constants');

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const tokenPriceColumns: ProColumns<TokenPrice>[] = [
    { title: <FormattedMessage id='price.pair' defaultMessage='Trading Pair' />, dataIndex: 'tradingPair', },
    { title: <FormattedMessage id='price.price' defaultMessage='Price' />, dataIndex: 'price', valueType: 'text', },
  ];

  const chainInfoColumns: ProColumns<ChainInfo>[] = [
    { title: <FormattedMessage id='chain.tipHeight' defaultMessage='Last Seen Stacks Chain Tip Height' />, dataIndex: 'stacksChainHeight' },
    { title: <FormattedMessage id='chain.burnHeight' defaultMessage='Last Seen Burn Chain Block Height' />, dataIndex: 'burnChainHeight' },
  ];

  const miningInfoColumns: ProColumns<MiningInfo>[] = [
    { title: <FormattedMessage id='miningInfo.stxAddress' defaultMessage='stxAddress' />, dataIndex: 'stxAddress' },
    { title: <FormattedMessage id='miningInfo.actualWins' defaultMessage='actualWins' />, dataIndex: 'actualWins' },
    { title: <FormattedMessage id='miningInfo.totalWins' defaultMessage='totalWins' />, dataIndex: 'totalWins' },
    { title: <FormattedMessage id='miningInfo.totalMined' defaultMessage='totalMined' />, dataIndex: 'totalMined' },
    { title: <FormattedMessage id='miningInfo.wonRate' defaultMessage='wonRate' />, dataIndex: 'wonRate' },
    { title: <FormattedMessage id='miningInfo.actualWonRate' defaultMessage='actualWonRate' />, dataIndex: 'actualWonRate' },
    { title: <FormattedMessage id='miningInfo.burnBTCAmount' defaultMessage='burnBTCAmount' />, dataIndex: 'burnBTCAmount' }
  ];

  const blockInfoColumns: ProColumns<BlockInfo>[] = [
    {
      title: <FormattedMessage id='block.height' defaultMessage='Height' />,
      dataIndex: 'height',
      render: (_) => <Tag color="blue">{_}</Tag>,
      width: 100,
      align: 'center'
    },
    {
      title: <FormattedMessage id='block.hash' defaultMessage='Block Hash' />,
      dataIndex: 'hash',
      width: 200
    },
    {
      title: <FormattedMessage id='block.gas' defaultMessage='Total Gas' />,
      dataIndex: 'total_fee',
      width: 80
    },
    {
      title: <FormattedMessage id='block.status' defaultMessage='Status' />, dataIndex: 'canonical',
      initialValue: 'success',
      valueEnum: {
        success: { text: <FormattedMessage id='block.status.success' defaultMessage='Success' />, status: 'Success' },
        pending: { text: <FormattedMessage id='block.status.pending' defaultMessage='Pending' />, status: 'Processing' }
      },
      width: 150
    }
  ];

  const txInfoColumns: ProColumns<TxInfo>[] = [
    {
      title: <FormattedMessage id='block.info.txHash' defaultMessage='TX Hash' />,
      dataIndex: 'tx_id', key: 'tx_id'
    },
    {
      title: <FormattedMessage id='block.info.status' defaultMessage='Status' />,
      dataIndex: 'tx_status',
      key: 'tx_status',
      initialValue: 'success',
      valueEnum: {
        success: {
          text: <FormattedMessage id='block.info.status.success' defaultMessage='Success' />,
          status: 'Success'
        },
        pending: {
          text: <FormattedMessage id='block.info.status.pending' defaultMessage='Pending' />,
          status: 'Processing'
        }
      },
    },
    {
      title: <FormattedMessage id='block.info.feeRate' defaultMessage='Fee Rate' />,
      dataIndex: 'fee_rate',
      key: 'fee_rate'
    },
    {
      title: <FormattedMessage id='block.info.txType' defaultMessage='TX Type' />,
      dataIndex: 'tx_type',
      key: 'tx_type'
    },
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
          intl: getLanguage() === CN ? zhCNIntl : enUSIntl,
        }}
      >
        <ProTable<TokenPrice>
          headerTitle={<FormattedMessage id='price.title' defaultMessage='Token Price Info' />}
          actionRef={actionRef}
          rowKey="tradingPair"
          request={() => getTokenPrice()}
          columns={tokenPriceColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />

        <ProTable<ChainInfo>
          headerTitle={<FormattedMessage id='chain.title' defaultMessage='Chain Info' />}
          actionRef={actionRef}
          rowKey="stacksChainHeight"
          request={() => getChainInfo()}
          columns={chainInfoColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />

        <ProTable<BlockInfo>
          headerTitle={<FormattedMessage id='block.title' defaultMessage='Block Info' />}
          actionRef={actionRef}
          rowKey="height"
          request={() => getBlockInfo()}
          expandable={{ expandedRowRender: TxTable }}
          columns={blockInfoColumns}
          pagination={false}
          dateFormatter="string"
          search={false}
        />

        <Divider type="horizontal" />

        <ProTable<MiningInfo>
          headerTitle={<FormattedMessage id='miningInfo.title' defaultMessage='Mining Info' />}
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
