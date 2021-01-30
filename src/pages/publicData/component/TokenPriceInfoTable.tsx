import React from 'react';
import { TokenPrice } from '@/services/publicdata/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import { getTokenPrice } from '@/services/publicdata/tokenInfo';

const TokenPriceInfoTable: React.FC<{}> = () => {

    const tokenPriceColumns: ProColumns<TokenPrice>[] = [
        { title: <FormattedMessage id='price.pair' defaultMessage='Trading Pair' />, dataIndex: 'tradingPair', },
        { title: <FormattedMessage id='price.price' defaultMessage='Price' />, dataIndex: 'price', valueType: 'text', },
    ];

    return (
        <ProTable<TokenPrice>
            headerTitle={<FormattedMessage id='price.title' defaultMessage='Token Price Info' />}
            rowKey="tradingPair"
            request={() => getTokenPrice()}
            columns={tokenPriceColumns}
            search={false}
            pagination={false}
        />
    )
}

export default TokenPriceInfoTable;