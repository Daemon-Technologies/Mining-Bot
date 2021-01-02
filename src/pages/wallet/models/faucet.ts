import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useState } from "react";
import { getStxFaucet, getBtcFaucet } from '@/services/wallet/faucet'
import { getNetworkFromStorage } from '@/utils/utils'
import { Account } from '@/services/wallet/data'

export default () => {
    const [isFaucetModalVisible, setFaucetModalVisible] = useState<boolean>(false);
    const [faucetAccount, setFaucetAccount] = useState<Account>();

    const handleGetFaucet = (value: React.SetStateAction<Account | undefined>) => {
        setFaucetAccount(value)
        switch (getNetworkFromStorage()){
          case "Krypton":  setFaucetModalVisible(true); break;
          case "Xenon": async () => {
                          const w = await window.open('about:blank');
                          w.location.href = "https://testnet-faucet.mempool.co/";
                        }
                        break;
          case "Mainnet": break;
        }
    }
    const handleFaucetOk = async () => {
        setFaucetModalVisible(false);
        console.log(faucetAccount)

        if (faucetAccount?.type === "BTC") {
            let t = await getBtcFaucet(faucetAccount.address)
            if (t && t.success && t.success == true) {
                message.success(showMessage(`测试币获取成功，交易id为${t.txid}`,`Faucet get successfully, txid is ${t.txid}`))
            }
            console.log(t)
        }
        else if (faucetAccount?.type === "STX") {
            let t = await getStxFaucet(faucetAccount.address)
            if (t?.success === true) {
                message.success(showMessage(`测试币获取成功，交易id为${t.txid}`, `Faucet get successfully, txid is ${t.txid}`))
            }
            console.log(t)
        }
    };

    const handleFaucetCancel = () => {
        setFaucetModalVisible(false);
    };

    const showKryptonFaucetModal = () => {
        setFaucetModalVisible(true);
    }
    
    const getCurrentAddress = () => {
        return faucetAccount
    }

    return {
        handleFaucetOk,
        handleFaucetCancel,
        handleGetFaucet,
        showKryptonFaucetModal,
        isFaucetModalVisible,
        getCurrentAddress
    }
}