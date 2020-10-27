import { request } from 'umi';

const { MiningPassword } = require('@/services/constants')

export async function query() {
  return request<API.UserInfo[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.UserInfo>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

export async function queryUserInfo() {
  const password = sessionStorage.getItem(MiningPassword);
  if (!password) {
    throw Error("You need to login first");
  }
  return password;
}

