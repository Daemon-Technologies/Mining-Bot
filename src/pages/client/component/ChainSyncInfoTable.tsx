import React from 'react';
import { ChainSyncInfo } from "@/services/client/data";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";

const ChainSyncInfoTable: React.FC<{}> = () => {

    const { queryChainSyncInfo } = useModel('client.chainSyncInfo');

    const chainSyncInfoColumns: ProColumns<ChainSyncInfo>[] = [
        {
            title: <FormattedMessage id='chainSyncInfo.type' defaultMessage='Type' />,
            dataIndex: 'type',
            valueEnum: {
                0: { text: <FormattedMessage id='chainSyncInfo.type.main' defaultMessage='Main Chain' /> },
                1: { text: <FormattedMessage id='chainSyncInfo.type.local' defaultMessage='Local Chain' /> }
            },
            width: 30,
        },
        {
            title: <FormattedMessage id='chainSyncInfo.burn_block_height' defaultMessage='Burn Chain Block Height' />,
            dataIndex: 'burn_block_height',
            width: 50,
        },
        {
            title: <FormattedMessage id='chainSyncInfo.stacks_tip_height' defaultMessage='Stacks Chain Tip Height' />,
            dataIndex: 'stacks_tip_height',
            width: 50,
        },
        {
            title: <FormattedMessage id='chainSyncInfo.stacks_tip' defaultMessage='Stacks Chain Tip Block Hash' />,
            dataIndex: 'stacks_tip',
            ellipsis: true,
            width: 150,
        },
    ]

    return (
        <ProTable<ChainSyncInfo>
            headerTitle={<FormattedMessage id='chainSyncInfo.title' defaultMessage='Chain Sync Info' />}
            rowKey="type"
            pagination={{
                pageSize: 10,
            }}
            request={() => queryChainSyncInfo()}
            columns={chainSyncInfoColumns}
            search={false}
        />
    )
}

export default ChainSyncInfoTable;