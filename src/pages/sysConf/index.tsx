import { showMessage } from "@/services/locale";
import { getSysConf, resetLockPassword, updateSysConf } from "@/services/sysConf/conf";
import { NodeInfo, SysConf } from "@/services/sysConf/data";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Divider, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from 'react';
import { useModel } from "umi";

const FormItem = Form.Item;

const Option = Select.Option;

export interface FormValueType extends Partial<SysConf> {
    miningLocalServerUrl: string;
    miningMonitorUrl: string;
    btcNodeInfo: NodeInfo;
}

const TableList: React.FC<{}> = () => {

    const confInfo: SysConf = getSysConf();

    const { nodeList, getNodeList } = useModel('sysConf.sysConf');

    useEffect(() => {
        getNodeList();
    }, []);

    const [formVals, setFormVals] = useState<FormValueType>({
        miningLocalServerUrl: confInfo.miningLocalServerUrl,
        miningMonitorUrl: confInfo.miningMonitorUrl,
        btcNodeInfo: confInfo.btcNodeInfo,
    });

    const onSubmit = async () => {
        const fieldsValue = await form.validateFields();
        setFormVals({ ...formVals, ...fieldsValue });
        const { btcNodeInfo } = fieldsValue;
        const nodeInfo = nodeList.filter(row => row.peerHost === btcNodeInfo)[0];
        const conf: SysConf = {
            miningLocalServerUrl: fieldsValue.miningLocalServerUrl,
            miningMonitorUrl: fieldsValue.miningMonitorUrl,
            btcNodeInfo: nodeInfo,
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
                name='miningMonitorUrl'
                label={showMessage('挖矿监控器地址', 'Mining-Monitor Url')}
                rules={[{ required: true, message: showMessage('挖矿监控器地址为必填项', 'Mining-Monitor Url is required') }]}
            >
                <Input placeholder={showMessage('请输入', 'Please input')} />
            </FormItem>
            <FormItem
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
            </FormItem>
            <FormItem>
                <Button onClick={() => onSubmit()} type='primary'>{showMessage('更新', 'Update')}</Button>
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
                        miningMonitorUrl: formVals.miningMonitorUrl,
                        btcNodeInfo: formVals.btcNodeInfo.peerHost
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
        </PageContainer>
    )
}

export default TableList;
