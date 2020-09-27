import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable, { ProColumns} from '@ant-design/pro-table';
import { queryAccount } from '@/services/wallet/accountData'
import { Account } from '@/services/wallet/data'

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Account) => void;
}


const columns : ProColumns<Account>[]  = [
  {
    title: 'BtcAddress',
    dataIndex: 'address',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
  }
];


const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [accountSelected, handleAccountSelected] = useState<Account>()

  const rowSelection = {
    onChange : (selectedRowKeys: any, selectedRows: React.SetStateAction<Account | undefined>[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}, selectedRows: ${selectedRows}`)
      console.log(selectedRows)
      handleAccountSelected(selectedRows[0])
    }
  }

  const renderContent = () => {
    return (
      <>
        <ProTable<Account>
          rowSelection={{
            type: 'radio',
            ...rowSelection
          }}
          rowKey="address"
          search={false}
          columns={columns}
          request={()=>queryAccount(1)}
        />
      </>
    )
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="primary" onClick={ ()=> onSubmit(accountSelected)}>
          Select
        </Button>
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title="Choose BTC Address"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  );
};

export default CreateForm;
