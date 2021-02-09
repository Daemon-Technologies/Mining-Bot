import React from 'react';
import { BlockInfo, BlockCommitInfo } from "@/services/client/data";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";


const BlockCommitInfoTable: React.FC<{}> = () => {
    const { queryBlockInfo } = useModel('client.blockInfo');
    const BlockCommitInfoColumns: ProColumns<BlockCommitInfo>[] = [
        {
            title: <FormattedMessage id='minerInfo.stxAddress' defaultMessage='STX Address' />,
            dataIndex: 'leader_key_address',
            width: 150,
            copyable: true,
            ellipsis: true,
            
        },
        {
            title: <FormattedMessage id='minerInfo.btcAddress' defaultMessage='BTC Address' />,
            dataIndex: 'btc_address',
            width: 120,
            copyable: true,
            ellipsis: true
        },
        {
            title: <FormattedMessage id='minerInfo.burn' defaultMessage='Miner Burned' />,
            dataIndex: 'burn_fee',
            width: 70,
            search: false
        },
    ]

    return (
        <>
            <ProTable
                headerTitle={<FormattedMessage id='blockInfo.title' defaultMessage='Block Commit Info' />}
                rowKey="leader_key_address"
                pagination={false}
                request={() => queryBlockInfo()}
                columns={BlockCommitInfoColumns}
                search={false}
                size="small"
            />
        </>
    )
}

export default BlockCommitInfoTable;