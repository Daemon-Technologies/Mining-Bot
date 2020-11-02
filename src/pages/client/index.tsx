import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Space, Divider, message } from 'antd';
import { FormattedMessage } from "umi"

import { Account } from '@/services/wallet/data'
import { startMining, stopMining, getNodeStatus, getMiningInfo } from '@/services/client/Client'
import CreateForm from './component/CreateForm'
import { MiningInfo } from '@/services/client/data';

const { MIN_MINER_BTC_AMOUNT } = require('@/services/constants')

/**
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('Adding');
  try {
    hide();
    message.success('Adding success!');
    return true;
  } catch (error) {
    hide();
    message.error('Adding fail!');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [startMiningLoading, setStartMiningLoading] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const actionRef = useRef<ActionType>();
  const strategyColomns: ProColumns<Account>[] = [
    {
      title: 'Strategy Name',
      dataIndex: 'name',
    },
    {
      title: 'Create Time',
      dataIndex: 'time'
    }
  ];
  const miningInfoColumns: ProColumns<MiningInfo>[] = [
    {
      title: 'STX Address',
      dataIndex: 'stx_address',
    },
    {
      title: 'BTC Address',
      dataIndex: 'btc_address',
    },
    {
      title: 'Actual Win',
      dataIndex: 'actual_win',
    },
    {
      title: 'Total Win',
      dataIndex: 'total_win',
    },
    {
      title: 'Total Mined',
      dataIndex: 'total_mined',
    },
    {
      title: 'Miner Burned',
      dataIndex: 'miner_burned',
    },
  ]
  const render_OperationBoard = () => {
    return (
      <>
        <Card
          style={{
            height: '100%',
          }}
          bordered={false}
          title={
            <FormattedMessage
              id="mining-board"
              defaultMessage="Mining Operation Board"
            />
          }
        >
          <Space>
            <Button
              type="default"
              onClick={async () => {
                await message.loading({ content: "Checking Environment...", duration: 2 })
                const res = await getNodeStatus()
                console.log(res)
                if (res === 0) {
                  message.success({ content: "There is no stacks node process running in backend", duration: 4 })
                }
                else
                  message.success({ content: `There is a stacks node process running in pid ${res}`, duration: 4 })

              }
              }>
              Get Node Status
            </Button>
            <Button
              type="primary"
              loading={startMiningLoading}
              onClick={async () => {
                // TODO check BTC Balance
                // TODO choose BTC Address
                handleModalVisible(true)
              }
              }>
              Start Mining
            </Button>
            <Button
              type="danger"
              onClick={async () => {
                // TODO check Node Status firstly
                const res = await stopMining()
                message.success({ content: "Shut Down Successfully", duration: 4 })
                console.log(res)
              }}
            >
              Stop Mining
            </Button>
          </Space>
        </Card>
      </>
    )
  }

  const render_StrategyLibrary = () => {
    return (
      <>
        <Divider />
        <ProTable<Account>
          headerTitle="Strategy Library"
          actionRef={actionRef}
          rowKey="tradingPair"
          columns={strategyColomns}
          search={false}
          pagination={false}
        />
      </>
    )
  }

  const render_Form = () => {
    return (
      <>
        <CreateForm
          onSubmit={async (value) => {
            console.log("value", value)
            if (value.balance < MIN_MINER_BTC_AMOUNT) {
              message.error({ content: "Your Bitcoin is not enough to mine", duration: 3 })
            }
            else {
              setStartMiningLoading(true)
              await message.loading({ content: "Checking Environment...", duration: 2 })
              message.loading({ content: "Launching Stack Blockchain...", duration: 5 })

              // Launching stack-blockchain by rpc
              const res = await startMining()
              console.log(res)
              setStartMiningLoading(!res)
              // Launching Successfully
              if (res) {
                message.success({ content: "Launching Successfully!!!", duration: 4 })
                const success = await handleAdd(value);
                if (success) {
                  handleModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }
              // Launching UnSuccessfully
              else {
                message.error({ content: "Launching Error, Please Contact With Admin!!!", duration: 4 })
              }
            }
          }}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      </>
    )
  }

  const render_MiningInfo = () => {
    return (
      <>
        <Divider />
        <ProTable<MiningInfo>
          headerTitle="Mining Info"
          actionRef={actionRef}
          rowKey="stx_address"
          request={async () => {
            const miningInfo = await getMiningInfo();
            console.log('miningInfo:', miningInfo)
            return miningInfo;
          }}
          columns={miningInfoColumns}
          search={false}
          pagination={false}
        />
      </>
    )
  }

  return (
    <PageContainer>
      {render_OperationBoard()}
      {render_StrategyLibrary()}
      {render_MiningInfo()}
      {render_Form()}
    </PageContainer >
  );
};
// TODO get BTC burned amount and STX Mined Amount
export default TableList;
