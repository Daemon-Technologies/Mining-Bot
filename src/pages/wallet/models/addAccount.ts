import { showMessage } from "@/services/locale";
import { message } from "antd";
import { useState } from "react";
import { addAccount } from '@/services/wallet/account'
import { NewAccount } from '@/services/wallet/data'


export default () => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  /**
   * 添加节点
   * @param fields
   */
  const handleAddNewAccount = async (fields: NewAccount) => {
    const hide = message.loading(showMessage('添加中...', 'Adding'));
    try {
      const result = await addAccount({ ...fields });
      if (result.status !== 200) {
        throw Error('添加失败');
      }
      hide();
      message.success(showMessage('添加成功!','Adding successfully!'));
      return true;
    } catch (error) {
      hide();
      message.error(showMessage('添加失败!', 'Adding fail!'));
      return false;
    }
  };


  const getVisible = () => {
      return modalVisible
  }

  const handleModalVisible = (visible:boolean) => {
    setModalVisible(visible)
}

  return {
    handleAddNewAccount,
    getVisible,
    handleModalVisible
  }
}