import { parse } from 'querystring';
import * as bitcoin from 'bitcoinjs-lib';
import * as crypto from 'crypto';
import { getPassword, getUserAuth } from '@/services/login';
import { message } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const { sha256, hexToken, shaSecret, aes256Gcm, aesKeySize } = require('@/services/constants')

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
};

export function coerceAddress(address: string) {
  // TODO now it is testnet
  const { hash } = bitcoin.address.fromBase58Check(address);
  let coercedVersion = bitcoin.networks.testnet.pubKeyHash;
  return bitcoin.address.toBase58Check(hash, coercedVersion);
}

export function getShaValue(data: string) {
  const hmac = crypto.createHmac(sha256, shaSecret);
  return hmac.update(data).digest(hexToken);
}

export function kdf(password: string, salt: string) {
  const key = crypto.pbkdf2Sync(password, salt, 10000, aesKeySize, sha256);
  return key;
}

export function keyGen() {
  const userAuth = getUserAuth();
  if (!userAuth) {
    throw Error("You need to set your lock password first");
  }
  const { aesSalt } = userAuth;
  const password = getPassword();
  if (!password) {
    throw Error("You need to unlock your account first");
  }
  const key = kdf(password, aesSalt.toString('hex'));
  return key;
}

export function aes256Encrypt(data: string, key: Buffer) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(aes256Gcm, key, iv);
    let enc = cipher.update(data, 'utf8', 'base64');
    enc += cipher.final('base64');
    return [enc, iv, cipher.getAuthTag()];
  } catch (error) {
    message.error(error);
  }
  return null;
}

export function aes256Decrypt(data: string, key: Buffer, ivStr: string, authTagStr: string) {
  try {
    const iv = Buffer.from(ivStr, 'hex');
    const authTag = Buffer.from(authTagStr, 'hex');
    const decipher = crypto.createDecipheriv(aes256Gcm, key, iv);
    decipher.setAuthTag(authTag)
    let str = decipher.update(data, 'base64', 'utf8');
    str += decipher.final('utf8');
    return str;
  } catch (error) {
    message.error(error);
  }
  return null;
}

export function getCurrentNetwork(){
  let page = location.pathname.match(/(xenon|krypton)/g)
  if (page)
    return page[0]
  return ""
}

export function getCurrentPage(){
  let page = location.pathname.match(/(publicData|client|wallet)/g)
  if (page)
    return page[0]
  return ""
}

export function switchPage(network: string){
  let cpage = getCurrentPage()
  location.href = location.origin + `/${network}/${cpage}`;
}

export function getNetworkFromStorage(){
  return localStorage.getItem('network')
}