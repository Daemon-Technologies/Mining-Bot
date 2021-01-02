import React, {useState} from 'react';
import { Modal, Button, notification } from 'antd';
import { FormattedMessage, useModel} from 'umi';
import { getNetworkFromStorage } from '@/utils/utils'
import { showMessage } from "@/services/locale";

const FaucetForm: React.FC<{}> = () => {

    const {  handleFaucetOk, handleFaucetCancel, isFaucetModalVisible } = useModel('wallet.faucet');
    
    return (
        <>
            <Modal
                title={<FormattedMessage id='faucet.notification' defaultMessage='Faucet Confirm' />}
                visible={isFaucetModalVisible}
                onOk={handleFaucetOk}
                onCancel={handleFaucetCancel}
                >
                <FormattedMessage id='faucet.notification.content' defaultMessage='If you want to get Faucet?' />
            </Modal>
        </>
    )
}

export default FaucetForm