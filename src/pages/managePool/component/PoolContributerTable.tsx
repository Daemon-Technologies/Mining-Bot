import React, { useEffect, useState } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { BlockInfo, TxInfo } from "@/services/publicdata/data";
import { Tag, Card, InputNumber, Button } from "antd";
import { getBlockInfo, getTxsInfo } from "@/services/publicdata/chainInfo";
import { PoolContributerInfo } from "@/services/managePool/data";
import { showMessage } from "@/services/locale";
import { getNetworkFromStorage } from "@/utils/utils";
const {
  sidecarURLXenon,
  sidecarURLMainnet,
  bitcoinTestnet3,
  bitcoinMainnet2,
  firstStackingBlock,
} = require("@/services/constants");

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
    {
      title: (
        <FormattedMessage id="pool.cycleContribution" defaultMessage="Cycle" />
      ),
      dataIndex: "cycleContribution",
    },
    {
      title: (
        <FormattedMessage id="pool.blockContribution" defaultMessage="Block" />
      ),
      dataIndex: "blockContribution",
    },
    {
      title: (
        <FormattedMessage id="pool.transaction" defaultMessage="Transaction" />
      ),
      dataIndex: "transactionHash",
      render: (value) => {
        let baseUrl = bitcoinTestnet3;
        switch (getNetworkFromStorage()) {
          case "Xenon": {
            baseUrl = `https://live.blockcypher.com/btc-testnet/tx/${value}`;
            break;
          }
          case "Mainnet": {
            baseUrl = `https://live.blockcypher.com/btc/tx/${value}`;
            break;
          }
          default:
            break;
        }
        return (
          <Button
            onClick={() => {
              window.open(`${baseUrl}`, "_blank");
            }}
          >
            View
          </Button>
        );
      },
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
        manualRequest={true}
        params={{ selectedCycle }}
      />
    </>
  );
};

export default PoolContributerTable;
