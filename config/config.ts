// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;


export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Stack Mining Bot',
    locale: true,
    siderWidth: 208,
    logo: '../../header.png'
  },
  locale: {
    // default: 'en-US',
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/publicData',
      name: 'publicData',
      icon: 'LineChartOutlined',
      component: './publicData',
    },
    {
      path: '/wallet',
      name: 'wallet',
      icon: 'TeamOutlined',
      component: './wallet',
    },
    {
      path: '/client',
      name: 'client',
      icon: 'FundProjectionScreenOutlined',
      component: './client',
    },
    {
      path: '/sysConf',
      name: 'sysConf',
      icon: 'UnorderedListOutlined',
      component: './sysConf',
    },
    {
      path: '/',
      redirect: `/publicData`,
    },

    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
