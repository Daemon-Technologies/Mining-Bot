import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { Account } from '@/services/wallet/data'
import { Steps, Divider } from 'antd';
import { showMessage } from '@/services/locale';
import { useForm } from 'antd/es/form/Form';
import { useModel } from 'umi';
import { getSysConf, updateNodeInfo } from '@/services/sysConf/conf';
import { NodeInfo } from '@/services/sysConf/data';
import { renderNodeInfo } from './Step3NodeInfoContent';
import { renderFeeInfo } from './Step2BurnFeeContent';
import { renderAccount } from './Step1AccountContent';
import { renderAuthCode } from './AuthCode';

const { Step } = Steps;

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: { account: Account, inputBurnFee: number, inputFeeRate: number, debugMode: boolean, nodeInfo: NodeInfo, authCode: string, network: string }) => Promise<API.RequestResult>;
}

interface FormValueType {
  peerHost?: string;
  username?: string;
  password?: string;
  rpcPort?: number;
  peerPort?: number;
}

const AccountForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [accountSelected, handleAccountSelected] = useState<Account>();
  const [stepStatus, setStepStatus] = useState(0);
  const [inputBurnFee, setInputBurnFee] = useState(20000);
  const [inputFeeRate, setInputFeeRate] = useState(50);
  const [debugMode, setDebugMode] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [authCode, setAuthCode] = useState<string>('');
  const [btcNode, setBtcNode] = useState<string>('');
  const [nodeType, setNodeType] = useState(1);
  const [form] = useForm();

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
                      if (nodeType === 1) {
                        const fieldsValue = await form.validateFields();
                        setFormVals({ ...formVals, ...fieldsValue });
                        const nodeInfo: NodeInfo = {
                          peerHost: fieldsValue.peerHost,
                          username: fieldsValue.username,
                          password: fieldsValue.password,
                          rpcPort: fieldsValue.rpcPort,
                          peerPort: fieldsValue.peerPort,
                        };
                        updateNodeInfo(nodeInfo);
                      }
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
            case 0: return renderAccount(
              {
                handleAccountSelected: handleAccountSelected,
              }
            );
            case 1: return renderFeeInfo({
              inputBurnFee: inputBurnFee,
              setInputBurnFee: setInputBurnFee,
              inputFeeRate: inputFeeRate,
              setInputFeeRate: setInputFeeRate,
              setDebugMode: setDebugMode,
            }
            );
            case 2: return renderNodeInfo(
              {
                nodeType: nodeType,
                setNodeType: setNodeType,
                form: form,
                setBtcNode: setBtcNode,
                formVals: formVals,
                nodeList: nodeList,
              }
            );
            default: return;
          }
        })()}
      </Modal>
      {renderAuthCode({
        authVisible: authVisible, setAuthVisible: setAuthVisible,
        accountSelected: accountSelected,
        nodeType: nodeType,
        authCode: authCode, setAuthCode: setAuthCode,
        form: form,
        formVals: formVals, setFormVals: setFormVals,
        nodeList: nodeList,
        btcNode: btcNode,
        onSubmit: onSubmit,
        inputBurnFee: inputBurnFee,
        inputFeeRate: inputFeeRate,
        debugMode: debugMode,
        setStepStatus: setStepStatus,
        onCancel: onCancel,
      })}
    </>
  );
};

export default AccountForm;