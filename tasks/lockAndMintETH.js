const { getWalletContract } = require("../utils/crossChainHelper")
const { getTxHashLink } = require("../utils/print")

module.exports = async function (taskArgs, hre) {
	console.log(`Locking and minting ${taskArgs.amount} ETH...`)
	const signers = await ethers.getSigners()
	const owner = signers[0]
	const amount = ethers.parseEther(taskArgs.amount)

	const bridge = await getWalletContract(hre, hre.network.name, "OriginalTokenBridgeUpgradable")

	const nativeFee = (await bridge.estimateBridgeFee(false, "0x")).nativeFee
	const increasedNativeFee = nativeFee * 5n / 4n // 20% increase
	const callParams = {
		refundAddress: owner.address,
		zroPaymentAddress: ethers.ZeroAddress
	}
	console.log(`Gas price: ${increasedNativeFee}`)
	console.log({ 
		callParams
	})
	// without EIP 1559 (Fuse)
	tx = await bridge.bridgeNative(amount, owner.address, callParams, "0x0001000000000000000000000000000000000000000000000000000000000003d090", { value: amount + increasedNativeFee, gasLimit: 500000 })

	// with EIP 1559 (Spark)
	// tx = await bridge.bridgeNative(amount, owner.address, callParams, "0x0001000000000000000000000000000000000000000000000000000000000003d090", { value: amount + increasedNativeFee, gasLimit: 500000, maxFeePerGas: 20000000000, maxPriorityFeePerGas: 15000000000 })
	await tx.wait()
	console.log(`Bridged ${getTxHashLink(hre.network.name, tx.hash)}`)
}