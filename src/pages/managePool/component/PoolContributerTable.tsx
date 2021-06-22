import React, { useEffect, useState } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { BlockInfo, TxInfo } from "@/services/publicdata/data";
import { Tag, Card, InputNumber } from "antd";
import { getBlockInfo, getTxsInfo } from "@/services/publicdata/chainInfo";
import { PoolContributerInfo } from "@/services/managePool/data";
import { showMessage } from "@/services/locale";

interface PoolContributerTableProps {
  cycle: number;
}
const PoolContributerTable: React.FC<PoolContributerTableProps> = ({
  cycle,
}) => {
  const { queryPoolContributerInfo } = useModel(
    "managePool.poolContributerInfo"
  );

  const [selectedCycle, setSelectedCycle] = useState(cycle);

  useEffect(() => {
    setSelectedCycle(cycle);
  }, [cycle]);
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
      <Card bordered={false}>
        View Contributors for Cycle: 
        <InputNumber
          min={1}
          value={selectedCycle}
          onChange={setSelectedCycle}
        />
      </Card>
      <ProTable<PoolContributerInfo>
        headerTitle={
          <FormattedMessage
            id="pool.title"
            defaultMessage="Pool Contributors"
          />
        }
        columns={poolContributerColumns}
        request={() => queryPoolContributerInfo(selectedCycle)}
        rowKey={"address"}
      />
    </>
  );
};

export default PoolContributerTable;
