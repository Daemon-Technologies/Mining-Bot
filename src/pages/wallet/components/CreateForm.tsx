import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import Form from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import { NewAccount } from '@/services/wallet/data';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValueType) => void;
}

export interface FormValueType extends Partial<NewAccount> {
  mnemonic?: string;
  password?: string;
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

  const handleAddNewAccount = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleAdd({ ...formVals, ...fieldsValue })
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="mnemonic"
          label="Mnemonic"
          rules={[{ required: true, message: 'Please type your mnemonic!' }]}
        >
          <TextArea rows={3} placeholder="Please type your 24 words." />
        </FormItem>
        <FormItem
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please type your password!' }]}
        >
          <Input.Password placeholder="input password" />
        </FormItem>
      </>
    )
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="primary" onClick={() => handleAddNewAccount()}>
          Submit!
        </Button>
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title="new account"
      visible={modalVisible}
      onCancel={() => onCancel()}
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
