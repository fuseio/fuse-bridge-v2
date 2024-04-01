const { getWalletContract } = require("../utils/crossChainHelper")
const { getTxHashLink } = require("../utils/print")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const originalNetworks = taskArgs.originalNetworks.split(",")
	const wrappedNetwork = taskArgs.wrappedNetwork
	console.log(wrappedNetwork)
	const wrappedTokenChainId = CHAIN_IDS[wrappedNetwork]
	const wrappedTokenBridge = await getWalletContract(hre, wrappedNetwork, "WrappedTokenBridgeUpgradable")

	for (let i = 0; i < originalNetworks.length; i++) {
		const originalNetwork = originalNetworks[i]
		const originalTokenChainId = CHAIN_IDS[originalNetwork]
		console.log(originalTokenChainId)
		const originalTokenBridge = await getWalletContract(hre, originalNetwork, "OriginalTokenBridgeUpgradable")
		
		const originalProvider = originalTokenBridge.runner.provider		
		const { gasPrice } = await originalProvider.getFeeData()
		const increasedGasPrice = gasPrice * 5n / 4n

		console.log(`\n[${originalNetwork}] OriginalTokenBridge at ${originalTokenBridge.target} calling setMinDstGas(${wrappedTokenChainId}, 0, 250000)`)
		let tx = await originalTokenBridge.setMinDstGas(wrappedTokenChainId, 0, 250000, {gasPrice: increasedGasPrice})
		console.log(getTxHashLink(originalNetwork, tx.hash))
		
		console.log(`[${wrappedNetwork}] WrappedTokenBridge at ${wrappedTokenBridge.target} calling setUseCustomAdapterParams(true)`)
		tx = await wrappedTokenBridge.setMinDstGas(originalTokenChainId, 1, 300000)
		console.log(getTxHashLink(wrappedNetwork, tx.hash))
	}
}
