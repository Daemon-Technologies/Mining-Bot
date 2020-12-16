import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, zhCNIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, Card, Space, Divider, message, ConfigProvider, Typography, notification, Tag } from 'antd';
import { FormattedMessage } from "umi"


import { Account } from '@/services/wallet/data'
import { startMining, stopMining, getNodeStatus, getMiningInfo, getMinerInfo } from '@/services/client/Client'
import AccountForm from './component/AccountForm'

import { MiningInfo, MinerInfo } from '@/services/client/data';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';


const { Title, Paragraph } = Typography;

const { MIN_MINER_BTC_AMOUNT, CN } = require('@/services/constants');



const TableList: React.FC<{}> = () => {
  const [startMiningLoading, setStartMiningLoading] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [minerAddress, setMinerAddress] = useState<string>();
  const [nodeStatus, setNodeStatus] = useState(-1);
  const actionRef = useRef<ActionType>();

  async function initialNodeStatus() {
    await message.loading({ content: getLocale() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
    const res = await getNodeStatus()
    console.log(res)
    setNodeStatus(res.PID)
    console.log(res.address)
    setMinerAddress(res.address)
  }

  useEffect(() => {
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
  const minerInfoColumns: ProColumns<MinerInfo>[] = [
    {
      title: <FormattedMessage id='minerInfo.stxAddress' defaultMessage='STX Address' />,
      dataIndex: 'stx_address',
      width: 150,
      copyable: true,
      ellipsis: true
    },
    {
      title: <FormattedMessage id='minerInfo.btcAddress' defaultMessage='BTC Address' />,
      dataIndex: 'btc_address',
      width: 120,
      render: (text, record, index, action) => 
        [<p style={record.btc_address === minerAddress? {color:"red"} : {}} key={record.stx_address}> {record.btc_address} </p>],
      copyable: true,
      ellipsis: true,
    },
    {
      title: <FormattedMessage id='minerInfo.actualWins' defaultMessage='Actual Win' />,
      dataIndex: 'actual_win',
      width: 50,
    },
    {
      title: <FormattedMessage id='minerInfo.totalMined' defaultMessage='Total Mined' />,
      dataIndex: 'total_mined',
      width: 50,
    },
    {
      title: <FormattedMessage id='minerInfo.burn' defaultMessage='Miner Burned' />,
      dataIndex: 'miner_burned',
      width: 70,
    },
  ]

  const miningInfoColumns : ProColumns<MiningInfo>[] = [
    {
      title: <FormattedMessage id='miningInfo.stacksHeight' defaultMessage='Stacks Chain Height' />,
      dataIndex: 'stacks_block_height',
      width: 35,
      render: (_) => <Tag color="blue">{_}</Tag>,
      
    },
    {
      title: <FormattedMessage id='minerInfo.stxAddress' defaultMessage='STX Address' />,
      dataIndex: 'stx_address',
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: <FormattedMessage id='minerInfo.btcAddress' defaultMessage='BTC Address' />,
      dataIndex: 'btc_address',
      render: (text, record, index, action) => 
        [<p style={record.btc_address === minerAddress? {color:"red"} : {}} key={record.stacks_block_height}> {record.btc_address} </p>],
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: <FormattedMessage id='miningInfo.burnfee' defaultMessage='Burn Fee' />,
      dataIndex: 'burn_fee',
      width: 50,
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
                    await message.loading({ content: getLocale() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
                    const res = await getNodeStatus()
                    console.log(res)
                    if (res.PID === -1) {
                      message.success({ content: getLocale() === CN ? '后台没有挖矿进程！' : "There is no mining process running!", duration: 4 })
                      setNodeStatus(res.PID)
                    }
                    else {
                      message.success({ content: getLocale() === CN ? `后台有挖矿进程！进程id为${res.PID}` : `There is a mining process running in pid ${res.PID}`, duration: 4 })
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
                    await message.loading({ content: getLocale() === CN ? '环境检查中....' : "Checking Environment...", duration: 2 })
                    const res = await stopMining()
                    console.log(res)
                    if (res.status === 404) {
                      message.success({ content: getLocale() === CN ? '没有挖矿程序在运行!' : `${res.data}`, duration: 4 })
                    }
                    else if (res.status === 200) {
                      message.success({ content: getLocale() === CN ? '关闭成功！' : `${res.data}`, duration: 4 })
                    }
                    await initialNodeStatus()
                    setMinerAddress(undefined)
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
        onClick={async () => {
          const w = await window.open('about:blank');
          w.location.href = "https://www.blockstack.org/testnet/faucet"
        }}>
        Get Bitcoin
      </Button>
    );
    notification.info({
      message: (getLocale() === CN ? "余额提醒" : 'Balance Notification'),
      description: (getLocale() === CN ? "使用官方网站获取测试网比特币" : 'Visit Official Faucet Website to get Test Bitcoin'),
      btn,
      key
    });
  };


  const render_Form = () => {
    return (
      <>
        <AccountForm
          onSubmit={async (value: { account: Account, inputBurnFee: number, network: string }) => {
            //console.log("value", value)
            if (value.account.balance < MIN_MINER_BTC_AMOUNT) {
              message.error({ content: getLocale() === CN ? '你的比特币余额不足以继续挖矿，跳转到钱包页面进行充值' : "Your Bitcoin is not enough to mine, turn to Wallet page to get faucet.", duration: 3 })
              //openNotification()
              handleModalVisible(false)
            }
            else {
              setStartMiningLoading(true)
              await message.loading({ content: getLocale() === CN ? '检查环境.....' : "Checking Environment...", duration: 1 })
              await message.loading({ content: getLocale() === CN ? '启动Stacks Blockchain' : "Launching Stacks Blockchain...", duration: 1 })

              // Add network type
              value.network = "Krypton"
              console.log(value)
              // Launching stack-blockchain by rpc
              const res = await startMining(value)
              console.log(res)
              setStartMiningLoading(!res)
              // Launching Successfully
              if (res.status == 200) {
                message.success({ content: getLocale() === CN ? '启动成功！' : "Launching Successfully!!!", duration: 4 })
                handleModalVisible(false);
              }
              // Launching UnSuccessfully
              else {
                message.error({ content: getLocale() === CN ? '启动异常，请联系管理员！' : "Launching Error, Please Contact With Admin!!!", duration: 4 })
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
  const render_MinerInfo = () => {
    return (
      <>
        <Divider />
        <ProTable<MinerInfo>
          headerTitle={<FormattedMessage id='minerInfo.title' defaultMessage='Miner Info' />}
          actionRef={actionRef}
          rowKey="stx_address"
          pagination={{
            pageSize: 10,
          }}
          request={async (params, sorter, filter) => {
            //console.log(params);
            const minerInfo = await getMinerInfo();
            return minerInfo;
          }}
          columns={minerInfoColumns}
          search={false}
        />
      </>
    )
  }
  const render_MiningInfo = () => {
    return (
      <>
        <Divider />
        <ProTable<MiningInfo>
          headerTitle={<FormattedMessage id='miningInfo.title' defaultMessage='Miner Info' />}
          actionRef={actionRef}
          rowKey="stacks_block_height"
          pagination={{
            pageSize: 10,
          }}
          request={async (params, sorter, filter) => {
            //console.log(params, sorter, filter);
            const miningInfo = await getMiningInfo();
            //console.log(miningInfo)
            return miningInfo;
          }}
          columns={miningInfoColumns}
          search={false}
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
              defaultMessage="Strategy Library"
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
        locale={getLocale() === CN ? zhCN : enUS}
      >
        {render_OperationBoard()}
        {render_MinerInfo()}
        {render_MiningInfo()}
        {render_Form()}
        {render_StrategyLibrary()}
      </ConfigProvider>
    </PageContainer >
  );
};
// TODO get BTC burned amount and STX Mined Amount
export default TableList;
