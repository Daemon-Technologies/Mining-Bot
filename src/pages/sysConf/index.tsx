import { showMessage } from "@/services/locale";
import { getSysConf, resetLockPassword, updateNodeList, updateSysConf } from "@/services/sysConf/conf";
import { NodeInfo, SysConf } from "@/services/sysConf/data";
import { getNetworkFromStorage } from "@/utils/utils";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Divider, Form, Input, message, Modal, Select } from "antd";
import React, { useEffect, useState } from 'react';
import { useModel } from "umi";

const FormItem = Form.Item;

const Option = Select.Option;

export interface FormValueType extends Partial<SysConf> {
    miningLocalServerUrl: string;
    miningMonitorUrl: string;
    btcNodeInfo?: NodeInfo;
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

    const { nodeList, getNodeList } = useModel('sysConf.sysConf');

    const [nodeModal, setNodeModal] = useState(false);

    useEffect(() => {
        getNodeList();
    }, []);

    const [formVals, setFormVals] = useState<FormValueType>({
        miningLocalServerUrl: confInfo.miningLocalServerUrl,
        miningMonitorUrl: confInfo.miningMonitorUrl,
        btcNodeInfo: confInfo.btcNodeInfo,
    });

    const [nodeFormVals, setNodeFormVals] = useState<NodeFormValueType>();

    const onSubmit = async () => {
        const fieldsValue = await form.validateFields();
        setFormVals({ ...formVals, ...fieldsValue });
        let conf: SysConf = {
            miningLocalServerUrl: fieldsValue.miningLocalServerUrl,
            miningMonitorUrl: fieldsValue.miningMonitorUrl,
        };
        if (fieldsValue.btcNodeInfo) {
            const { btcNodeInfo } = fieldsValue;
            console.log('btc:', btcNodeInfo)
            const nodeInfo = nodeList.filter(row => row.peerHost === btcNodeInfo)[0];
            conf.btcNodeInfo = nodeInfo;
        }
        updateSysConf(conf);
    }

    const onAddNode = async () => {
        const fieldsValue = await nodeForm.validateFields();
        setNodeFormVals({ ...nodeFormVals, ...fieldsValue });
        let nodeInfo: NodeInfo = {
            peerHost: fieldsValue.peerHost,
            username: fieldsValue.username,
            password: fieldsValue.password,
            rpcPort: fieldsValue.rpcPort,
            peerPort: fieldsValue.peerPort,
        }
        updateNodeList(nodeInfo);
        message.success(showMessage('添加成功', 'Add successfully'));
        setNodeModal(false);
        window.location.reload();
    }

    const [modalVisible, handleModalVisible] = useState(false);

    const [form] = Form.useForm();

    const [nodeForm] = Form.useForm();

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
                name='miningMonitorUrl'
                label={showMessage('挖矿监控器地址', 'Mining-Monitor Url')}
                rules={[{ required: true, message: showMessage('挖矿监控器地址为必填项', 'Mining-Monitor Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            {getNetworkFromStorage() === 'Xenon' ? <FormItem
                name='btcNodeInfo'
                label={showMessage('选择要同步的BTC节点', 'Choose BTC node to sync')}
                rules={[{ required: true, message: showMessage('同步节点为必选项', 'BTC Node is required') }]}
            >
                <Select>
                    {nodeList.map(row => {
                        return (
                            <Option key={row.peerHost} value={row.peerHost}>{row.peerHost}</Option>
                        )
                    })}
                </Select>
            </FormItem> : undefined}
            <div style={{ paddingLeft: '95%' }}>
                <Button onClick={() => setNodeModal(true)} type='primary'>{showMessage('添加', 'Add')}</Button>
            </div>
            <FormItem>
                <Button onClick={() => onSubmit()} type='primary'>{showMessage('更新', 'Update')}</Button>
            </FormItem>
        </>
    }

    const renderAddNodeForm = () => {
        return (
            <>
                <FormItem
                    name='peerHost'
                    label={showMessage('服务器地址', 'Peer Host')}
                    rules={[{ required: true, message: showMessage('服务端地址为必填项', 'Server Url is required') }]}
                >
                    <Input placeholder={showMessage('请输入', 'Please input')} />
                </FormItem>
                <FormItem
                    name='username'
                    label={showMessage('用户名', 'Username')}
                    rules={[{ required: true, message: showMessage('用户名为必填项', 'username is required') }]}
                >
                    <Input placeholder={showMessage('请输入', 'Please input')} />
                </FormItem>
                <FormItem
                    name='password'
                    label={showMessage('密码', 'Password')}
                    rules={[{ required: true, message: showMessage('密码为必填项', 'Password is required') }]}
                >
                    <Input placeholder={showMessage('请输入', 'Please input')} />
                </FormItem>
                <FormItem
                    name='rpcPort'
                    label={showMessage('RPC端口', 'RPC Port')}
                    rules={[{ required: true, message: showMessage('RPC端口为必填项', 'RPC Port is required') }]}
                >
                    <Input type='number' placeholder={showMessage('请输入', 'Please input')} />
                </FormItem>
                <FormItem
                    name='peerPort'
                    label={showMessage('节点端口', 'Peer Port')}
                    rules={[{ required: true, message: showMessage('节点端口为必填项', 'Peer Port is required') }]}
                >
                    <Input type='number' placeholder={showMessage('请输入', 'Please input')} />
                </FormItem>
            </>
        )
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
                        miningMonitorUrl: formVals.miningMonitorUrl,
                        btcNodeInfo: formVals.btcNodeInfo?.peerHost
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
                        , 'Attention plaese! This operation will clear all your account info.')}
                </span>
            </Modal>

            <Modal
                width={640}
                destroyOnClose
                title={showMessage('添加BTC节点', 'Add BTC Node')}
                visible={nodeModal}
                onCancel={() => setNodeModal(false)}
                okText={showMessage('添加', 'Add')}
                cancelText={showMessage('取消', 'Cancel')}
                onOk={onAddNode}
            >
                <Form
                    form={nodeForm}
                    layout='vertical'
                >
                    {renderAddNodeForm()}
                </Form>
            </Modal>
        </PageContainer>
    )
}

export default TableList;
