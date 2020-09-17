import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Account, NewAccount } from '@/services/wallet/data'
import CreateForm from './components/CreateForm';
import { addAccount, queryAccount } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: NewAccount) => {
  const hide = message.loading('Adding');
  try {
    await addAccount({ ...fields });
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const accountColomns: ProColumns<Account>[] = [
    {
      title: 'Address',
      dataIndex: 'address',
      hideInForm: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      hideInForm: true,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      hideInForm: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<Account>
        headerTitle="Account Info"
        actionRef={actionRef}
        rowKey="address"
        columns={accountColomns}
        search={false}
        pagination={false}
        request={() => queryAccount()}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> Add
            </Button>,
        ]}
      />

      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
      </CreateForm>
    </PageContainer >
  );
};

export default TableList;
