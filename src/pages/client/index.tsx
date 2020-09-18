import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {  Button, Card, Space, Divider} from 'antd';
import {FormattedMessage} from "umi"

import { Account } from '@/services/wallet/data'


const TableList: React.FC<{}> = () => {


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
            <Button type="primary">Start Mining</Button>
            <Button type="danger">Stop Mining</Button>
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
