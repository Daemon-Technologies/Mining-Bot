import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getCycleBlocks,
  getCycleForBlock,
  getPoolContributors,
  PoolContributerInfoState,
  LocalPoolContributors,
  getLocalPoolContributorInfo,
  setLocalPoolContributorInfo,
  getBalanceAtBlock,
  getBalance,
  setLocalPoolBalances,
  getLocalPoolBalance,
} from "@/services/managePool/managePool";
import { b58ToC32 } from "c32check";
import { useState } from "react";
import { getNetworkFromStorage } from "@/utils/utils";
const { balanceCoef } = require("@/services/constants");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");

// if transaction positive, this was an input / contribution, else output / spent on mining
const getTransactionValue = (
  pooledBtcAddress: string,
  transaction: Tx
): number => {
  let value = 0;
  for (const input of transaction.inputs) {
    if (input.addresses && input.addresses.includes(pooledBtcAddress)) {
      value -= input.output_value;
    }
  }
  for (const output of transaction.outputs) {
    if (output.addresses && output.addresses.includes(pooledBtcAddress)) {
      value += output.value;
    }
  }
  // if this was an output, we also paid the fees
  if (value < 0) {
    value -= transaction.fees;
  }
  return value;
};

// taken from BlockstackNetwork
const coerceAddress = (address: string) => {
  const { hash, version } = bitcoinjs_lib_1.address.fromBase58Check(address);
  const scriptHashes = [
    bitcoinjs_lib_1.networks.bitcoin.scriptHash,
    bitcoinjs_lib_1.networks.testnet.scriptHash,
  ];
  const pubKeyHashes = [
    bitcoinjs_lib_1.networks.bitcoin.pubKeyHash,
    bitcoinjs_lib_1.networks.testnet.pubKeyHash,
  ];
  let coercedVersion;
  if (scriptHashes.indexOf(version) >= 0) {
    coercedVersion = bitcoinjs_lib_1.networks.bitcoin.scriptHash;
  } else if (pubKeyHashes.indexOf(version) >= 0) {
    coercedVersion = bitcoinjs_lib_1.networks.bitcoin.pubKeyHash;
  } else {
    throw new Error(
      `Unrecognized address version number ${version} in ${address}`
    );
  }
  return bitcoinjs_lib_1.address.toBase58Check(hash, coercedVersion);
};

export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async (cycle: number) => {
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
    let res: PoolContributerInfo[] = getLocalPoolContributorInfo();
    let { startBlock, endBlock } = getCycleBlocks(cycle - 1);

    // get highest height from local info
    const highestHeight = Math.max(...res.map((o) => o.blockContribution));
    let currentBalance = 0;

    if (endBlock > highestHeight) {
      let { transactions, balance } = await getPoolContributors(
        highestHeight,
        endBlock
      );

      let txHashes = new Set(res.map((o) => o.transactionHash));
      transactions.map((transaction) => {
        // if we already stored this transaction or its not confirmed yet, skip
        if (txHashes.has(transaction.hash) || transaction.block_height == -1) {
          return;
        }

        let contribution = getTransactionValue(pooledBtcAddress, transaction);
        if (contribution > 0) {
          // sometimes the inputs can have multiple addresses, so we weigh contributions based on each address input
          const totalInputvalue = transaction.inputs.reduce(
            (prev, next) => prev + next.output_value,
            0
          );
          for (const input of transaction.inputs) {
            let weightedContribution =
              contribution * (input.output_value / totalInputvalue);
            let address = input.addresses[0];
            let stxAddress = input.addresses[0];
            // BECH32 not supported
            try {
              switch (getNetworkFromStorage()) {
                case "Xenon": {
                  address = coerceAddress(address);
                  break;
                }
                case "Mainnet":
                  break;
                default:
                  break;
              }
              stxAddress = b58ToC32(address);
            } catch (err) {
              stxAddress = "UNSUPPORTED";
            }
            res.push({
              address: address, // TODO: deal with edge case where input has multiple addresses?
              stxAddress: stxAddress, // b58ToC32(input.addresses[0]),
              contribution: weightedContribution / balanceCoef,
              transactionHash: transaction.hash,
              cycleContribution: getCycleForBlock(transaction.block_height),
              blockContribution: transaction.block_height,
              isContribution: true,
            });
          }
        } else {
          res.push({
            address: "output",
            stxAddress: "output",
            contribution: contribution / balanceCoef,
            transactionHash: transaction.hash,
            cycleContribution: getCycleForBlock(transaction.block_height),
            blockContribution: transaction.block_height,
            isContribution: false,
          });
        }
      });
      currentBalance = balance / balanceCoef;
    } else {
      currentBalance = await getBalance();
    }

    setLocalPoolContributorInfo(res);
    res = res.filter(
      (contribution) =>
        contribution.blockContribution >= startBlock &&
        contribution.blockContribution <= endBlock &&
        contribution.isContribution
    );

    // sometimes API will return 0 tx for address, so only change local pool balance if we have a valid response
    if (currentBalance > 0) {
      setLocalPoolBalances(currentBalance);
    } else {
      currentBalance = getLocalPoolBalance();
    }
    let balanceAtEndOfCycle = getBalanceAtBlock(endBlock);
    console.log("at the end of block", endBlock, "had", balanceAtEndOfCycle);
    return { data: res, success: true };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
