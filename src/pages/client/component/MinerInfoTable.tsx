import React from 'react';
import { MinerInfo, MinerInfoQueryParams } from "@/services/client/data";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";

const MinerInfoTable: React.FC<{}> = () => {
    const { operationBoardState } = useModel('client.operationBoard');
    const { minerAddress } = operationBoardState;
    const { queryMinerInfo } = useModel('client.minerInfo');

    const minerInfoColumns: ProColumns<MinerInfo>[] = [
        {
            title: <FormattedMessage id='minerInfo.stxAddress' defaultMessage='STX Address' />,
            dataIndex: 'stx_address',
            width: 150,
            copyable: true,
            ellipsis: true,
            search: false
        },
        {
            title: <FormattedMessage id='minerInfo.btcAddress' defaultMessage='BTC Address' />,
            dataIndex: 'btc_address',
            width: 120,
            render: (text, record, index, action) =>
                [<a style={record.btc_address === minerAddress ? { color: "red" } : {}} key={record.stx_address}> {record.btc_address} </a>],
            copyable: true,
            ellipsis: true,
        },
        {
            title: <FormattedMessage id='minerInfo.actualWins' defaultMessage='Actual Win' />,
            dataIndex: 'actual_win',
            width: 50,
            search: false,
        },
        {
            title: <FormattedMessage id='minerInfo.totalMined' defaultMessage='Total Mined' />,
            dataIndex: 'total_mined',
            width: 50,
            search: false,
        },
        {
            title: <FormattedMessage id='minerInfo.burn' defaultMessage='Miner Burned' />,
            dataIndex: 'miner_burned',
            width: 70,
            search: false,
        },
    ]

    return (
        <ProTable<MinerInfo, MinerInfoQueryParams>
            headerTitle={<FormattedMessage id='minerInfo.title' defaultMessage='Miner Info' />}
            rowKey="stx_address"
            pagination={{
                pageSize: 10,
            }}
            request={(params: MinerInfoQueryParams) => queryMinerInfo(params)}
            columns={minerInfoColumns}
            size="small"

            search={{ labelWidth: 'auto' }}
        />
    )
}

export default MinerInfoTable;