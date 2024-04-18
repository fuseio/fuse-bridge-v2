const blockExplorerApis = require("../constants/blockExplorerApi")

const getTxHashLink = (network, txHash) => {
  const api = blockExplorerApis[network]
  const baseUrl = api.replaceAll(/api[.]?/g, '')
  return `${baseUrl}tx/${txHash}`
}

module.exports = {
  getTxHashLink
}