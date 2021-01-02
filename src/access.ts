// src/access.ts
import {getNetworkFromStorage} from '@/utils/utils'

export default function access(initialState?: { currentUser?: API.UserInfo | undefined }) {
  const { currentUser } = initialState || {};
  let networkType = getNetworkFromStorage()
  console.log(networkType)
  return {
    useKrypton: networkType==="Krypton",
    useXenon: networkType==="Xenon"
  };
}
