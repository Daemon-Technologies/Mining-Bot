import React, { useRef, Suspense } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Col, Row, Tooltip, Button, Card, Space, Divider} from 'antd';
import {FormattedMessage} from "umi"

import { Account } from '@/services/wallet/data'

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

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
            <Button type="primary">Connect Node</Button>
            <Button
              style={{
                backgroundColor: '#33FF33'
              }}
            >Start Mining
            </Button> 
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
