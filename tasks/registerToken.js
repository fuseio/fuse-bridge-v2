const { getWalletContract } = require("../utils/crossChainHelper")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const originalNetwork = taskArgs.originalNetwork
	const originalTokenChainId = CHAIN_IDS[originalNetwork]
	const originalTokenBridge = await getWalletContract(hre, originalNetwork, "OriginalTokenBridgeUpgradable")	

	const originalProvider = originalTokenBridge.runner.provider		
	const { gasPrice } = await originalProvider.getFeeData()
	const increasedGasPrice = gasPrice * 5n / 4n


	const wrappedNetwork = taskArgs.wrappedNetwork
	const wrappedTokenBridge = await getWalletContract(hre, wrappedNetwork, "WrappedTokenBridgeUpgradable")

	console.log(`\n[${originalNetwork}] OriginalTokenBridge at ${originalTokenBridge.target} calling registerToken(${taskArgs.originalToken})`)
	await originalTokenBridge.registerToken(taskArgs.originalToken, 18, {gasPrice: increasedGasPrice})

	console.log(`\n[${wrappedNetwork}] WrappedTokenBridge at ${wrappedTokenBridge.target} calling registerToken(${taskArgs.wrappedToken}, ${originalTokenChainId}, ${taskArgs.originalToken})`)
	await wrappedTokenBridge.registerToken(taskArgs.wrappedToken, originalTokenChainId, taskArgs.originalToken)	
}

// npx hardhat registerToken --original-network spark --wrapped-network bsc-testnet --original-token 0x149Dc53F280f654FEc99294944A81856970bcc93 --wrapped-token 0x7E97802Db6B94E0450AD04217fc84c48DcD79F38