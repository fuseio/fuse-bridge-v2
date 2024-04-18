const { getWalletContract } = require("../utils/crossChainHelper")
const { getTxHashLink } = require("../utils/print")
const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
	const signers = await ethers.getSigners()
	const owner = signers[0]
	const originalNetwork = taskArgs.originalNetwork
	const originalTokenChainId = CHAIN_IDS[originalNetwork]
	const network = hre.network.name
	const decimals = parseInt(taskArgs.decimals)
	const amount = ethers.parseUnits(taskArgs.amount, decimals)

	const token = await hre.ethers.getContractAt(["function approve(address,uint256) public returns (bool)"], taskArgs.token);
	const bridge = await getWalletContract(hre, hre.network.name, "WrappedTokenBridgeUpgradable")

	const { gasPrice } = await ethers.provider.getFeeData()
	const increasedGasPrice = gasPrice * 5n / 4n // 20% increase
	let tx = await token.approve(bridge.target, amount, { gasPrice: increasedGasPrice })
	await tx.wait()
	console.log(`Approved ${tx.hash}`)


	const nativeFee = (await bridge.estimateBridgeFee(originalTokenChainId, false, "0x")).nativeFee
	const increasedNativeFee = nativeFee * 5n / 4n // 20% increase

	const callParams = {
		refundAddress: owner.address,
		zroPaymentAddress: ethers.ZeroAddress
	}
	const adapterParams = "0x000100000000000000000000000000000000000000000000000000000000000493e0"
	const unwrapWeth = true
	console.log(`\n[${network}] WrappedTokenBridge at ${bridge.target} calling bridge(${token}, ${originalTokenChainId}, ${amount}, ${owner.address}, ${unwrapWeth}, ${JSON.stringify(callParams)}, ${adapterParams})`)
	tx = await bridge.bridge(token, originalTokenChainId, amount, owner.address, unwrapWeth, callParams, adapterParams, { value: increasedNativeFee })	

	await tx.wait()
	console.log(`Bridged ${getTxHashLink(network,tx.hash)}`)
}