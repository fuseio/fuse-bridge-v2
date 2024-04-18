const { getWalletContract } = require("../utils/crossChainHelper")
const { getTxHashLink } = require("../utils/print")

module.exports = async function (taskArgs, hre) {
	const originalNetworks = taskArgs.originalNetworks.split(",")
	const wrappedNetwork = taskArgs.wrappedNetwork

	const wrappedTokenBridge = await getWalletContract(hre, wrappedNetwork, "WrappedTokenBridgeUpgradable")

	for (let i = 0; i < originalNetworks.length; i++) {
		const originalNetwork = originalNetworks[i]
		const originalTokenBridge = await getWalletContract(hre, originalNetwork, "OriginalTokenBridgeUpgradable")
		
		const originalProvider = originalTokenBridge.runner.provider		
		const { gasPrice } = await originalProvider.getFeeData()
		const increasedGasPrice = gasPrice * 5n / 4n

		console.log(`\n[${originalNetwork}] OriginalTokenBridge at ${originalTokenBridge.target} calling setUseCustomAdapterParams(true)`)
		let tx = await originalTokenBridge.setUseCustomAdapterParams(true, {gasPrice: increasedGasPrice})
		console.log(getTxHashLink(originalNetwork, tx.hash))
	}

	console.log(`[${wrappedNetwork}] WrappedTokenBridge at ${wrappedTokenBridge.target} calling setUseCustomAdapterParams(true)`)
	tx = await wrappedTokenBridge.setUseCustomAdapterParams(true)
	console.log(getTxHashLink(wrappedNetwork, tx.hash))
}
