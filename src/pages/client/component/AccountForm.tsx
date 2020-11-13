import React, { useState } from 'react';
import { Modal, Button, Card } from 'antd';
import ProTable, { ProColumns} from '@ant-design/pro-table';
import { queryAccount } from '@/services/wallet/accountData'
import { Account } from '@/services/wallet/data'
import { Steps, Divider } from 'antd';
import { Slider, InputNumber, Row, Col } from 'antd';

const { Step } = Steps;


interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: {account: Account, inputBurnFee: number}) => void;
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


const AccountForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [accountSelected, handleAccountSelected] = useState<Account>()
  const [stepStatus, setStepStatus] = useState(0)
  const [inputBurnFee, setInputBurnFee] = useState()
  //console.log("in")
  //console.log(accountSelected)
  const rowSelection = {
    onChange : (selectedRowKeys: any, selectedRows: React.SetStateAction<Account | undefined>[]) => {
      //console.log(`selectedRowKeys: ${selectedRowKeys}, selectedRows: ${selectedRows}`)
      console.log("selectRows:", selectedRows)
      handleAccountSelected(selectedRows[0])
    }
  }

  const renderAccountContent = () => {
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
          request={()=>queryAccount()}
        />
      </>
    )
  };



  const onChangeBurnFeeInput = (value:any) => {
    if (isNaN(value)) {
      return;
    }
    setInputBurnFee(value);
  }

  const renderBurnFeeContent = () => {
    return (
      <>
        <Card title="Set Burn Fee">
          <Row style={{ margin: '10px 5px' }}>
            <Col span={12}>
              <Slider
                min={1000}
                max={100000}
                onChange={onChangeBurnFeeInput}
                value={typeof inputBurnFee === 'number' ? inputBurnFee : 0}
                step={100}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1000}
                max={100000}
                style={{ margin: '0 16px' }}
                step={100}
                value={inputBurnFee}
                onChange={onChangeBurnFeeInput}
              />
            </Col>
          </Row>
        </Card>
      </>
    )
  };


  const renderSubmitFooter = () => {
    return (
      <>
        { 
          (() => {
            switch (stepStatus){
              case 0 :  return  (<div> 
                                  <Button danger onClick={() => onCancel()}>Cancel</Button>
                                  <Button 
                                      type="primary" 
                                      disabled={accountSelected == undefined? true:false}
                                      onClick={()=> setStepStatus(1)}>
                                        
                                    Next
                                  </Button>
                                </div>)
              case 1 :  return  (<div> 
                                  <Button danger onClick={() => onCancel()}>Cancel</Button>
                                  <Button onClick={()=> setStepStatus(0)}>Back</Button>
                                  <Button 
                                      type="primary" 
                                      disabled={accountSelected == undefined? true:false}
                                      onClick={()=> onSubmit({account : accountSelected, inputBurnFee : inputBurnFee})}>
                                        
                                      Set Burn Fee
                                  </Button>
                                </div>)


            }
          })()
        }
        
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title="Start Mining Configuration"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderSubmitFooter()}
    > 
      <Steps current={stepStatus}>
        <Step title="Account Selection"/>
        <Step title="Burn Fee Setting"/>
      </Steps>
      
      <Divider/>

      {(() => {
        switch (stepStatus){
          case 0 :  return  renderAccountContent()
          case 1 :  return  renderBurnFeeContent()
        }
      })()}
    </Modal>
  );
};

export default AccountForm;

//To Do Chinese