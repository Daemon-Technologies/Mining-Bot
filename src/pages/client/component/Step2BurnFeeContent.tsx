import { SpendInfo } from '@/services/client/data';
import { showMessage } from '@/services/locale';
import { Account } from '@/services/wallet/data';
import { Card, Col, Divider, InputNumber, Row, Slider, Switch } from 'antd';
import React from 'react';

const { MIN_MINER_BURN_FEE, MIN_FEE_RATE, MAX_FEE_RATE } = require('@/services/constants');

export const renderFeeInfo = (props: { inputBurnFee: number; setInputBurnFee: Function; inputFeeRate: number; setInputFeeRate: Function; setDebugMode: Function; accountSelected: Account | undefined; btcPrice: number; spendInfo: SpendInfo | undefined; setSpendInfo: Function; }) => {
    const {
        inputBurnFee, setInputBurnFee,
        inputFeeRate, setInputFeeRate,
        setDebugMode, accountSelected,
        spendInfo, setSpendInfo,
        btcPrice,
    } = props;

    const onChangeBurnFeeInput = (value: any) => {
        if (isNaN(value)) {
            return;
        }
        const per_tx = (350 * inputFeeRate) / 100000000 * btcPrice + value / 100000000 * btcPrice;
        const one_hour_spend = 7 * per_tx;
        setSpendInfo({ per_tx: parseInt(per_tx.toString()), one_hour_spend: parseInt(one_hour_spend.toString()), register_spend: 0 });
        setInputBurnFee(value);
    }

    const onChangeFeeRateInput = (value: any) => {
        if (isNaN(value)) {
            return;
        }
        // re-calculate spend info
        const per_tx = (350 * value) / 100000000 * btcPrice + inputBurnFee / 100000000 * btcPrice;
        const one_hour_spend = 7 * per_tx;
        setSpendInfo({ per_tx: parseInt(per_tx.toString()), one_hour_spend: parseInt(one_hour_spend.toString()), register_spend: 0 });
        setInputFeeRate(value);
    }

    const onChangeDebugMode = (value: any) => {
        if (isNaN(value)) {
            return;
        }
        setDebugMode(value);
    }

    return (
        <>
            <Card title={(showMessage("设置燃烧量", "Set Burn Fee"))}>
                <Row style={{ margin: '10px 5px' }}>
                    <Col span={12}>
                        <Slider
                            min={MIN_MINER_BURN_FEE}
                            max={1000000}
                            onChange={onChangeBurnFeeInput}
                            value={typeof inputBurnFee === 'number' ? inputBurnFee : 0}
                            step={200}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            min={MIN_MINER_BURN_FEE}
                            max={1000000}
                            style={{ margin: '0 16px' }}
                            step={200}
                            value={inputBurnFee}
                            onChange={onChangeBurnFeeInput}
                        />
                    </Col>
                </Row>
            </Card>
            <Card title={(showMessage("设置手续费率", "Set Satoshi Per Bytes"))}>
                <Row style={{ margin: '10px 5px' }}>
                    <Col span={12}>
                        <Slider
                            min={MIN_FEE_RATE}
                            max={MAX_FEE_RATE}
                            onChange={onChangeFeeRateInput}
                            value={typeof inputFeeRate === 'number' ? inputFeeRate : 0}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            min={MIN_FEE_RATE}
                            max={MAX_FEE_RATE}
                            style={{ margin: '0 16px' }}
                            value={inputFeeRate}
                            onChange={onChangeFeeRateInput}
                        />
                    </Col>
                </Row>
            </Card>
            <br />
            {showMessage('是否开启Debug模式:  ', 'Debug Mode:  ')}<Switch onChange={onChangeDebugMode} checkedChildren={showMessage('开启', 'On')} unCheckedChildren={showMessage('关闭', 'Off')} />
            <Divider type="horizontal" />
            <span style={{ color: 'red' }}>
                {showMessage(`基于这个设计，你平均每笔交易大约花费${spendInfo?.per_tx}$，平均每小时花费为${spendInfo?.one_hour_spend}$`,
                    `Based on this setting, you will spend almost ${spendInfo?.per_tx}$ per transaction, almost ${spendInfo?.one_hour_spend}$ per hour.`)}
            </span>
        </>
    )
};