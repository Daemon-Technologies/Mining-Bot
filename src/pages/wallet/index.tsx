import React, { useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, ConfigProvider, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';
import { Account, NewAccount } from '@/services/wallet/data'
import { queryAccount } from '@/services/wallet/accountData'
import { getStxFaucet, getBtcFaucet } from '@/services/wallet/faucet'
import { addAccount, deleteAccount, } from './service';
import { FormattedMessage, getLocale } from 'umi';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

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
      throw Error('添加失败');
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
      throw Error('删除失败');
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
  const [isFaucetModalVisible, setFaucetModalVisible] = useState<boolean>(false);
  const [faucetAccount, setFaucetAccount] = useState<Account>();

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
      render: (text, record, index, action) => [<a key="1"> {record.type === "BTC" ? record.balance : parseInt(record.balance) / 1000000} </a>]
    },
    {
      title: <FormattedMessage id='faucet.get' defaultMessage='Get Faucet' />,
      hideInForm: true,
      render: (text, record, index, action) => [record.type === "BTC"? <a key="1" onClick={() => getFaucet(record)}> <FormattedMessage id='faucet.add' defaultMessage='Get Faucet' /> </a> : <a></a> ]
    }
  ];

  const getFaucet = (value: React.SetStateAction<Account | undefined>) => {
    setFaucetAccount(value)
    setFaucetModalVisible(true)
  }

  const handleFaucetOk = async () => {
    setFaucetModalVisible(false);
    console.log(faucetAccount)
    if (faucetAccount)
      if (faucetAccount.type === "BTC") {
        let t = await getBtcFaucet(faucetAccount.address)
        if (t && t.success && t.success == true) {
          message.success(getLocale() === CN ? `测试币获取成功，交易id为${t.txid}` : `Faucet get successfully, txid is ${t.txid}`)
        }
        console.log(t)
      }
      else if (faucetAccount.type === "STX") {
        let t = await getStxFaucet(faucetAccount.address)
        if (t && t.success && t.success == true) {
          message.success(getLocale() === CN ? `测试币获取成功，交易id为${t.txid}` : `Faucet get successfully, txid is ${t.txid}`)
        }
        console.log(t)
      }
  };

  const handleFaucetCancel = () => {
    setFaucetModalVisible(false);
  };

  return (
    <PageContainer>
      <ConfigProvider
        locale={getLocale() === CN ? zhCN : enUS}
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
        <Modal
          title={<FormattedMessage id='faucet.notification' defaultMessage='Faucet Confirm' />}
          visible={isFaucetModalVisible}
          onOk={handleFaucetOk}
          onCancel={handleFaucetCancel}
        >
          <FormattedMessage id='faucet.notification.content' defaultMessage='If you want to get Faucet for address : ' />
          {faucetAccount ? faucetAccount.address : ""}
        </Modal>
      </ConfigProvider>
    </PageContainer >
  );
};

export default TableList;
