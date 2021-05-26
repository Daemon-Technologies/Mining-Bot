import { showMessage } from "@/services/locale";
import { getSysConf, resetLockPassword, updateSysConf } from "@/services/sysConf/conf";
import { SysConf } from "@/services/sysConf/data";
import { getNetworkFromStorage } from "@/utils/utils";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Divider, Form, Input, Modal } from "antd";
import React, { useState } from 'react';

const FormItem = Form.Item;

export interface FormValueType extends Partial<SysConf> {
    miningLocalServerUrl: string;
    miningMonitorUrl: string;
    sidecarUrl: string;
    peerHost?: string;
    username?: string;
    password?: string;
    rpcPort?: number;
    peerPort?: number;
}

export interface NodeFormValueType {
    peerHost: string;
    username: string;
    password: string;
    rpcPort: number;
    peerPort: number;
}

const TableList: React.FC<{}> = () => {

    const confInfo: SysConf = getSysConf();

    const [formVals, setFormVals] = useState<FormValueType>({
        miningLocalServerUrl: confInfo.miningLocalServerUrl,
        miningLocalChainUrl: confInfo.miningLocalChainUrl,
        miningMonitorUrl: confInfo.miningMonitorUrl,
        sidecarUrl: confInfo.sidecarUrl,
        peerHost: confInfo.btcNodeInfo?.peerHost,
        username: confInfo.btcNodeInfo?.username,
        password: confInfo.btcNodeInfo?.password,
        rpcPort: confInfo.btcNodeInfo?.rpcPort,
        peerPort: confInfo.btcNodeInfo?.peerPort,
    });

    const onSubmit = async () => {
        const fieldsValue = await form.validateFields();
        setFormVals({ ...formVals, ...fieldsValue });
        let conf: SysConf = {
            miningLocalServerUrl: fieldsValue.miningLocalServerUrl,
            miningLocalChainUrl: fieldsValue.miningLocalChainUrl,
            miningMonitorUrl: fieldsValue.miningMonitorUrl,
            sidecarUrl: fieldsValue.sidecarUrl,
            btcNodeInfo: {
                peerHost: fieldsValue.peerHost,
                username: fieldsValue.username,
                password: fieldsValue.password,
                rpcPort: fieldsValue.rpcPort,
                peerPort: fieldsValue.peerPort,
            }
        };
        updateSysConf(conf);
    }

    const [modalVisible, handleModalVisible] = useState(false);

    const [form] = Form.useForm();

    const renderContent = () => {
        return <>
            <FormItem
                name='miningLocalServerUrl'
                label={showMessage('挖矿机器人服务端地址', 'Mining-Local-Server Url')}
                rules={[{ required: true, message: showMessage('挖矿机器人服务端地址为必填项', 'Mining-Local-Server Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            <FormItem
                name='miningLocalChainUrl'
                label={showMessage('本地Stacks链地址', 'Local Stacks Chain Url')}
                rules={[{ required: true, message: showMessage('本地Stacks链地址为必填项', 'Local Stacks Chain Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            <FormItem
                name='miningMonitorUrl'
                label={showMessage('挖矿监控器地址', 'Mining-Monitor Url')}
                rules={[{ required: true, message: showMessage('挖矿监控器地址为必填项', 'Mining-Monitor Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            <FormItem
                name='sidecarUrl'
                label={showMessage('Stacks链Sidecar地址', 'Stacks Sidecar Url')}
                rules={[{ required: true, message: showMessage('Stacks链Sidecar地址为必填项', 'Stacks Sidecar Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            {getNetworkFromStorage() === 'Xenon' || getNetworkFromStorage() === 'Mainnet' ?
                <>
                    <FormItem
                        name='peerHost'
                        label={showMessage('BTC节点服务器地址', 'BTC Node Peer Host')}
                        rules={[{ required: true, message: showMessage('服务器地址为必填项', 'Peer Host is required') }]}
                    >
                        <Input placeholder={showMessage('请输入', 'Please input')} />
                    </FormItem>
                    <FormItem
                        name='username'
                        label={showMessage('BTC节点用户名', 'BTC Node Username')}
                        rules={[{ required: true, message: showMessage('用户名为必填项', 'Username is required') }]}
                    >
                        <Input placeholder={showMessage('请输入', 'Please input')} />
                    </FormItem>
                    <FormItem
                        name='password'
                        label={showMessage('BTC节点密码', 'BTC Node Password')}
                        rules={[{ required: true, message: showMessage('密码为必填项', 'Password is required') }]}
                    >
                        <Input placeholder={showMessage('请输入', 'Please input')} />
                    </FormItem>
                    <FormItem
                        name='rpcPort'
                        label={showMessage('RPC端口', 'BTC Node RPC Port')}
                        rules={[{ required: true, message: showMessage('RPC端口为必填项', 'RPC Port is required') }]}
                    >
                        <Input placeholder={showMessage('请输入', 'Please input')} />
                    </FormItem>
                    <FormItem
                        name='peerPort'
                        label={showMessage('节点端口', 'BTC Node Peer Port')}
                        rules={[{ required: true, message: showMessage('节点端口为必填项', 'Peer Port is required') }]}
                    >
                        <Input placeholder={showMessage('请输入', 'Please input')} />
                    </FormItem>
                </>
                : undefined}
            <FormItem>
                <Button onClick={() => onSubmit()} type='primary'>{showMessage('保存', 'Save')}</Button>
            </FormItem>
        </>
    }

    return (
        <PageContainer>
            <Card
                style={{
                    height: '100%',
                }}
                bordered={false}
                title={showMessage('修改系统配置', 'System Configuration')}
            >
                <Form
                    form={form}
                    layout='vertical'
                    initialValues={{
                        miningLocalServerUrl: formVals.miningLocalServerUrl,
                        miningLocalChainUrl: formVals.miningLocalChainUrl,
                        miningMonitorUrl: formVals.miningMonitorUrl,
                        sidecarUrl: formVals.sidecarUrl,
                        peerHost: formVals.peerHost,
                        username: formVals.username,
                        password: formVals.password,
                        rpcPort: formVals.rpcPort,
                        peerPort: formVals.peerPort,
                    }}
                >
                    {renderContent()}
                </Form>
            </Card>
            <Divider />
            <Card
                title={showMessage('重置锁定密码', 'Reset Lock Password')}
            >
                <Button onClick={() => handleModalVisible(true)} type="primary" danger={true}>{showMessage('重置锁定密码', 'Reset Lock Password')}</Button>
            </Card>
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title={showMessage('重置锁定密码', 'Reset Lock Password')}
                visible={modalVisible}
                onCancel={() => handleModalVisible(false)}
                okText={showMessage('确认', 'Confirm')}
                cancelText={showMessage('取消', 'Cancel')}
                onOk={() => resetLockPassword()}
            >
                <span style={{ color: 'red' }}>
                    {showMessage('这将清空你所有的账户信息，请慎重！'
                        , 'Attention please! This operation will clear all your account info.')}
                </span>
            </Modal>
        </PageContainer>
    )
}

export default TableList;
