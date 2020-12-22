import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import Form from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import { NewAccount } from '@/services/wallet/data';
import { getLocale } from 'umi';

const { btcType, stxType, CN } = require('@/services/constants');

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValueType) => void;
}

export interface FormValueType extends Partial<NewAccount> {
  mnemonic?: string;
  type?: 1 | 2;
}

const FormItem = Form.Item;

export interface CreateFormState {
  formVals: FormValueType;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({});
  const { modalVisible, onCancel, onSubmit: handleAdd } = props;

  const [form] = Form.useForm();

  const handleCancel = async () => {
    form.resetFields();
    onCancel();
  }

  const handleAddNewAccount = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleAdd({ ...formVals, ...fieldsValue });
    form.resetFields();
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="mnemonic"
          label={getLocale() === CN ? '助记词' : "Mnemonic"}
          rules={[{ required: true, message: getLocale() === CN ? '请输入你的助记词！' : 'Please input your mnemonic!' }]}
        >
          <TextArea rows={5} placeholder={getLocale() === CN ? '请输入你24个单词的助记词' : 'Please input your 24 words mnemonic.'} />
        </FormItem>
        <FormItem
          name="type"
          label={getLocale() === CN ? '地址类型' : 'Type'}
          rules={[{ required: true, message: getLocale() === CN ? '请选择你的地址类型' : 'Please select your address type!' }]}
        >
          <Select>
            <Select.Option value={btcType}>BTC</Select.Option>
            <Select.Option value={stxType}>STX</Select.Option>
          </Select>
        </FormItem>
      </>
    )
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleCancel()}>{getLocale() === CN ? '取消' : 'Cancel'}</Button>
        <Button type="primary" onClick={() => handleAddNewAccount()}>
          {getLocale() === CN ? '创建' : 'Submit'}
        </Button>
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title={getLocale() === CN ? '新建账户' : 'new account'}
      visible={modalVisible}
      onCancel={() => handleCancel()}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
