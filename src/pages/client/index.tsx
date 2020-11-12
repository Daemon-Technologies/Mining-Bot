import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, zhCNIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, Card, Space, Divider, message, ConfigProvider } from 'antd';
import { FormattedMessage } from "umi"

import { Account } from '@/services/wallet/data'
import { startMining, stopMining, getNodeStatus, getMiningInfo } from '@/services/client/Client'
import CreateForm from './component/CreateForm'
import { MiningInfo } from '@/services/client/data';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';

const { MIN_MINER_BTC_AMOUNT, CN } = require('@/services/constants');

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
      title: <FormattedMessage id='strategy.name' defaultMessage='Strategy Name' />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id='strategy.createAt' defaultMessage='Create Time' />,
      dataIndex: 'time'
    }
  ];
  const miningInfoColumns: ProColumns<MiningInfo>[] = [
    {
      title: <FormattedMessage id='miningInfo.stxAddress' defaultMessage='STX Address' />,
      dataIndex: 'stx_address',
    },
    {
      title: <FormattedMessage id='miningInfo.btcAddress' defaultMessage='BTC Address' />,
      dataIndex: 'btc_address',
    },
    {
      title: <FormattedMessage id='miningInfo.actualWins' defaultMessage='Actual Win' />,
      dataIndex: 'actual_win',
    },
    {
      title: <FormattedMessage id='miningInfo.totalWins' defaultMessage='Total Win' />,
      dataIndex: 'total_win',
    },
    {
      title: <FormattedMessage id='miningInfo.totalMined' defaultMessage='Total Mined' />,
      dataIndex: 'total_mined',
    },
    {
      title: <FormattedMessage id='miningInfo.burn' defaultMessage='Miner Burned' />,
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
              id="opt.title"
              defaultMessage="Mining Operation Board"
            />
          }
        >
          <Space>
            <Button
              type="default"
              onClick={async () => {
                await message.loading({ content: getLanguage() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
                const res = await getNodeStatus()
                console.log(res)
                if (res === 0) {
                  message.success({ content: getLanguage() === CN ? '后台没有stacks node进程！' : "There is no stacks node process running in backend", duration: 4 })
                }
                else
                  message.success({ content: getLanguage() === CN ? `后台有一个stacks node进程！进程id为${res}` : `There is a stacks node process running in pid ${res}`, duration: 4 })

              }
              }>
              <FormattedMessage id='opt.button.status' defaultMessage='Get Node Status' />
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
              <FormattedMessage id='opt.button.start' defaultMessage='Start Mining' />
            </Button>
            <Button
              type="danger"
              onClick={async () => {
                // TODO check Node Status firstly
                const res = await stopMining()
                message.success({ content: getLanguage() === CN ? '关闭成功！' : "Shut Down Successfully", duration: 4 })
                console.log(res)
              }}
            >
              <FormattedMessage id='opt.button.stop' defaultMessage='Stop Mining' />
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
          headerTitle={<FormattedMessage id='strategy.title' defaultMessage='Strategy Library' />}
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
              message.error({ content: getLanguage() === CN ? '你的比特币余额不足以继续挖矿！' : "Your Bitcoin is not enough to mine", duration: 3 })
            }
            else {
              setStartMiningLoading(true)
              await message.loading({ content: getLanguage() === CN ? '检查环境.....' : "Checking Environment...", duration: 2 })
              message.loading({ content: getLanguage() === CN ? '启动Stacks Blockchain' : "Launching Stacks Blockchain...", duration: 5 })

              // Launching stack-blockchain by rpc
              const res = await startMining()
              console.log(res)
              setStartMiningLoading(!res)
              // Launching Successfully
              if (res) {
                message.success({ content: getLanguage() === CN ? '启动成功！' : "Launching Successfully!!!", duration: 4 })
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
                message.error({ content: getLanguage() === CN ? '启动异常，请联系管理员！' : "Launching Error, Please Contact With Admin!!!", duration: 4 })
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
          headerTitle={<FormattedMessage id='miningInfo.title' defaultMessage='Mining Info' />}
          actionRef={actionRef}
          rowKey="stx_address"
          request={async () => {
            const miningInfo = await getMiningInfo();
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
      <ConfigProvider
        value={{
          intl: getLanguage() === CN ? zhCNIntl : enUSIntl,
        }}
      >
        {render_OperationBoard()}
        {render_StrategyLibrary()}
        {render_MiningInfo()}
        {render_Form()}
      </ConfigProvider>
    </PageContainer >
  );
};
// TODO get BTC burned amount and STX Mined Amount
export default TableList;
