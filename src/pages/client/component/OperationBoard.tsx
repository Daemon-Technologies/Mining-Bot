import { Account } from '@/services/wallet/data';
import { DownloadOutlined } from '@ant-design/icons';
import { Divider, Button, Card, Progress, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage, useModel } from 'umi';
import AccountForm from './AccountForm';

const { Title, Paragraph } = Typography;

const OperationBoard: React.FC<{}> = () => {

    const { operationBoardState,
        downloadStart,
        handleDownloadProcess, handleNodeStatus,
        checkStatus, handleStopMining,
        handleModalVisible, handleFormSubmit } = useModel('client.operationBoard');

    const { minerAddress, isDownloading, nodeStatus,
        startMiningLoading, percent,
        processing, createModalVisible } = operationBoardState;

    /* nodeStatus 
        -1 no Mining-Local-Server Started
        -2 Got Mining-Local-Server, but no stacks-node found
        -3 Found stacks-node, but stacks-node is incomplete. Will delete it, delete successfully.
        -4 Found stacks-node, but stacks-node is incomplete. Will delete it, delete unsuccessfully, please do it manually.
        -5 Found stacks-node, but no PID of stacks-node runs
        
        else PID nodeStatus is running.
    */
    const render_boardStatus = () => {
        let t;
        switch (nodeStatus) {
            case undefined: t = <a><FormattedMessage id='status.noMiningLocalServerRunning' defaultMessage="No Mining-Local-Program detected!" /></a>
                break;
            case -1: t = <a><FormattedMessage id='status.noMiningLocalServerRunning' defaultMessage="No Mining-Local-Program detected!" /></a>
                break;
            case -2: t = <a><FormattedMessage id='status.noStacksNodeFound' defaultMessage='Mining Local Server is Running, But stacks-node binary not found!' /></a>
                break;
            case -3: t = <a><FormattedMessage id='status.stacksNodeDeletedSuccessfully' defaultMessage='Found stacks-node, but stacks-node file is incomplete. Will delete it... Delete successfully! Please Refresh the Mining-bot and redownload stacks-node!' /></a>
                break;
            case -4: t = <a><FormattedMessage id='status.stacksNodeDeletedUnsuccessfully' defaultMessage='Found stacks-node, but stacks-node file is incomplete. Will delete it... Delete unsuccessfully!!! Please delete it manually in Mining-Local-Server folder before refresh the Mining-Bot.' /></a>
                break;
            case -5: t = <a><FormattedMessage id='status.noStacksNodeRunning' defaultMessage='Stacks-node is downloaded but not running!' /></a>
                break;
            case -6: t = <a><FormattedMessage id='status.isDownloading' defaultMessage='Downloading Stacks-node now!' /></a>
                break;
            default: t = <a><FormattedMessage id='status.programRunning' defaultMessage='Mining Program is Running, PID is ' /> {nodeStatus}</a>
                break;
        }

        return (
            <div>
                <FormattedMessage id='status.current' defaultMessage='Current Status' /> :
                {t}
            </div>
        )
    }

    useEffect(() => {
        handleDownloadProcess()
    }, [])

    useEffect(() => {
        handleNodeStatus()
    }, [])

    return (
        <>
            <Card
                style={{
                    height: '100%',
                }}
                bordered={false}
                title={
                    <FormattedMessage
                        id="opt.title"
                        defaultMessage="Mining Operation Board"
                    />
                }
            >
                <Typography>
                    <Paragraph>
                        <Title level={3}>
                            {render_boardStatus()}
                        </Title>
                        <Title level={5}>
                            {minerAddress ?
                                <div>
                                    <FormattedMessage id='status.miner' defaultMessage='Miner address is' />
                                    <a> {`:${minerAddress}`} </a>
                                </div>
                                :
                                <div></div>
                            }
                        </Title>
                    </Paragraph>
                    <Paragraph>
                        <Space>
                            <Button
                                type="default"
                                onClick={() => checkStatus()}>
                                <FormattedMessage id='opt.button.status' defaultMessage='Get Node Status' />
                            </Button>
                            <Button
                                type="primary"
                                loading={startMiningLoading}
                                onClick={() => handleModalVisible(true)}
                                disabled={nodeStatus !== -5}
                            >
                                <FormattedMessage id='opt.button.start' defaultMessage='Start Mining' />
                            </Button>
                            <Button
                                type="primary"
                                danger={true}
                                onClick={handleStopMining}
                                disabled={!(nodeStatus && nodeStatus > 0)}
                            >

                                <FormattedMessage id='opt.button.stop' defaultMessage='Stop Mining' />
                            </Button>
                        </Space>
                    </Paragraph>

                    <Button type="primary" shape="round" icon={<DownloadOutlined />} hidden={(nodeStatus !== -2) && (nodeStatus !== -6)}
                        onClick={downloadStart}
                        loading={isDownloading}
                    >
                        <FormattedMessage id='opt.button.download' defaultMessage='Download stacks-node' />
                    </Button>
                    <div hidden={!processing}>
                        <Progress
                            strokeColor={{
                                from: '#108ee9',
                                to: '#87d068',
                            }}
                            percent={percent}
                            status="active"
                            style={{ width: 500, marginLeft: 30 }}
                        // hidden={!processing}
                        />
                    </div>
                </Typography>
            </Card>
            <Divider />
            <AccountForm
                onSubmit={(value: { account: Account, inputBurnFee: number, network: string }) => handleFormSubmit(value)}
                onCancel={() => handleModalVisible(false)}
                modalVisible={createModalVisible ? createModalVisible : false}
            />
        </>
    )
}

export default OperationBoard;