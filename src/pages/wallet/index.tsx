import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ConfigProvider, enUSIntl, ActionType } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Account } from '@/services/wallet/data'
import CreateForm from './components/CreateForm';
import { addAccount, queryAccount } from './service';
import { Select } from 'antd';
import { Input } from 'antd';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: Account) => {
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
    {
      title: 'Mnemonic',
      dataIndex: 'mnemonic',
      hideInTable: true,
      // renderFormItem: () => {
      //   function handleChange(value) {
      //     console.log(`selected ${value}`);
      //   }
      //   return (
      //     <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" onChange={handleChange}>
      //       <></>
      //     </Select>
      //   )
      // },
    },
    {
      title: 'Password',
      dataIndex: 'password',
      hideInTable: true,
      // renderFormItem: () => {
      //   return (
      //     <Input type="password" placeholder="Please type your password" ></Input>
      //   );
      // },
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
            rowKey="password"
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
