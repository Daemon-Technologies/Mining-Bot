module.exports = {
  // Krypton
  sidecarURLKrypton: 'https://stacks-node-api.krypton.blockstack.org/extended',
  btcFaucetURL: 'https://stacks-node-api.krypton.blockstack.org/extended/v1/faucets/btc?address=',
  stxFaucetURL: 'https://stacks-node-api.krypton.blockstack.org/extended/v1/faucets/stx?address=',
  nodeKryptonURL: "http://krypton.blockstack.org:20443",

  //Xenon
  sidecarURLXenon: 'https://stacks-node-api.xenon.blockstack.org/extended',
  nodeStatusURL: 'https://status.test-blockstack.com',
  nodeXenonURL: 'http://xenon.blockstack.org:20443',

  //Mainnet
  sidecarURLMainnet: 'https://stacks-node-api.stacks.co/extended',
  nodeMainnetURL: 'https://stacks-node-api.stacks.co',

  //Bitcoin endpoint
  bitcoinTestnet3: 'https://api.blockcypher.com/v1/btc/test3',
  bitcoinMainnet: 'https://blockchain.info',

  explorerURL: 'https://testnet-explorer.blockstack.org',
  binanceAPIURL: 'https://api.binance.com/api/v3',
  masterNodeKey: 'master_node_ping',
  miningLocalServer_endpoint: 'http://localhost:5000',
  miningMonitorServer_endpoint: 'http://monitor.stxmining.xyz',
  miningMonitorServer_Mainnet: 'http://47.242.239.96:23456',

  miningNodeListServer_endpoint: 'http://bitcoind-list.stxmining.xyz/nodeList',

  MIN_MINER_BTC_AMOUNT: 0.000011,
  MIN_MINER_BURN_FEE: 11000,

  MIN_FEE_RATE: 50,
  MAX_FEE_RATE: 500,

  // language
  CN: 'zh-CN',

  // password key
  MiningPasswordAuthorization: 'MiningPasswordAuthorization',
  // password value
  MiningPassword: 'MiningPassword',
  // sha algorithm
  sha256: 'sha256',
  sha512: 'sha512',
  shaSecret: 'MiningBot-Client@2020',
  hexToken: 'hex',
  // aes algorithm
  aes256Gcm: 'aes-256-gcm',
  aesKeySize: 32,
  // address type
  btcType: 1,
  stxType: 2,
}
