import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {  Button, Card, Space, Divider, Alert, message} from 'antd';
import {FormattedMessage} from "umi"

import { Account } from '@/services/wallet/data'
import {startMining, stopMining, getNodeStatus } from '@/services/client/Client'

const TableList: React.FC<{}> = () => {
  const [startMiningLoading, setStartMiningLoading] = useState<boolean>(false);

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


  return (
    <PageContainer>
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
                    await message.loading({content : "Checking Environment...", duration : 2})
                    const res = await getNodeStatus()
                    console.log(res)
                    if (res === 0){
                      message.success({content : "There is no stacks node process running in backend", duration : 4})
                    }
                    else
                      message.success({content : `There is a stacks node process running in pid ${res}`, duration : 4})

                }
              }>
                Get Node Status
            </Button>
            <Button
              type="primary"
              loading={startMiningLoading}
              onClick={async () => {
                    setStartMiningLoading(true)
                    await message.loading({content : "Checking Environment...", duration : 2})
                    message.loading({content : "Launching Stack Blockchain...", duration : 5})
                    const res = await startMining()
                    console.log(res)
                    setStartMiningLoading(!res)
                    message.success({content : "Launching Successfully!!!", duration : 4})
                }
              }>
                Start Mining
            </Button>
            <Button
              type="danger"
              onClick={async () => {
                const res = await stopMining()
                message.success({content : "Shut Down Successfully", duration : 4})
                console.log(res)
              }}
            >
              Stop Mining
            </Button>
          </Space>
        </Card>
        <Divider/>
        <ProTable<Account>
          headerTitle="Strategy Library"
          actionRef={actionRef}
          rowKey="tradingPair"
          columns={strategyColomns}
          search={false}
          pagination={false}
        />


    </PageContainer >
  );
};

export default TableList;
