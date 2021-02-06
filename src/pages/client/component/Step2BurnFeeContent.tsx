import { showMessage } from '@/services/locale';
import { Card, Col, InputNumber, Row, Slider, Switch } from 'antd';
import React from 'react';

const { MIN_MINER_BURN_FEE, MIN_FEE_RATE, MAX_FEE_RATE } = require('@/services/constants');

export const renderFeeInfo = (props: { inputBurnFee: number; setInputBurnFee: Function; inputFeeRate: number; setInputFeeRate: Function; setDebugMode: Function; }) => {
    const {
        inputBurnFee, setInputBurnFee,
        inputFeeRate, setInputFeeRate,
        setDebugMode,
    } = props;

    const onChangeBurnFeeInput = (value: any) => {
        if (isNaN(value)) {
            return;
        }
        setInputBurnFee(value);
    }

    const onChangeFeeRateInput = (value: any) => {
        if (isNaN(value)) {
            return;
        }
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
            Based on burn_fee: {inputBurnFee} and fee_rate: {inputFeeRate}
            <br />
            {showMessage('是否开启Debug模式:  ', 'Debug Mode:  ')}<Switch onChange={onChangeDebugMode} checkedChildren={showMessage('开启', 'On')} unCheckedChildren={showMessage('关闭', 'Off')} />
        </>
    )
};