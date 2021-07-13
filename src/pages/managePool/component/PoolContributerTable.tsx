import React, { useEffect, useState } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { FormattedMessage, useModel } from "umi";
import { Card, InputNumber, Button, Table, Tooltip } from "antd";
import { PoolContributerInfo, StxBalances } from "@/services/managePool/data";
import { showMessage } from "@/services/locale";
import { getNetworkFromStorage } from "@/utils/utils";
import {
  getBalanceAtBlock,
  getCycleBlocks,
  getCycleContributions,
  getBtcHeight,
} from "@/services/managePool/managePool";
import { getStxBalance } from "@/services/wallet/account";
import { getCurrentCycle } from "@/services/managePool/managePool";
const { bitcoinTestnet3, stxBalanceCoef } = require("@/services/constants");
import { b58ToC32 } from "c32check";

const PoolContributerTable: React.FC<{}> = () => {
  const { queryPoolContributerInfo } = useModel(
    "managePool.poolContributerInfo"
  );

  const [currentCycle, setCurrentCycle] = useState(-1);
  const [selectedCycle, setSelectedCycle] = useState(currentCycle);
  const [stxBalance, setStxBalance] = useState(0);
  const [currentBtcHeight, setBtcHeight] = useState(0);

  useEffect(() => {
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress");
    if (pooledBtcAddress) {
      getStxBalance(b58ToC32(pooledBtcAddress)).then((resp: StxBalances) =>
        setStxBalance(parseFloat(resp.stx.balance) / stxBalanceCoef)
      );
    }

    getCurrentCycle().then(({ cycle }) => {
      setCurrentCycle(cycle);
      setSelectedCycle(cycle);
    });

    getBtcHeight().then((height) => setBtcHeight(height));
  }, []);

  const getDisabledReason = (): string => {
    // TODO: if rewards were already sent out, disable button
    const { endBlock } = getCycleBlocks(currentCycle - 1);
    if (currentBtcHeight < endBlock + 100) {
      return showMessage(
        "TODO",
        "Can only send rewards after 100 blocks after end of last cycle"
      );
    }
    return "Not implemented yet";
  };

  const disabledReason = getDisabledReason();

  const canSendRewards = (): boolean => {
    if (selectedCycle != currentCycle - 1) {
      return false;
    }
    return true;
  };

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
        <div style={{ marginBottom: "8px" }}>
          {showMessage("TODO", "View Contributors for Cycle:")}
          <InputNumber
            min={1}
            value={selectedCycle}
            onChange={setSelectedCycle}
          />
        </div>

        {/* {canSendRewards() && ( */}
        {false && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "8px" }}>
              {showMessage("TODO", "STX to send: ")}
            </div>
            <div style={{ marginRight: "8px" }}>
              <InputNumber
                min={0}
                value={stxBalance}
                onChange={setStxBalance}
              />
            </div>
            <div>
              <Tooltip title={disabledReason}>
                {/*TODO: add functionality for send many  */}
                <Button type="primary" disabled={disabledReason != ""}>
                  Send Rewards
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
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
        rowKey={"transactionHash"}
        manualRequest={true}
        params={{ selectedCycle }}
        summary={(contributions) => {
          let total = getCycleContributions(selectedCycle - 1);

          const { endBlock } = getCycleBlocks(selectedCycle - 1);
          const balance = getBalanceAtBlock(endBlock);
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total Contributed In Last Cycle
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {total.toFixed(4)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  Total Remaining At End of Last Cycle
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {balance.toFixed(4)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default PoolContributerTable;
