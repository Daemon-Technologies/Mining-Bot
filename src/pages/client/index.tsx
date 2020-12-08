import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, zhCNIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, Card, Space, Divider, message, ConfigProvider, Typography, notification } from 'antd';
import { FormattedMessage } from "umi"

import { Account } from '@/services/wallet/data'
import { startMining, stopMining, getNodeStatus, getMiningInfo } from '@/services/client/Client'
import AccountForm from './component/AccountForm'
import { MiningInfo } from '@/services/client/data';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';

const { Title, Paragraph } = Typography;

const { MIN_MINER_BTC_AMOUNT, CN } = require('@/services/constants');



const TableList: React.FC<{}> = () => {
  const [startMiningLoading, setStartMiningLoading] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [nodeStatus, setNodeStatus] = useState(-1);
  const actionRef = useRef<ActionType>();

  async function initialNodeStatus(){
    await message.loading({ content: getLanguage() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
    const res = await getNodeStatus()
    console.log(res)
    setNodeStatus(res.PID)
  }

  useEffect (() => {
    initialNodeStatus()
  }, []) 

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

  const render_boardStatus = () => {
    let t;
    if (nodeStatus){
      if (nodeStatus === -1){
        t = <a><FormattedMessage id='status.noProgramRunning' defaultMessage='No Mining Program Running!' /></a>
      }
      else {
        t = <a><FormattedMessage id='status.programRunning' defaultMessage='Mining Program is Running, PID is ' /> {nodeStatus}</a> 
      }
    }
    else{
      t = <a><FormattedMessage id='status.noMiningLocalServerRunning' defaultMessage="No Mining-Local-Program detected!"  /></a>
    }

    return (
    <div>
      <FormattedMessage id='status.current' defaultMessage='Current Status' /> : 
      {t}
    </div>
    )
  }

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
          
            <Typography>
              <Paragraph>
                <Title level = {3}>
                  {render_boardStatus()}
                </Title>
                <Title level = {5}>
                  { minerAddress? 
                    <div> 
                      <FormattedMessage id='status.miner' defaultMessage='Miner address is' /> 
                      <a> { `:${minerAddress}` } </a> 
                    </div>
                    :
                    <div></div> 

                  }
                  
                  
                </Title>
              </Paragraph>
              <Paragraph>
                <Space>
                <Button
                type="default"
                onClick={async () => {
                  await message.loading({ content: getLanguage() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
                  const res = await getNodeStatus()
                  console.log(res)
                  if (res.PID === -1){
                    message.success({ content: getLanguage() === CN ? '后台没有挖矿进程！' : "There is no mining process running!", duration: 4 })
                    setNodeStatus(res.PID)
                  }
                  else
                  {
                    message.success({ content: getLanguage() === CN ? `后台有挖矿进程！进程id为${res.PID}` : `There is a mining process running in pid ${res.PID}`, duration: 4 })
                    setNodeStatus(res.PID)
                  }
              
                }}>
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
                    // TODO Reconfirm check
                    await message.loading({ content: getLanguage() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
                    const res = await stopMining()
                    console.log(res)
                    if (res.status === 404){
                        message.success({ content: getLanguage() === CN ? '没有挖矿程序在运行!' : `${res.data}`, duration: 4 })
                    }
                    else if (res.status === 200){
                        message.success({ content: getLanguage() === CN ? '关闭成功！' : `${res.data}`, duration: 4 })
                    }
                    await initialNodeStatus()
                    console.log(res)
                  }}
                >
                  <FormattedMessage id='opt.button.stop' defaultMessage='Stop Mining' />
                </Button>
                </Space>
              </Paragraph>
            </Typography> 
          
        </Card>
      </>
    )
  }

  
  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" 
          onClick={async ()=>{
              const w = await window.open('about:blank');
              w.location.href="https://www.blockstack.org/testnet/faucet"
          }}>
        Get Bitcoin
      </Button>
    );
    notification.info({
      message: (getLanguage() === CN ? "余额提醒" : 'Balance Notification'),
      description: (getLanguage() === CN ? "使用官方网站获取测试网比特币" : 'Visit Official Faucet Website to get Test Bitcoin'),
      btn,
      key
    });
  };


  const render_Form = () => {
    return (
      <>
        <AccountForm
          onSubmit={async (value: {account: Account, inputBurnFee: number}) => {
            //console.log("value", value)
            if (value.account.balance < MIN_MINER_BTC_AMOUNT) {
              message.error({ content: getLanguage() === CN ? '你的比特币余额不足以继续挖矿！' : "Your Bitcoin is not enough to mine", duration: 3 })
              openNotification()
              handleModalVisible(false)
            }
            else {
              setStartMiningLoading(true)
              await message.loading({ content: getLanguage() === CN ? '检查环境.....' : "Checking Environment...", duration: 1 })
              await message.loading({ content: getLanguage() === CN ? '启动Stacks Blockchain' : "Launching Stacks Blockchain...", duration: 1 })

              // Launching stack-blockchain by rpc
              const res = await startMining(value)
              console.log(res)
              setStartMiningLoading(!res)
              // Launching Successfully
              if (res.status == 200) {
                message.success({ content: getLanguage() === CN ? '启动成功！' : "Launching Successfully!!!", duration: 4 })
                handleModalVisible(false);
              }
              // Launching UnSuccessfully
              else {
                message.error({ content: getLanguage() === CN ? '启动异常，请联系管理员！' : "Launching Error, Please Contact With Admin!!!", duration: 4 })
                handleModalVisible(false)
              }
              await initialNodeStatus()
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

  const render_StrategyLibrary = () => {
    return (
      <>
        <Divider />
        <Card
          style={{
            height: '100%',
          }}
          bordered={false}
          title={
            <FormattedMessage
              id="strategy.title"
              defaultMessage="StrategyLibrary"
            />
          }
        >
            To Complete in Beta Version......
        </Card>
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
        {render_MiningInfo()}
        {render_Form()}
        {render_StrategyLibrary()}
      </ConfigProvider>
    </PageContainer >
  );
};
// TODO get BTC burned amount and STX Mined Amount
export default TableList;
