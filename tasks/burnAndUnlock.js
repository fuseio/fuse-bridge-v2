const { getWalletContract } = require("../utils/crossChainHelper")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const signers = await ethers.getSigners()
	const owner = signers[0]
	const originalNetwork = taskArgs.originalNetwork
	const originalTokenChainId = CHAIN_IDS[originalNetwork]
	console.log(taskArgs.decimals)
	console.log(typeof taskArgs.decimals)
	const decimals = parseInt(taskArgs.decimals)
	const amount = ethers.parseUnits(taskArgs.amount, decimals)
	
	const token = taskArgs.token
	// const bridge = await ethers.getContract("WrappedTokenBridgeוUpgradable")
	const bridge = await getWalletContract(hre, hre.network.name, "WrappedTokenBridgeUpgradable")

	const nativeFee = (await bridge.estimateBridgeFee(originalTokenChainId, false, "0x")).nativeFee
	const increasedNativeFee = nativeFee * 5n / 4n // 20% increase
	const callParams = {
		refundAddress: owner.address,
		zroPaymentAddress: ethers.ZeroAddress
	}
	const adapterParams = "0x000100000000000000000000000000000000000000000000000000000000000493e0"
	const unwrapWeth = true
	console.log(`\n[${hre.network.name}] WrappedTokenBridge at ${bridge.target} calling bridge(${token}, ${originalTokenChainId}, ${amount}, ${owner.address}, ${unwrapWeth}, ${JSON.stringify(callParams)}, ${adapterParams})`)
	const tx = await bridge.bridge(token, originalTokenChainId, amount, owner.address, unwrapWeth, callParams, adapterParams, { value: increasedNativeFee })	

	await tx.wait()
	console.log(`Bridged ${tx.hash}`)
}