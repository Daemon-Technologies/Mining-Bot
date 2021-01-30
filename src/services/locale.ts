import { getLocale } from "umi";
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import { Locale } from "antd/lib/locale-provider";

const { CN } = require('@/services/constants');

export function showMessage(cnMes: string, enMes: string): string {
    if (getLocale() === CN) {
        return cnMes;
    }
    return enMes;
}

export function switchConfigProviderLocale(): Locale {
    if (getLocale() === CN) {
        return zhCN;
    }
    return enUS;
}