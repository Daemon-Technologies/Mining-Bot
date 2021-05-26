import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';

import { switchConfigProviderLocale } from '@/services/locale';

const TableList: React.FC<{}> = () => {

  return (
    <PageContainer>
      <ConfigProvider
        locale={switchConfigProviderLocale()}
      >
      <div>joinPool</div>
      </ConfigProvider>
    </PageContainer >
  );
};

export default TableList;
