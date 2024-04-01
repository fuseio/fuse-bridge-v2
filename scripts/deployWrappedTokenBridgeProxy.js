// run as:
// BRIDGE_TYPE=erc20 npx hardhat ./scripts/deployWrappedTokenBridgeProxy.js --network $NETWORK

const { ethers, upgrades } = require("hardhat")

const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

const hre = require("hardhat");
const process = require("process")


const getBridgeContract = (bridgeType) => {
    switch (bridgeType) {
        case "erc20":
            return ethers.getContractFactory("contracts/bridges/WrappedTokenBridgeUpgradable.sol:WrappedTokenBridgeUpgradable")
        case "erc20-burnable":
            return ethers.getContractFactory("contracts/bridges/WrappedERC20BurnableMintableBridgeUpgradable.sol:WrappedERC20BurnableMintableBridgeUpgradable")
        case "burnable-mintable":
            return ethers.getContractFactory("contracts/bridges/WrappedERC20BurnableMintableBridgeUpgradable.sol:WrappedERC20BurnableMintableBridgeUpgradable")
        default:
            throw new Error(`Unknown bridge type: ${bridgeType}`)
    }
}
async function main() {
    const bridgeType = process.env.BRIDGE_TYPE
    console.log(`Deploying bridge of type ${bridgeType}...`)

    const { network } = hre;
    const lzEndpointAddress = LZ_ENDPOINTS[network.name]
	console.log(`[${network.name}] Endpoint Address: ${lzEndpointAddress}`)
    
    const Bridge = await getBridgeContract(bridgeType)
    const bridge = await upgrades.deployProxy(Bridge, [lzEndpointAddress], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log(bridge.deploymentTransaction().hash)
    console.log(`[${network.name}] Bridge deployed to:`, await bridge.getAddress())
}

main()
