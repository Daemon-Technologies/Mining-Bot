import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, notification } from 'antd';
import { FooterToolbar } from '@ant-design/pro-layout';
import { FormattedMessage , useModel} from 'umi';
import { Account } from '@/services/wallet/data'
import { getNetworkFromStorage } from '@/utils/utils'
import { showMessage } from "@/services/locale";
import { PlusOutlined } from '@ant-design/icons';


const WalletTable: React.FC<{}> = () => {

    const { removeAccounts, queryAccountList, actionRef } = useModel('wallet.wallet');
    const { showKryptonFaucetModal } = useModel('wallet.faucet');
    const { handleModalVisible } = useModel('wallet.addAccount');

    const [selectedRowsState, setSelectedRows] = useState<Account[]>([]);
    //const actionRef = useRef<ActionType>();

    const openNotification = () => {
      const key = `open${Date.now()}`;
      const btn = (
          <Button type="primary" size="small"
              onClick={async () => {
                  switch (getNetworkFromStorage()){
                      case "Krypton": showKryptonFaucetModal(); break;
                      case "Xenon":   const w = window.open('about:blank');
                                      w.location.href = "https://testnet-faucet.mempool.co/";
                                      break;
                      case "Mainnet" : break;
                  }
              }

          }>
              Get {getNetworkFromStorage()} Faucet 
          </Button>
      );
      notification.info({
          message: (showMessage("获取测试币" ,'Faucet Get')),
          description: (showMessage("使用官方网站获取测试网比特币", 'Visit Official Faucet Website to get Test Bitcoin')),
          btn,
          key
      });
    };

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
          render: (text, record, index, action) => {
            //console.log(record)
            return [<a key="1"> {record.balance} </a>]
          }
        },
        {
          title: <FormattedMessage id='faucet.get' defaultMessage='Get Faucet' />,
          hideInForm: true,
          render: (text, record, index, action) =>{
            //console.log(record)
            return [record.type === "BTC"? <a key="1" onClick={() => openNotification()}> <FormattedMessage id='faucet.add' defaultMessage='Get Faucet' /> </a> : <a></a> ]
          }

          
        }
    ];
    return (
      <>
        <ProTable<Account>
              headerTitle={<FormattedMessage id='account.title' defaultMessage='Account Info' />}
              actionRef={actionRef}
              rowKey="address"
              columns={accountColomns}
              search={false}
              pagination={false}
              request={() => queryAccountList()}
              
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
                await removeAccounts(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <FormattedMessage id='button.delete' defaultMessage='Delete' />

            </Button>
          </FooterToolbar>)
        }
      </>
    )
}


export default WalletTable;