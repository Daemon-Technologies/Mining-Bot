module.exports = {

  //Xenon
  sidecarURLXenon: 'https://stacks-node-api.xenon.blockstack.org/extended',
  nodeStatusURL: 'https://status.test-blockstack.com',
  nodeXenonURL: 'http://xenon.blockstack.org:20443',

  //Mainnet
  sidecarURLMainnet: 'https://stacks-node-api.stacks.co/extended',
  nodeMainnetURL: 'http://seed-0.mainnet.stacks.co:20443',

  //Bitcoin endpoint
  bitcoinTestnet3: 'https://api.blockcypher.com/v1/btc/test3',
  bitcoinMainnet: 'https://blockchain.info',
  bitcoinMainnet2: 'https://api.blockcypher.com/v1/btc/main',

  explorerURL: 'https://testnet-explorer.blockstack.org',
  binanceAPIURL: 'https://api.binance.com/api/v3',
  masterNodeKey: 'master_node_ping',
  miningLocalServer_endpoint: 'http://localhost:5000',
  miningMonitorServer_endpoint: 'http://monitor.stxmining.xyz',
  miningMonitorServer_Mainnet: 'http://47.242.239.96:8887',

  miningNodeListServer_endpoint: 'http://bitcoind-list.stxmining.xyz/nodeList',

  MIN_MINER_BTC_AMOUNT: 0.0005,
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

  // pooling 
  firstStackingBlock: 668050,

  balanceCoef : 100000000
}
