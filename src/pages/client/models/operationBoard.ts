import { getNodeStatus, startMining, stopMining } from "@/services/client/Client";
import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useState } from "react";
import { initiateSocket, subscribePercent, subscribeDownloadFinish, startDownload, disconnectSocket } from '@/services/client/socket';
import { Account } from "@/services/wallet/data";

const { MIN_MINER_BTC_AMOUNT } = require('@/services/constants');

export interface OperationBoardState {
    minerAddress: string | undefined,
    isDownloading: boolean,
    nodeStatus: number,
    startMiningLoading: boolean,
    percent: number,
    processing: boolean,
    createModalVisible: boolean,
}

export default () => {
    let [operationBoardState, setOperationBoardState] = useState<OperationBoardState>({
        minerAddress: undefined,
        isDownloading: false,
        nodeStatus: -1,
        startMiningLoading: false,
        percent: -1,
        processing: false,
        createModalVisible: false,
    });

    const initialNodeStatus = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 })
        const res = await getNodeStatus()
        console.log(res)
        if (res.PID) {
            setOperationBoardState({
                ...operationBoardState,
                nodeStatus: res.PID,
            });
        } else {
            setOperationBoardState({
                ...operationBoardState,
                nodeStatus: -1,
            });
        }
        setOperationBoardState({
            ...operationBoardState,
            minerAddress: res.address,
        });
    }

    const downloadStart = () => {
        startDownload();
        setOperationBoardState({
            ...operationBoardState,
            isDownloading: true,
        });
    }

    const handleDownloadProcess = () => {
        initiateSocket()
        subscribePercent((err: Error, data: number) => {
            if (err) {
                return;
            }
            if (!operationBoardState.isDownloading) {
                setOperationBoardState({
                    ...operationBoardState,
                    isDownloading: true,
                });
            }
            console.log((data * 100).toFixed(1));
            setOperationBoardState({
                ...operationBoardState,
                percent: Number((data * 100).toFixed(1)),
                processing: true,
            });
        })

        subscribeDownloadFinish((err: Error, data: any) => {
            if (err) {
                return;
            }
            if (data) {
                setOperationBoardState({
                    ...operationBoardState,
                    isDownloading: false,
                });
                message.success(showMessage('下载成功!', "Download successfully!"))
                window.location.reload()
            }
        })
        return () => {
            disconnectSocket();
        }
    }

    const handleNodeStatus = () => {
        initialNodeStatus()
        if (operationBoardState.nodeStatus == -3) {
            window.location.reload()
        }
    }

    const checkStatus = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 });
        await getNodeStatus();
        await initialNodeStatus();
    }

    const handleStopMining = async () => {
        await message.loading({ content: showMessage('环境检查中....', "Checking Environment..."), duration: 2 })
        const res = await stopMining()
        console.log(res)
        if (res.status === 404) {
            message.success({ content: showMessage('没有挖矿程序在运行!', `${res.data}`), duration: 4 })
        }
        else if (res.status === 200) {
            message.success({ content: showMessage('关闭成功！', `${res.data}`), duration: 4 })
        }
        await initialNodeStatus()
        setOperationBoardState({
            ...operationBoardState,
            minerAddress: undefined,
        });
        console.log(res)
    }

    const handleModalVisible = (visible: boolean) => {
        setOperationBoardState({
            ...operationBoardState,
            createModalVisible: visible,
        });
    }

    const handleFormSubmit = async (value: { account: Account, inputBurnFee: number, network: string }) => {
        //console.log("value", value)
        if (value.account.balance < MIN_MINER_BTC_AMOUNT) {
            message.error({ content: showMessage('你的比特币余额不足以继续挖矿，跳转到钱包页面进行充值', "Your Bitcoin is not enough to mine, turn to Wallet page to get faucet."), duration: 3 })
            //openNotification()
            handleModalVisible(false)
        }
        else {
            setOperationBoardState({
                ...operationBoardState,
                startMiningLoading: true,
            });
            await message.loading({ content: showMessage('检查环境.....', "Checking Environment..."), duration: 1 })
            await message.loading({ content: showMessage('启动Stacks Blockchain', "Launching Stacks Blockchain..."), duration: 1 })

            // Add network type
            value.network = "Krypton"
            console.log(value)
            // Launching stack-blockchain by rpc
            const res = await startMining(value)
            console.log(res)
            setOperationBoardState({
                ...operationBoardState,
                startMiningLoading: !res,
            });
            // Launching Successfully
            if (res.status == 200) {
                message.success({ content: showMessage('启动成功！', "Launching Successfully!!!"), duration: 4 })
                handleModalVisible(false);
            }
            // Launching UnSuccessfully
            else {
                message.error({ content: showMessage('启动异常，请联系管理员！', "Launching Error, Please Contact With Admin!!!"), duration: 4 })
                handleModalVisible(false)
            }
            await initialNodeStatus()
        }
    }

    return {
        operationBoardState,
        initialNodeStatus,
        downloadStart,
        handleDownloadProcess,
        handleNodeStatus,
        checkStatus,
        handleStopMining,
        handleModalVisible,
        handleFormSubmit,
    }
}