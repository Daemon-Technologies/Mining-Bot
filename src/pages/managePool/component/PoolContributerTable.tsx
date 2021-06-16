import React from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { BlockInfo, TxInfo } from "@/services/publicdata/data";
import { Tag } from "antd";
import { getBlockInfo, getTxsInfo } from "@/services/publicdata/chainInfo";
import { PoolContributerInfo } from "@/services/managePool/data";

const PoolContributerTable: React.FC<{}> = () => {
  const { queryPoolContributerInfo } = useModel(
    "managePool.poolContributerInfo"
  );
  const poolContributerColumns: ProColumns<PoolContributerInfo>[] = [
    {
      title: <FormattedMessage id="pool.address" defaultMessage="Address" />,
      dataIndex: "address",
    },
    {
      title: (
        <FormattedMessage
          id="pool.contribution"
          defaultMessage="Contribution"
        />
      ),
      dataIndex: "contribution",
    },
  ];

  return (
    <>
      <ProTable<PoolContributerInfo>
        headerTitle={
          <FormattedMessage
            id="pool.title"
            defaultMessage="Pool Contributors"
          />
        }
        columns={poolContributerColumns}
        //TODO: finish rest of this table like request and rowkey
        request={() => queryPoolContributerInfo()}
        rowKey={"address"}
      />
    </>
  );
};

export default PoolContributerTable;
