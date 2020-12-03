import { useState, useCallback } from 'react'
export default function useNetworkModel() {
  const [network, setNetwork] = useState("Krypton")
  const switchNetwork = useCallback((t) => {
    setNetwork(t)
  }, [])
  return {
    network,
    switchNetwork
  }
}