import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig, useModel } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import { queryUserInfo } from './services/user';
import {getNetworkFromStorage} from '@/utils/utils'

export async function getInitialState(): Promise<{
  currentUser?: API.UserInfo;
  settings?: LayoutSettings;
}> {
  // if it is *login page*, do not execute
  if (history.location.pathname !== '/user/login') {
    try {
      let password = await queryUserInfo();
      return {
        currentUser: { password: password },
        settings: defaultSettings,
      };
    } catch (error) {
      history.push('/user/login');
    }
  }

  let networkType = getNetworkFromStorage()
  if (networkType === null){
    localStorage.setItem('network', 'Krypton')
  }

  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.UserInfo };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // if not login，redirect to *login*
      // if the user is the first time to login our miningbot-client, let him set the password
      // if not the first time, just redirect to unlock page
      if (!initialState?.currentUser?.password && history.location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    /*
    notification.error({
      message: `Request Error ${status}: ${url}`,
      description: errorText,
    });
    */
  }
/*
  if (!response) {
    notification.error({
      description: 'Network Error, Cannot Connect to The Server',
      message: 'Network Error',
    });
  }
*/
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
