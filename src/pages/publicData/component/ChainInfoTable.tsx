import React from 'react';
import { ChainInfo } from '@/services/publicdata/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import { getChainInfo } from '@/services/publicdata/chainInfo';

const ChainInfoTable: React.FC<{}> = () => {

    const chainInfoColumns: ProColumns<ChainInfo>[] = [
        { title: <FormattedMessage id='chain.tipHeight' defaultMessage='Last Seen Stacks Chain Tip Height' />, dataIndex: 'stacksChainHeight' },
        { title: <FormattedMessage id='chain.burnHeight' defaultMessage='Last Seen Burn Chain Block Height' />, dataIndex: 'burnChainHeight' },
    ];

    return (
        <ProTable<ChainInfo>
            headerTitle={<FormattedMessage id='chain.title' defaultMessage='Chain Info' />}
            rowKey="stacksChainHeight"
            request={() => getChainInfo()}
            columns={chainInfoColumns}
            search={false}
            pagination={false}
        />
    )
}

export default ChainInfoTable;