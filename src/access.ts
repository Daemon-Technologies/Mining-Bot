// src/access.ts
import { getNetworkFromStorage } from '@/utils/utils'

export default function access(initialState?: { currentUser?: API.UserInfo | undefined }) {
  let networkType = getNetworkFromStorage()
  console.log(networkType)
  return {
    useKrypton: networkType === "Krypton",
    useXenon: networkType === "Xenon",
    hide: false,
  };
}
