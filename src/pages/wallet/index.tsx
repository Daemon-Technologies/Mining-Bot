import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button ,DatePicker} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Account } from '@/services/wallet/data'

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const accountColomns: ProColumns<Account>[] = [
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
    },
  ];

  return (
    <PageContainer>
        <ProTable<Account>
          headerTitle="Token Price Info"
          actionRef={actionRef}
          rowKey="tradingPair"
          columns={accountColomns}
          search={false}
          pagination={false}
        />
    </PageContainer >
  );
};

export default TableList;
