import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import { BlockInfo, TxInfo } from '@/services/publicdata/data';
import { Tag } from 'antd';
import { getBlockInfo, getTxsInfo } from '@/services/publicdata/chainInfo';

const BlockInfoTable: React.FC<{}> = () => {

    const blockInfoColumns: ProColumns<BlockInfo>[] = [
        {
            title: <FormattedMessage id='block.height' defaultMessage='Height' />,
            dataIndex: 'height',
            render: (_) => <Tag color="blue">{_}</Tag>,
            width: 35,
            align: 'center'
        },
        {
            title: <FormattedMessage id='block.hash' defaultMessage='Block Hash' />,
            dataIndex: 'hash',
            width: 100,
            ellipsis: true
        },
        {
            title: <FormattedMessage id='block.fee' defaultMessage='Total Fee' />,
            dataIndex: 'total_fee',
            width: 50
        },
        {
            title: <FormattedMessage id='block.status' defaultMessage='Status' />, dataIndex: 'canonical',
            initialValue: 'success',
            valueEnum: {
                success: { text: <FormattedMessage id='block.status.success' defaultMessage='Success' />, status: 'Success' },
                pending: { text: <FormattedMessage id='block.status.pending' defaultMessage='Pending' />, status: 'Processing' }
            },
            width: 50
        }
    ];

    const txInfoColumns: ProColumns<TxInfo>[] = [
        {
            title: <FormattedMessage id='block.info.txHash' defaultMessage='TX Hash' />,
            dataIndex: 'tx_id',
            key: 'tx_id',
            ellipsis: true
        },
        {
            title: <FormattedMessage id='block.info.status' defaultMessage='Status' />,
            dataIndex: 'tx_status',
            key: 'tx_status',
            initialValue: 'success',
            valueEnum: {
                success: {
                    text: <FormattedMessage id='block.info.status.success' defaultMessage='Success' />,
                    status: 'Success'
                },
                pending: {
                    text: <FormattedMessage id='block.info.status.pending' defaultMessage='Pending' />,
                    status: 'Processing'
                }
            },
        },
        {
            title: <FormattedMessage id='block.info.feeRate' defaultMessage='Fee Rate' />,
            dataIndex: 'fee_rate',
            key: 'fee_rate'
        },
        {
            title: <FormattedMessage id='block.info.txType' defaultMessage='TX Type' />,
            dataIndex: 'tx_type',
            key: 'tx_type'
        },
    ];

    const TxTable = (record: { txs: any; }) => {
        const TXs = record.txs;
        console.log(record)
        return (
            <ProTable
                columns={txInfoColumns}
                search={false}
                options={false}
                request={() => getTxsInfo(TXs)}
                pagination={false}
                key="tx_id"
            />
        );
    };

    return (
        <ProTable<BlockInfo>
            headerTitle={<FormattedMessage id='block.title' defaultMessage='Block Info' />}
            rowKey="height"
            request={() => getBlockInfo()}
            expandable={{ expandedRowRender: TxTable }}
            columns={blockInfoColumns}
            pagination={false}
            dateFormatter="string"
            search={false}
        />
    )
}

export default BlockInfoTable;