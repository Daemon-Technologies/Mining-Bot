module.exports = {

  sidecarURL: 'https://stacks-node-api.blockstack.org/extended',
  sidecarURLKrypton: 'https://stacks-node-api.krypton.blockstack.org/extended',
  explorerURL: 'https://testnet-explorer.blockstack.org',
  btcFaucetURL: 'https://stacks-node-api.krypton.blockstack.org/extended/v1/faucets/btc?address=',
  stxFaucetURL: 'https://stacks-node-api.krypton.blockstack.org/extended/v1/faucets/stx?address=',

  binanceAPIURL: 'https://api.binance.com/api/v3',

  nodeKryptonURL: "http://krypton.blockstack.org:20443",

  miningLocalServer_endpoint: 'http://localhost:5000',



  MIN_MINER_BTC_AMOUNT: 0.005,

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
