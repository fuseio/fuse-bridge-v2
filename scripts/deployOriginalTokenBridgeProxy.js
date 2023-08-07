// scripts/deployOriginalTokenBridgeProxy.js

const { ethers, upgrades } = require("hardhat")

async function main() {
    const Bridge = await ethers.getContractFactory("OriginalTokenBridge")
    const bridge = await upgrades.deployProxy(Bridge, [INITIAL_VALIDATOR_ADDRESS, CONSENSUS, stakedFuse.address, TREASURY, SYSTEM_LIMIT, FEE_BASIS], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log("Bridge deployed to:", await bridge.getAddress())
}

main()
