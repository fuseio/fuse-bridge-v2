const { getWalletContract } = require("../utils/crossChainHelper")
const { getTxHashLink } = require("../utils/print")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const originalNetworks = taskArgs.originalNetworks.split(",")
	const wrappedNetwork = taskArgs.wrappedNetwork

	const wrappedTokenBridge = await getWalletContract(hre, wrappedNetwork, "WrappedTokenBridgeUpgradable")
	const wrappedTokenChainId = CHAIN_IDS[wrappedNetwork]

	for (let i = 0; i < originalNetworks.length; i++) {
		const originalTokenChainId = CHAIN_IDS[originalNetworks[i]]
		const originalTokenBridge = await getWalletContract(hre, originalNetworks[i], "OriginalTokenBridgeUpgradable")
		const originalProvider = originalTokenBridge.runner.provider
		
		const { gasPrice } = await originalProvider.getFeeData()
		const increasedGasPrice = gasPrice * 5n / 4n

		console.log(`\n[${originalNetworks[i]}] OriginalTokenBridge at ${originalTokenBridge.target} calling setTrustedRemoteAddress(${wrappedTokenChainId}, ${wrappedTokenBridge.target})`)
		let tx = await originalTokenBridge.setTrustedRemoteAddress(wrappedTokenChainId, wrappedTokenBridge.target, {gasPrice: increasedGasPrice})
		console.log(getTxHashLink(originalNetworks[i], tx.hash))
		
		console.log(`[${wrappedNetwork}] WrappedTokenBridge at ${wrappedTokenBridge.target} calling setTrustedRemoteAddress(${originalTokenChainId}, ${originalTokenBridge.target})`)
		tx = await wrappedTokenBridge.setTrustedRemoteAddress(originalTokenChainId, originalTokenBridge.target)
		console.log(getTxHashLink(wrappedNetwork, tx.hash))
	}
}
