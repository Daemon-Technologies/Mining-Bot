import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, zhCNIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, ConfigProvider, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';
import { Account, NewAccount } from '@/services/wallet/data'
import { queryAccount } from '@/services/wallet/accountData'
import { addAccount } from './service';
import { FormattedMessage } from 'umi';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';

const { CN } = require('@/services/constants');

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: NewAccount) => {
  const hide = message.loading('Adding');
  try {
    const result = await addAccount({ ...fields });
    if (result.status !== 200) {
      throw message.error('Adding fail');
    }
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
      title: <FormattedMessage id='account.address' defaultMessage='Address' />,
      dataIndex: 'address',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id='account.type' defaultMessage='Type' />,
      dataIndex: 'type',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id='account.balance' defaultMessage='Balance' />,
      dataIndex: 'balance',
      hideInForm: true,
    },
  ];

  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: getLanguage() === CN ? zhCNIntl : enUSIntl,
        }}
      >
        <ProTable<Account>
          headerTitle={<FormattedMessage id='account.title' defaultMessage='Account Info' />}
          actionRef={actionRef}
          rowKey="address"
          columns={accountColomns}
          search={false}
          pagination={false}
          request={() => queryAccount()}
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> <FormattedMessage id='account.add' defaultMessage='Add' />
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
        />
      </ConfigProvider>
    </PageContainer >
  );
};

export default TableList;
