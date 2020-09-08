import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType } from '@ant-design/pro-table';

import { TokenPrice, ChainInfo, MiningInfo, BlockInfo, TxInfo } from '@/services/publicdata/data'
import { getTokenPrice } from '@/services/publicdata/tokenInfo';
import { getChainInfo, getBlockInfo, getTxsInfo } from '@/services/publicdata/chainInfo';
import { getMiningInfo } from '@/services/publicdata/miningInfo'
import { Divider} from 'antd';

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
    { title: 'height', dataIndex: 'height' },
    { title: 'hash', dataIndex: 'hash' },
    { title: 'canonical', dataIndex: 'canonical',
      initialValue: 'all',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        close: { text: '关闭', status: 'Default' },
        running: { text: '运行中', status: 'Processing' },
        online: { text: '已上线', status: 'Success' },
        error: { text: '异常', status: 'Error' },
      },
      width: 100,
      
    }
  ];

  const txInfoColumns: ProColumns<TxInfo>[] = [
    { title: 'tx_id', dataIndex: 'tx_id', key:'tx_id'},
    { title: 'tx_status', dataIndex: 'tx_status', key:'tx_status'},
    { title: 'fee_rate', dataIndex: 'fee_rate', key:'fee_rate' },
    { title: 'tx_type', dataIndex: 'tx_type', key:'tx_type' }
  ];

  

  const TxTable = (record) => {
    const TXs = record.txs;
    console.log(record.txs)
    const data = [
                  {
                      tx_id:"1234567",
                      tx_status:"success",
                      tx_type:"coinbase", 
                      fee_rate:"100",
                      key: 1
                  }
                 ];
    /*  for (let i = 0 ;i < TXs.length; i+=1){
      const a = await getTxInfo(TXs[i])
      //console.log(a)
      data.push(a)
    } */
    console.log(data)
    return (
      <ProTable
        columns={txInfoColumns}
        search={false}
        options={false}
        request={() => getTxsInfo(TXs)}
        dataSource={data}
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
          request={() =>
            getChainInfo()
          }
          columns={chainInfoColumns}
          search={false}
          pagination={false}
        />
        <Divider type="horizontal" />

        <ProTable<BlockInfo>
          headerTitle="Block Info"
          actionRef={actionRef}
          rowKey="hash"
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