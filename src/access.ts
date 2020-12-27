// src/access.ts
import {getNetworkFromStorage} from '@/utils/utils'

export default function access(initialState?: { currentUser?: API.UserInfo | undefined }) {
  const { currentUser } = initialState || {};
  let networkType = getNetworkFromStorage()
  return {
    useKrypton: networkType==="Krypton",
    useXenon: networkType==="Xenon"
  };
}
