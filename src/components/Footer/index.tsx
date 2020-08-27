import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 BlockStack"
    links={[
      {
        key: 'Mining Bot',
        title: 'Mining Bot',
        href: '',
        blankTarget: true,
      },
    ]}
  />
);
