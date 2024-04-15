// run as:
// npx hardhat ./scripts/deployOriginalTokenBridgeProxy.js --network $NETWORK
const { upgrades } = require("hardhat")

const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const REMOTE_CHAIN_IDS = require("../constants/remoteChainIds.json")
const WETHS = require("../constants/weths.json")
const CHAIN_IDS = require("../constants/chainIds.json")

const hre = require("hardhat");

async function main() {
    const wrappedNetwork = process.env.WRAPPED_NETWORK
    const { network } = hre;
    const lzEndpointAddress = LZ_ENDPOINTS[network.name]
	console.log(`[${network.name}] Endpoint Address: ${lzEndpointAddress}`)

	const remoteChainId = wrappedNetwork ? CHAIN_IDS[wrappedNetwork] : REMOTE_CHAIN_IDS[network.name]
	console.log(`[${network.name}] Remote Chain Id: ${remoteChainId}`)

	const weth = WETHS[network.name]
	console.log(`[${network.name}] WETH Address: ${weth}`)

    const Bridge = await ethers.getContractFactory("contracts/bridges/OriginalTokenBridgeUpgradable.sol:OriginalTokenBridgeUpgradable")
    const bridge = await upgrades.deployProxy(Bridge, [lzEndpointAddress, remoteChainId, weth], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log(bridge.deploymentTransaction().hash)
    console.log(`[${network.name}] Bridge deployed to:`, await bridge.getAddress())
}

main()
