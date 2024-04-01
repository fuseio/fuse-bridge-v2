const blockExplorerApis = require("../constants/blockExplorerApi")

const getTxHashLink = (network, txHash) => {
  const api = blockExplorerApis[network]
  const baseUrl = api.substring(0, api.lastIndexOf('/api'))
  return `${baseUrl}/tx/${txHash}`
}

module.exports = {
  getTxHashLink
}