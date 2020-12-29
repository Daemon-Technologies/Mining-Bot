import { MiningInfo, MiningInfoQueryParams } from '@/services/client/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import React from 'react';
import { FormattedMessage, useModel } from 'umi';

const MiningInfoTable: React.FC<{}> = () => {

    const { operationBoardState } = useModel('client.operationBoard');
    const { queryMiningInfo } = useModel('client.miningInfo');
    const { minerAddress } = operationBoardState;
    const miningInfoColumns: ProColumns<MiningInfo>[] = [
        {
            title: <FormattedMessage id='miningInfo.stacksHeight' defaultMessage='Stacks Chain Height' />,
            dataIndex: 'stacks_block_height',
            width: 35,
            render: (_) => <Tag color="blue">{_}</Tag>,
            search: false,
        },
        {
            title: <FormattedMessage id='minerInfo.stxAddress' defaultMessage='STX Address' />,
            dataIndex: 'stx_address',
            copyable: true,
            ellipsis: true,
            width: 150,
            search: false,
        },
        {
            title: <FormattedMessage id='minerInfo.btcAddress' defaultMessage='BTC Address' />,
            dataIndex: 'btc_address',
            render: (text, record, index, action) =>
                [<a style={record.btc_address === minerAddress ? { color: "red" } : {}} key={record.stacks_block_height}> {record.btc_address} </a>],
            copyable: true,
            ellipsis: true,
            width: 150,
        },
        {
            title: <FormattedMessage id='miningInfo.burnfee' defaultMessage='Burn Fee' />,
            dataIndex: 'burn_fee',
            width: 50,
            search: false,
        },
    ]

    return (
        <ProTable<MiningInfo, MiningInfoQueryParams>
            size="small"
            headerTitle={<FormattedMessage id='miningInfo.title' defaultMessage='Miner Info' />}
            rowKey="stacks_block_height"
            pagination={{
                pageSize: 10,
            }}
            request={async (params: MiningInfoQueryParams) => queryMiningInfo(params)}
            columns={miningInfoColumns}
            search={{ labelWidth: 'auto' }}
        />
    )
}

export default MiningInfoTable;