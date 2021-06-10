import React, { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Select,
  Switch,
} from "antd";

import { queryAccount } from "@/services/wallet/account";
import { Account } from "@/services/wallet/data";
import { showMessage, switchConfigProviderLocale } from "@/services/locale";
import FormItem from "antd/lib/form/FormItem";
import { FormattedMessage } from "react-intl";
import PoolContributerTable from "./component/PoolContributerTable";
export interface FormValueType {
  poolBtcAddress: string;
}

const TableList: React.FC<{}> = () => {
  const { Option } = Select;
  const [formVals, setFormVals] = useState<FormValueType>({
    poolBtcAddress: localStorage.getItem("pooledBtcAddress") ?? "",
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);

  const onSubmit = async () => {
    const fieldsValue: FormValueType = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    localStorage.setItem("pooledBtcAddress", fieldsValue.poolBtcAddress);
  };

  const [isPooling, setIsPooling] = useState<boolean>(
    localStorage.getItem("isPooling") === "true" ?? false
  );

  useEffect(() => {
    queryAccount(1).then(({ data }) => {
      setAccounts(data);
      setLoadingAccounts(false);
    });
  }, []);

  const renderForm = () => {
    return (
      <>
        <Divider />
        <Card bordered={false} title={showMessage("TODO", "Pool Config")}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ poolBtcAddress: formVals.poolBtcAddress }}
          >
            <FormItem
              name="poolBtcAddress"
              label={showMessage("TODO", "Pool BTC Address")}
              //TODO: validate btc address
              rules={[
                {
                  required: true,
                  message: showMessage(
                    "TODO",
                    "Pooled BTC Address is Required"
                  ),
                },
              ]}
            >
              <Select loading={loadingAccounts}>
                {accounts.map((account: Account) => {
                  return (
                    <Option
                      value={account.address}
                      key={account.address}
                    >{`${account.address} (${account.balance} BTC)`}</Option>
                  );
                })}
              </Select>
            </FormItem>
            <FormItem>
              <Button onClick={() => onSubmit()} type="primary">
                {showMessage("TODO", "Save")}
              </Button>
            </FormItem>
          </Form>
        </Card>
      </>
    );
  };

  const [form] = Form.useForm();
  return (
    <PageContainer>
      <ConfigProvider locale={switchConfigProviderLocale()}>
        <Card bordered={false} title={showMessage("TODO", "Manage Pool")}>
          <Switch
            style={{ marginRight: "5px" }}
            checked={isPooling}
            onChange={() => {
              setIsPooling(!isPooling);
              localStorage.setItem("isPooling", (!isPooling).toString());
            }}
          />
          {isPooling
            ? showMessage("TODO", "Pooling is On")
            : showMessage("TODO", "Pooling is Off")}
        </Card>
        {isPooling && renderForm()}
        {isPooling && <Divider />}
        {isPooling && <PoolContributerTable />}
      </ConfigProvider>
    </PageContainer>
  );
};

export default TableList;
