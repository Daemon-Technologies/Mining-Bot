import { getNodeStatus, startMining, stopMining } from "@/services/client/Client";
import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useState } from "react";
import { initiateSocket, subscribePercent, subscribeDownloadFinish, startDownload, disconnectSocket } from '@/services/client/socket';
import { Account } from "@/services/wallet/data";
import { NodeInfo } from "@/services/sysConf/data";

const { MIN_MINER_BTC_AMOUNT } = require('@/services/constants');

export type OperationBoardState = {
    minerAddress?: string | undefined,
    isDownloading?: boolean,
    nodeStatus?: number | -1,
    startMiningLoading?: boolean,
    percent?: number,
    processing?: boolean,
    createModalVisible?: boolean,
}

export default () => {
    let [operationBoardState, setOperationBoardState] = useState<OperationBoardState>({
        minerAddress: '',
        nodeStatus: -1,
    });

    const downloadStart = () => {
        startDownload();
        setOperationBoardState({
            ...operationBoardState,
            isDownloading: true,
            nodeStatus: -6,
        });
    }

    const handleDownloadProcess = () => {
        initiateSocket()
        subscribePercent((err: Error, data: number) => {
            if (err) {
                return;
            }
            setOperationBoardState(state => {
                return {
                    ...state,
                    percent: Number((data * 100).toFixed(1)),
                    processing: true,
                }
            });
            console.log((data * 100).toFixed(1));
        })

        subscribeDownloadFinish((err: Error, data: any) => {
            if (err) {
                return;
            }
            if (data) {
                setOperationBoardState(state => {
                    return {
                        ...state,
                        isDownloading: false,
                        nodeStatus: -5,
                    }
                });
                message.success(showMessage('下载成功!', "Download successfully!"))
                window.location.reload()
            }
        })
        return () => {
            disconnectSocket();
        }
    }

    const handleNodeStatus = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 })
        const res = await getNodeStatus();
        setOperationBoardState(state => {
            return {
                ...state,
                nodeStatus: res.PID ? res.PID : -1,
                minerAddress: res.address
            }
        });
    }

    const checkStatus = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 });
        // await getNodeStatus();
        await handleNodeStatus();
    }

    const handleStopMining = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 })
        const res = await stopMining()
        if (res.status === 404) {
            message.success({ content: showMessage('没有挖矿程序在运行!', `${res.data}`), duration: 4 })
        }
        else if (res.status === 200) {
            message.success({ content: showMessage('关闭成功！', `${res.data}`), duration: 4 })
        }
        await handleNodeStatus()
        setOperationBoardState(state => {
            return {
                ...state,
                minerAddress: undefined,
            }
        });
        console.log(res)
    }

    const handleModalVisible = (visible: boolean) => {
        setOperationBoardState(state => {
            return {
                ...state,
                createModalVisible: visible,
            }
        });
    }

    const handleFormSubmit = async (value: { account: Account, inputBurnFee: number, inputFeeRate: number, debugMode: boolean, nodeInfo: NodeInfo, authCode: string, network: string }) => {
        //console.log("value", value)
        if (value.account && parseFloat(value.account.balance) < MIN_MINER_BTC_AMOUNT) {
            message.error({ content: showMessage('你的比特币余额不足以继续挖矿，跳转到钱包页面进行充值', "Your Bitcoin is not enough to mine, turn to Wallet page to get faucet."), duration: 3 })
            //openNotification()
            handleModalVisible(false)
        }
        else {
            setOperationBoardState(state => {
                return {
                    ...state,
                    startMiningLoading: true,
                }
            });
            await message.loading({ content: showMessage('检查环境.....', "Checking Environment..."), duration: 1 })
            await message.loading({ content: showMessage('启动Stacks Blockchain', "Launching Stacks Blockchain..."), duration: 1 })

            // Add network type
            // value.network =;
            // console.log(value)
            // Launching stack-blockchain by rpc
            const res = await startMining(value);
            setOperationBoardState(state => {
                return {
                    ...state,
                    startMiningLoading: !res,
                    createModalVisible: false,
                }
            });
            // Launching Successfully
            if (res.status === 200) {
                message.success({ content: showMessage('启动成功！', "Launching Successfully!!!"), duration: 4 });
            }
            // Launching UnSuccessfully
            else {
                message.error({ content: showMessage('启动异常，请联系管理员！', "Launching Error, Please Contact With Admin!!!"), duration: 4 });
            }
            await handleNodeStatus();
            return res;
        }
    }

    return {
        operationBoardState,
        downloadStart,
        handleDownloadProcess,
        handleNodeStatus,
        checkStatus,
        handleStopMining,
        handleModalVisible,
        handleFormSubmit,
    }
}