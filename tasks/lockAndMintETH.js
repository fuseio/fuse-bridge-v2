const { getWalletContract } = require("../utils/crossChainHelper")

module.exports = async function (taskArgs, hre) {
	console.log(`Locking and minting ${taskArgs.amount} ETH...`)
	const signers = await ethers.getSigners()
	const owner = signers[0]
	const amount = ethers.parseEther(taskArgs.amount)
	// const bridge = await ethers.getContract("OriginalTokenBridgeUpgradable")
	console.log(hre.network.name)
	const bridge = await getWalletContract(hre, hre.network.name, "OriginalTokenBridgeUpgradable")

	// const nativeFee = (await bridge.estimateBridgeFee(false, "0x")).nativeFee
	// const increasedNativeFee = nativeFee.mul(5).div(4) // 20% increase
	const callParams = {
		refundAddress: owner.address,
		zroPaymentAddress: ethers.ZeroAddress
	}
	// console.log(`Gas price: ${increasedNativeFee}`)
	console.log({ 
		callParams
	})
	tx = await bridge.bridgeNative(amount, owner.address, callParams, "97be339d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000218711a00", { value: amount + amount })
	await tx.wait()
	console.log(`Bridged ${tx.hash}`)
}