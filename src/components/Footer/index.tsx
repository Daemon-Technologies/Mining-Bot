import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { getLanguage } from '@ant-design/pro-layout/lib/locales';

const { CN } = require('@/services/constants');

export default () => (
  <DefaultFooter
    copyright='2020 BlockStack'
    links={[
      {
        key: getLanguage() === CN ? '挖矿机器人' : 'Mining Bot',
        title: getLanguage() === CN ? '挖矿机器人' : 'Mining Bot',
        href: '',
        blankTarget: true,
      },
    ]}
  />
);
