import React from 'react';
import { MinerInfo, MinerInfoQueryParams } from "@/services/publicdata/data";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { exportInfo } from '@/services/publicdata/exportUtils';

const MinerInfoTable: React.FC<{}> = () => {
    const { operationBoardState } = useModel('client.operationBoard');
    let { minerAddress } = operationBoardState;
    const { minerInfoState, queryMinerInfo } = useModel('publicData.minerInfo');
    let { minerInfoList } = minerInfoState;
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
        <>
            <ProTable<MinerInfo, MinerInfoQueryParams>
                headerTitle={<FormattedMessage id='minerInfo.title' defaultMessage='Miner Info' />}
                rowKey="stx_address"
                pagination={{
                    pageSize: 10,
                }}
                request={(params: MinerInfoQueryParams) => queryMinerInfo(params)}
                columns={minerInfoColumns}
                size="small"
                toolBarRender={() => [
                    <Button key="add_account" type="primary" onClick={() => exportInfo(minerInfoList)}>
                        <ExportOutlined /> <FormattedMessage id='minerInfo.export' defaultMessage='Export' />
                    </Button>,
                ]}
                search={{ labelWidth: 'auto' }}
            />
        </>
    )
}

export default MinerInfoTable;