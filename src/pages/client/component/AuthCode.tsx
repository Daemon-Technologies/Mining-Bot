import { isValidAuthCode } from "@/services/client/Client";
import { showMessage } from "@/services/locale";
import { updateNodeInfo } from "@/services/sysConf/conf";
import { NodeInfo } from "@/services/sysConf/data";
import { getNetworkFromStorage } from "@/utils/utils";
import { Input, message, Modal } from 'antd';
import React from 'react';

export const renderAuthCode = (props: {
    authVisible: boolean; setAuthVisible: Function;
    accountSelected: any;
    nodeType: number;
    authCode: string; setAuthCode: Function;
    form: any;
    formVals: any; setFormVals: Function;
    nodeList: NodeInfo[];
    btcNode: string;
    onSubmit: Function;
    inputBurnFee: number;
    debugMode: boolean;
    setStepStatus: Function;
    onCancel: Function;
}) => {

    const {
        authVisible, setAuthVisible,
        accountSelected,
        nodeType,
        authCode, setAuthCode,
        form,
        formVals, setFormVals,
        nodeList,
        btcNode,
        onSubmit,
        inputBurnFee,
        debugMode,
        setStepStatus,
        onCancel,
    } = props;
    return (
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
                        };
                        updateNodeInfo(nodeInfo);
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
    )
}