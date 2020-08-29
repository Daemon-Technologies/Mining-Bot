import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';

import { Account } from '@/services/wallet/data'


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: Account) => {
  const hide = message.loading('正在添加');
  try {
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const accountColomns: ProColumns<Account>[] = [
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      hideInForm: true
    },
  ];

  return (
    <PageContainer>
      <ProTable<Account>
        headerTitle="Account Info"
        actionRef={actionRef}
        rowKey="tradingPair"
        columns={accountColomns}
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> Add
            </Button>,
        ]}
      />

      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ConfigProvider
          value={{
            intl: enUSIntl,
          }}
        >
          <ProTable<Account, Account>
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            columns={accountColomns}
            rowSelection={{}}
          />
        </ConfigProvider>
      </CreateForm>
    </PageContainer >
  );
};

export default TableList;
