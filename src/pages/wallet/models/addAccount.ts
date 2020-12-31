/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: NewAccount) => {
    const hide = message.loading(getLocale() === CN ? '添加中...' : 'Adding');
    try {
      const result = await addAccount({ ...fields });
      if (result.status !== 200) {
        throw Error('添加失败');
      }
      hide();
      message.success(getLocale() === CN ? '添加成功!' : 'Adding successfully!');
      return true;
    } catch (error) {
      hide();
      message.error(getLocale() === CN ? '添加失败!' : 'Adding fail!');
      return false;
    }
};