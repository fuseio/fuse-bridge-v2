// scripts/deployWrappedTokenBridgeProxy.js

const { ethers, upgrades } = require("hardhat")

async function main() {
    const Bridge = await ethers.getContractFactory("WrappedTokenBridge")
    const bridge = await upgrades.deployProxy(Bridge, ["0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4"], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log("Bridge deployed to:", await bridge.getAddress())
}

main()
