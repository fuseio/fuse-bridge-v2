// scripts/deployWrappedTokenBridgeProxy.js

const { ethers, upgrades } = require("hardhat")

const ENDPOINT_ADDRESS = "" // <-- Replace with the address of the endpoint you want to use

// npx hardhat run  ./scripts/deployWrappedERC20BurnableMintableBridgeProxy.js --network $NETWORK

async function main() {
    const Bridge = await ethers.getContractFactory("contracts/bridges/WrappedERC20BurnableMintableBridgeUpgradable.sol:WrappedERC20BurnableMintableBridgeUpgradable")
    const bridge = await upgrades.deployProxy(Bridge, [ENDPOINT_ADDRESS], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log("Bridge deployed to:", await bridge.getAddress())
}

main()
