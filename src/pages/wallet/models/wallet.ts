import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useRef } from "react";
import { ActionType } from '@ant-design/pro-table';
import { queryAccount, deleteAccount } from '@/services/wallet/account'
import { Account } from "@/services/wallet/data";

export default () => {
    // state
    const actionRef = useRef<ActionType>();
    /**
    *  删除账户
    * @param selectedRows
    */
    const removeAccounts = async (selectedRows: Account[]) => {
        const hide = message.loading(showMessage('正在删除', 'Deleting...'));
        if (!selectedRows) return true;
        try {
            const result = await deleteAccount(selectedRows);
            if (result.status !== 200) {
                throw Error('删除失败');
            }
            hide();
            message.success(showMessage('删除成功，即将刷新', 'Delete successfully!'));
            return true;
        } catch (error) {
            hide();
            message.error(showMessage('删除失败，请重试', 'Delete fail, please try again!'));
            return false;
        }
    };

    const queryAccountList = () => {
        return queryAccount()
    }

    return {
        removeAccounts,
        queryAccountList,
        actionRef
    }

}





