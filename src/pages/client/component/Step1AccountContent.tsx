import { showMessage } from "@/services/locale";
import { queryAccount } from "@/services/wallet/account";
import ProTable, { ProColumns } from "@ant-design/pro-table"
import React from 'react';

export const renderAccount = (props: { handleAccountSelected: Function; }) => {
    const {
        handleAccountSelected,
    } = props;

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: React.SetStateAction<Account | undefined>[]) => {
            handleAccountSelected(selectedRows[0]);
        }
    }

    const columns: ProColumns<Account>[] = [
        {
            title: (showMessage("比特币地址", 'BTC Address')),
            dataIndex: 'address',
            render: (text) => <a>{text}</a>,
        },
        {
            title: (showMessage("余额", 'Balance')),
            dataIndex: 'balance',
        }
    ];

    return (
        <>
            <ProTable<Account>
                rowSelection={{
                    type: 'radio',
                    ...rowSelection
                }}
                rowKey="address"
                search={false}
                columns={columns}
                request={() => queryAccount(1)}
            />
        </>
    )
}