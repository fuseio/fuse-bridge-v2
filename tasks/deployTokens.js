// const crossChainHelper = require("../utils/crossChainHelper")
const { getWalletContract } = require("../utils/crossChainHelper")

module.exports = async function (taskArgs, hre) {
	await hre.run('compile')
	const wrappedNetwork = hre.network.name
	const { deploy } = deployments
	const { deployer } = await getNamedAccounts()

	const wrappedTokens = taskArgs.wrappedTokens.split(",")
	const wrappedTokenBridge = await getWalletContract(hre, hre.network.name, "WrappedTokenBridgeUpgradable")
	console.log(`\nDeploying Tokens...`)

	for (let j = 0; j < wrappedTokens.length; j++) {
		const wrappedToken = wrappedTokens[j]
		console.log(`\nDeploying WrappedERC20 on ${wrappedNetwork}, args: [${wrappedTokens[j]}]`)
		const token = await deploy(wrappedToken, {
			from: deployer,
			args: [wrappedTokenBridge.target],
			log: true,
			waitConfirmations: 1,
			skipIfAlreadyDeployed: true
		})
		console.log(`\nTokens deployed on ${wrappedNetwork} at ${token.address}`)
	}
}
