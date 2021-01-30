import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import Form from 'antd/es/form';
import TextArea from 'antd/lib/input/TextArea';
import { NewAccount } from '@/services/wallet/data';
import { useModel } from 'umi';
import { showMessage } from "@/services/locale";
const { btcType, stxType } = require('@/services/constants');

export interface FormValueType extends Partial<NewAccount> {
  mnemonic?: string;
  type?: 1 | 2;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const AddAccountForm: React.FC<{}> = () => {
  const [formVals, setFormVals] = useState<FormValueType>({});
  const { handleAddNewAccount, getVisible, handleModalVisible } = useModel('wallet.addAccount');
  const { actionRef } = useModel('wallet.wallet');
  const [form] = Form.useForm();

  const handleCancel = async () => {
    form.resetFields();
    handleModalVisible(false)
  }

  const handleFormData = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    let success = await handleAddNewAccount({ ...formVals, ...fieldsValue });
    form.resetFields();
    
    if (success) {
      handleModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
    
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="mnemonic"
          label={showMessage('助记词' , "Mnemonic")}
          rules={[{ required: true, message: showMessage('请输入你的助记词！', 'Please input your mnemonic!') }]}
        >
          <TextArea rows={5} placeholder={showMessage('请输入你24个单词的助记词', 'Please input your 24 words mnemonic.')} />
        </FormItem>
        <FormItem
          name="type"
          label={showMessage('地址类型', 'Type')}
          rules={[{ required: true, message: showMessage('请选择你的地址类型', 'Please select your address type!') }]}
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
        <Button onClick={() => handleCancel()}>{showMessage('取消','Cancel')}</Button>
        <Button type="primary" onClick={() => handleFormData()}>
          {showMessage('创建', 'Submit')}
        </Button>
      </>
    )
  }

  return (
    <Modal
      destroyOnClose
      title={showMessage('新建账户' , 'new account')}
      visible={getVisible()}
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

export default AddAccountForm;
