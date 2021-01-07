import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Switch, Input, message, Radio, Select } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryAccount } from '@/services/wallet/account'
import { Account } from '@/services/wallet/data'
import { Steps, Divider, Form } from 'antd';
import { Slider, InputNumber, Row, Col } from 'antd';
import { showMessage } from '@/services/locale';
import { isValidAuthCode } from '@/services/client/Client';
import { getNetworkFromStorage } from '@/utils/utils';
import { useForm } from 'antd/es/form/Form';
import { useModel } from 'umi';
import { getSysConf } from '@/services/sysConf/conf';
import { NodeInfo } from '@/services/sysConf/data';

const { MIN_MINER_BURN_FEE } = require('@/services/constants');
const { Step } = Steps;
const { Group } = Radio;
const Option = Select.Option;

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: { account: Account, inputBurnFee: number, debugMode: boolean, nodeInfo: NodeInfo, authCode: string, network: string }) => Promise<API.RequestResult>;
}

interface FormValueType {
  peerHost?: string;
  username?: string;
  password?: string;
  rpcPort?: number;
  peerPort?: number;
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

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const AccountForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [accountSelected, handleAccountSelected] = useState<Account>();
  const [stepStatus, setStepStatus] = useState(0);
  const [inputBurnFee, setInputBurnFee] = useState(20000);
  const [debugMode, setDebugMode] = useState(true);
  const [authVisible, setAuthVisible] = useState(false);
  const [authCode, setAuthCode] = useState<string>('');
  const [btcNode, setBtcNode] = useState<string>('');
  const [nodeType, setNodeType] = useState(1);

  const { nodeList, getNodeList } = useModel('client.nodeList');

  const confInfo = getSysConf();

  const [formVals, setFormVals] = useState<FormValueType>({
    peerHost: confInfo.btcNodeInfo?.peerHost,
    username: confInfo.btcNodeInfo?.username,
    password: confInfo.btcNodeInfo?.password,
    rpcPort: confInfo.btcNodeInfo?.rpcPort,
    peerPort: confInfo.btcNodeInfo?.peerPort,
  });

  useEffect(() => {
    getNodeList();
  }, [])

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: React.SetStateAction<Account | undefined>[]) => {
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

  const onChangeDebugMode = (value: any) => {
    if (isNaN(value)) {
      return;
    }
    setDebugMode(value);
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
        <br />
        {showMessage('是否开启Debug模式:  ', 'Debug Mode:  ')}<Switch onChange={onChangeDebugMode} checkedChildren={showMessage('开启', 'On')} unCheckedChildren={showMessage('关闭', 'Off')} />
      </>
    )
  };

  const [form] = useForm();

  const renderNodeForm = () => {
    return (
      <>
        <FormItem
          name='peerHost'
          label={showMessage('服务器地址', 'Peer Host')}
          rules={[{ required: true, message: showMessage('服务端地址为必填项', 'Server Url is required') }]}
        >
          <Input disabled={nodeType !== 1} placeholder={showMessage('请输入', 'Please input')} />
        </FormItem>
        <FormItem
          name='username'
          label={showMessage('用户名', 'Username')}
          rules={[{ required: true, message: showMessage('用户名为必填项', 'username is required') }]}
        >
          <Input disabled={nodeType !== 1} placeholder={showMessage('请输入', 'Please input')} />
        </FormItem>
        <FormItem
          name='password'
          label={showMessage('密码', 'Password')}
          rules={[{ required: true, message: showMessage('密码为必填项', 'Password is required') }]}
        >
          <Input disabled={nodeType !== 1} placeholder={showMessage('请输入', 'Please input')} />
        </FormItem>
        <FormItem
          name='rpcPort'
          label={showMessage('RPC端口', 'RPC Port')}
          rules={[{ required: true, message: showMessage('RPC端口为必填项', 'RPC Port is required') }]}
        >
          <Input disabled={nodeType !== 1} type='number' placeholder={showMessage('请输入', 'Please input')} />
        </FormItem>
        <FormItem
          name='peerPort'
          label={showMessage('节点端口', 'Peer Port')}
          rules={[{ required: true, message: showMessage('节点端口为必填项', 'Peer Port is required') }]}
        >
          <Input disabled={nodeType !== 1} type='number' placeholder={showMessage('请输入', 'Please input')} />
        </FormItem>
      </>
    )
  }

  const renderNodeInfoContent = () => {
    return (
      <>
        <Group onChange={e => setNodeType(e.target.value)} value={nodeType}>
          <Radio style={radioStyle} value={1}>
            {showMessage('本地BTC节点', 'Local BTC Node Info')}
          </Radio>
          <Form
            form={form}
            layout='vertical'
            initialValues={{
              peerHost: formVals.peerHost,
              username: formVals.username,
              password: formVals.password,
              rpcPort: formVals.rpcPort,
              peerPort: formVals.peerPort,
            }
            }
          >
            {renderNodeForm()}
          </Form>
        </Group>
        <br />
        <Group onChange={e => setNodeType(e.target.value)} value={nodeType}>
          <Radio style={radioStyle} value={2}>
            {showMessage('远程BTC节点', 'Remote BTC Node Info')}
          </Radio>
          <Select
            disabled={nodeType !== 2}
            style={{ width: '100%' }}
            onChange={(e: string) => { setBtcNode(e) }}
          >
            {nodeList.map(row => {
              return (
                <>
                  <Option value={row.peerHost}>{row.peerHost}</Option>
                </>
              )
            })}
          </Select>
        </Group>
      </>
    )
  }


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
                  disabled={accountSelected == undefined ? true : false}
                  onClick={() => setStepStatus(2)}>
                  {(showMessage("下一步", "Next"))}
                </Button>

              </div>)
              case 2: return (
                <div>
                  <Button danger onClick={() => onCancel()}>{(showMessage("取消", "Cancel"))}</Button>
                  <Button onClick={() => setStepStatus(1)}>{(showMessage("上一步", "Back"))}</Button>
                  <Button
                    type="primary"
                    disabled={
                      accountSelected !== undefined
                        && (
                          (nodeType === 2 && btcNode !== '')
                          ||
                          (nodeType === 1 && form.validateFields())
                        )
                        ? false : true
                    }
                    onClick={async () => {
                      await form.validateFields();
                      setAuthVisible(true);
                    }}
                  >
                    {(showMessage("完成", "Finish"))}
                  </Button>
                </div>
              )
              default: return (<></>)
            }
          })()
        }

      </>
    )
  }

  return (
    <>
      <Modal
        destroyOnClose
        title={(showMessage("账户选择", "Start Mining Configuration"))}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderSubmitFooter()}
      >
        <Steps current={stepStatus}>
          <Step title={(showMessage("账户选择", "Account"))} />
          <Step title={(showMessage("燃烧量设置", "Burn Fee"))} />
          <Step title={(showMessage("节点设置", "BTC Node"))} />
        </Steps>

        <Divider />

        {(() => {
          switch (stepStatus) {
            case 0: return renderAccountContent();
            case 1: return renderBurnFeeContent();
            case 2: return renderNodeInfoContent();
            default: return;
          }
        })()}
      </Modal>
      <Modal
        destroyOnClose
        title={(showMessage("授权密码", "Auth Code"))}
        visible={authVisible}
        onCancel={() => setAuthVisible(false)}
        okText={showMessage('授权', 'Authentication')}
        onOk={async () => {
          if (accountSelected) {
            const res = await isValidAuthCode(authCode);
            let nodeInfo: NodeInfo = {
              peerHost: '',
              username: '',
              password: '',
              rpcPort: 18332,
              peerPort: 18333,
            };
            if (nodeType === 1) {
              const fieldsValue = await form.validateFields();
              setFormVals({ ...formVals, ...fieldsValue });
              nodeInfo = {
                peerHost: fieldsValue.peerHost,
                username: fieldsValue.username,
                password: fieldsValue.password,
                rpcPort: fieldsValue.rpcPort,
                peerPort: fieldsValue.peerPort,
              }
            } else {
              nodeInfo = nodeList.filter(row => row.peerHost === btcNode)[0];
            }
            if (res.status === 200) {
              await onSubmit({
                account: accountSelected,
                inputBurnFee: inputBurnFee,
                debugMode: debugMode,
                nodeInfo: nodeInfo,
                authCode: authCode,
                network: getNetworkFromStorage()
              });
              setAuthVisible(false);
              setStepStatus(0);
              onCancel();
            } else {
              message.error('authCode error!');
            }
          }
        }}
        cancelText={showMessage('取消', 'Cancel')}
      >
        <Input onChange={event => setAuthCode(event.target.value)} type='password' placeholder={showMessage('输入授权密码', 'input auth code')} />
      </Modal>
    </>
  );
};

export default AccountForm;