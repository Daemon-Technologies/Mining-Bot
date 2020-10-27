import { request } from 'umi';
import { getShaValue, kdf } from '@/utils/utils';
import * as crypto from 'crypto';

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
  let result: API.RequestResult = { status: 200 };
  const userAuth = getUserAuth();
  if (!userAuth) {
    result.status = 500;
    return result;
  }
  // parse UserAuth
  const { passwordHash } = userAuth;
  const hashValue = getShaValue(password);
  if (passwordHash !== hashValue) {
    result.status = 402;
    return result;
  }
  // store password in sessionStorage
  sessionStorage.setItem(MiningPassword, password);
  return result;
}

// first time to set your password
export async function setLockPassword(password: string) {
  const hash = getShaValue(password);
  const salt = crypto.randomBytes(64);
  let userAuth: API.UserAuth = { passwordHash: hash, aesSalt: salt };
  // store password hash and salt
  localStorage.setItem(MiningPasswordAuthorization, JSON.stringify(userAuth));
  let result: API.RequestResult = {
    data: userAuth,
    status: 200,
  };
  // store password in sessionStorage
  sessionStorage.setItem(MiningPassword, password);
  return result;
}

// get hash from local storage
export function getUserAuth() {
  const userAuth = localStorage.getItem(MiningPasswordAuthorization);
  if (userAuth === undefined || userAuth === null) {
    return null;
  }
  return JSON.parse(userAuth);
}

export function getPassword() {
  return sessionStorage.getItem(MiningPassword);
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
