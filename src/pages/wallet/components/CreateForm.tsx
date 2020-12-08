import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import Form from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import { NewAccount } from '@/services/wallet/data';

const { btcType, stxType } = require('@/services/constants');

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
          label="Mnemonic"
          rules={[{ required: true, message: 'Please input your mnemonic!' }]}
        >
          <TextArea rows={5} placeholder="Please input your 24 words mnemonic." />
        </FormItem>
        <FormItem
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select your address type!' }]}
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
        <Button onClick={() => handleCancel()}>Cancel</Button>
        <Button type="primary" onClick={() => handleAddNewAccount()}>
          Submit
        </Button>
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title="new account"
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
