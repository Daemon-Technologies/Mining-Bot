import { request } from 'umi';
import { getShaValue } from '@/utils/utils';

const { MiningPasswordAuthorization, MiningPassword } = require('@/services/constants')


export interface LoginParamsType {
  password: string;
}

export interface FirstTimeLoginParams {
  password: string;
  passwordRepeat: string;
}

// lock your account by your password
export async function loginByPassword(password: string) {
  const passwordHash = getPasswordHash();
  const hashValue = getShaValue(password);
  let result: API.RequestResult = { status: 200 };
  if (passwordHash !== hashValue) {
    result.status = 402;
  }
  // store password in sessionStorage
  sessionStorage.setItem(MiningPassword, password);
  return result;
}

// first time to set your password
export async function setLockPassword(password: string) {
  const hash = getShaValue(password);
  localStorage.setItem(MiningPasswordAuthorization, hash);
  let result: API.RequestResult = {
    data: hash,
    status: 200,
  };
  // store password in sessionStorage
  sessionStorage.setItem(MiningPassword, password);
  return result;
}

// get hash from local storage
export function getPasswordHash() {
  return localStorage.getItem(MiningPasswordAuthorization);
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  sessionStorage.removeItem(MiningPassword);
  return request('/api/login/outLogin');
}
