import React, { useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, zhCNIntl, enUSIntl } from '@ant-design/pro-table';
import { Button, ConfigProvider, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';
import { Account, NewAccount } from '@/services/wallet/data'
import { queryAccount } from '@/services/wallet/accountData'
import { getStxFaucet, getBtcFaucet } from '@/services/wallet/faucet'
import { addAccount, deleteAccount,  } from './service';
import { FormattedMessage, getLocale } from 'umi';

const { CN } = require('@/services/constants');

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: NewAccount) => {
  const hide = message.loading(getLocale() === CN ? '添加中...' : 'Adding');
  try {
    const result = await addAccount({ ...fields });
    if (result.status !== 200) {
      throw message.error(getLocale() === CN ? '添加失败!' : 'Adding fail!');
    }
    hide();
    message.success(getLocale() === CN ? '添加成功!' : 'Adding successfully!');
    return true;
  } catch (error) {
    hide();
    message.error(getLocale() === CN ? '添加失败!' : 'Adding fail!');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: Account[]) => {
  const hide = message.loading(getLocale() === CN ? '正在删除' : 'Deleting...');
  if (!selectedRows) return true;
  try {
    const result = await deleteAccount(
      selectedRows
    );
    if (result.status !== 200) {
      throw message.error(getLocale() === CN ? '删除失败!' : 'Deleting fail!');
    }
    hide();
    message.success(getLocale() === CN ? '删除成功，即将刷新' : 'Delete successfully!');
    return true;
  } catch (error) {
    hide();
    message.error(getLocale() === CN ? '删除失败，请重试' : 'Delete fail, please try again!');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<Account[]>([]);
  const accountColomns: ProColumns<Account>[] = [
    {
      title: <FormattedMessage id='account.address' defaultMessage='Address' />,
      dataIndex: 'address',
      hideInForm: true,
      copyable: true
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
    {
      title: <FormattedMessage id='faucet.get' defaultMessage='Get Faucet' />,
      hideInForm: true,
      render : (text, record, index, action) => [<a key="1" onClick={()=>getFaucet(record)}> <FormattedMessage id='faucet.add' defaultMessage='Get Faucet' /> </a>]
    }
  ];

  const getFaucet = (value) => {
    console.log(value)
  }

  return (
    <PageContainer>
      <ConfigProvider
        value={{
          intl: getLocale() === CN ? zhCNIntl : enUSIntl,
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
            <Button key="add_account" type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> <FormattedMessage id='account.add' defaultMessage='Add' />
            </Button>,
          ]}
          rowSelection={{ onChange: (_, selectedRows) => setSelectedRows(selectedRows) }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                <FormattedMessage id='account.choose' defaultMessage='Already choose' /> <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> <FormattedMessage id='choose.num' defaultMessage='items' />&nbsp;&nbsp;
                </div>
            }
          >
            <Button
              danger
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <FormattedMessage id='button.delete' defaultMessage='Delete' /> 
              
              </Button></FooterToolbar>)
        }

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
