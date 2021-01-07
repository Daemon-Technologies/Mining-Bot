import React from 'react';
import { Radio, Select, Form, Input } from 'antd';
import { showMessage } from '@/services/locale';
import { NodeInfo } from '@/services/sysConf/data';

const { Group } = Radio;
const Option = Select.Option;
const FormItem = Form.Item;

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

export const renderNodeInfo = (props: { nodeType: number; setNodeType: Function; form: any; setBtcNode: Function; nodeList: NodeInfo[]; formVals: any; }) => {

    const {
        nodeType, setNodeType,
        form,
        setBtcNode,
        nodeList,
        formVals,
    } = props;

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