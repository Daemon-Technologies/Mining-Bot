import React, { useState } from 'react';
import { Modal, Button, Card } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryAccount } from '@/services/wallet/accountData'
import { Account } from '@/services/wallet/data'
import { Steps, Divider } from 'antd';
import { Slider, InputNumber, Row, Col } from 'antd';
import { showMessage } from '@/services/locale';

const { MIN_MINER_BURN_FEE } = require('@/services/constants');
const { Step } = Steps;


interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: { account: Account, inputBurnFee: number, network: string }) => Promise<void>;
}


const columns: ProColumns<Account>[] = [
  {
    title: (showMessage("比特币地址", 'BTC Address')),
    dataIndex: 'address',
    render: (text) => <a>{text}</a>,
  },
  {
    title: (showMessage("余额", 'Balance')),
    dataIndex: 'balance',
  }
];


const AccountForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [accountSelected, handleAccountSelected] = useState<Account>();
  const [stepStatus, setStepStatus] = useState(0);
  const [inputBurnFee, setInputBurnFee] = useState(20000);


  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: React.SetStateAction<Account | undefined>[]) => {
      // console.log("selectRows:", selectedRows);
      handleAccountSelected(selectedRows[0]);
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
          request={() => queryAccount(1)}
        />
      </>
    )
  };


  const onChangeBurnFeeInput = (value: any) => {
    if (isNaN(value)) {
      return;
    }
    setInputBurnFee(value);
  }

  const renderBurnFeeContent = () => {
    return (
      <>
        <Card title={(showMessage("设置燃烧量", "Set Burn Fee"))}>
          <Row style={{ margin: '10px 5px' }}>
            <Col span={12}>
              <Slider
                min={MIN_MINER_BURN_FEE}
                max={1000000}
                onChange={onChangeBurnFeeInput}
                value={typeof inputBurnFee === 'number' ? inputBurnFee : 0}
                step={200}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={MIN_MINER_BURN_FEE}
                max={1000000}
                style={{ margin: '0 16px' }}
                step={200}
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
            switch (stepStatus) {
              case 0: return (<div>
                <Button danger onClick={() => onCancel()}>{(showMessage("取消", "Cancel"))}</Button>
                <Button
                  type="primary"
                  disabled={accountSelected == undefined ? true : false}
                  onClick={() => setStepStatus(1)}>
                  {(showMessage("下一步", "Next"))}
                </Button>
              </div>)
              case 1: return (<div>
                <Button danger onClick={() => onCancel()}>{(showMessage("取消", "Cancel"))}</Button>
                <Button onClick={() => setStepStatus(0)}>{(showMessage("上一步", "Back"))}</Button>
                <Button
                  type="primary"
                  disabled={accountSelected === undefined ? true : false}
                  onClick={() => {
                    if (accountSelected) {
                      onSubmit({ account: accountSelected, inputBurnFee: inputBurnFee, network: 'Krypton' });
                      setStepStatus(0);
                      onCancel();
                    }
                  }
                  }
                >
                  {(showMessage("完成", "Finish"))}
                </Button>
              </div>)
              default: return (<></>)
            }
          })()
        }

      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title={(showMessage("账户选择", "Start Mining Configuration"))}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderSubmitFooter()}
    >
      <Steps current={stepStatus}>
        <Step title={(showMessage("账户选择", "Account Selection"))} />
        <Step title={(showMessage("燃烧量设置", "Burn Fee Setting"))} />
      </Steps>

      <Divider />

      {(() => {
        switch (stepStatus) {
          case 0: return renderAccountContent();
          case 1: return renderBurnFeeContent();
          default: return;
        }
      })()}
    </Modal>
  );
};

export default AccountForm;