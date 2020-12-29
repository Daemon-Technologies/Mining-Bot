// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import { getNetworkFromStorage } from '../src/utils/utils'

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
      path: '/Krypton/publicData',
      name: 'publicData',
      icon: 'LineChartOutlined',
      component: './publicData',
      access: 'useKrypton'
    },
    {
      path: '/Krypton/wallet',
      name: 'wallet',
      icon: 'TeamOutlined',
      component: './wallet',
      access: 'useKrypton'
    },
    {
      path: '/Krypton/client',
      name: 'client',
      icon: 'FundProjectionScreenOutlined',
      component: './client',
      access: 'useKrypton'
    },
    {
      path: '/Xenon/publicData',
      name: 'publicData',
      icon: 'LineChartOutlined',
      component: './publicData',
      access: 'useXenon'
    },
    {
      path: '/Xenon/wallet',
      name: 'wallet',
      icon: 'TeamOutlined',
      component: './wallet',
      access: 'useXenon'
    },
    {
      path: '/Xenon/client',
      name: 'client',
      icon: 'FundProjectionScreenOutlined',
      component: './client',
      access: 'useXenon'
    },
    {
      path: '/',
      redirect: `/Krypton/publicData`,
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
