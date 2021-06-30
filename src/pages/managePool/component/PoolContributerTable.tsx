import React, { useEffect, useState } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { BlockInfo, TxInfo } from "@/services/publicdata/data";
import { Tag, Card, InputNumber, Button, Table } from "antd";
import { getBlockInfo, getTxsInfo } from "@/services/publicdata/chainInfo";
import { PoolContributerInfo } from "@/services/managePool/data";
import { showMessage } from "@/services/locale";
import { getNetworkFromStorage } from "@/utils/utils";
import {
  getBalanceAtBlock,
  getCycleBlocks,
  getCycleContributions,
  getLocalPoolBalance,
} from "@/services/managePool/managePool";
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
      copyable: true,
      ellipsis: true,
    },
    {
      title: (
        <FormattedMessage id="pool.stxAddress" defaultMessage="STX Address" />
      ),
      dataIndex: "stxAddress",
      copyable: true,
      ellipsis: true,
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
    {
      title: (
        <FormattedMessage
          id="pool.rewardPercentage"
          defaultMessage="Reward %"
        />
      ),
      dataIndex: "rewardPercentage",
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
        summary={(contributions) => {
          //   let total = 0;
          //   for (const contribution of contributions) {
          //     total += contribution.contribution;
          //   }
          let total = getCycleContributions(selectedCycle - 1);

          const { endBlock } = getCycleBlocks(selectedCycle - 1);
          const balance = getBalanceAtBlock(endBlock);
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total Contributed In Last Cycle
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{total}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total Remaining At End of Last Cycle
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{balance}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default PoolContributerTable;
