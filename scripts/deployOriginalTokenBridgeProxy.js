// scripts/deployOriginalTokenBridgeProxy.js
const { ethers, upgrades } = require("hardhat")

async function main() {
    const Bridge = await ethers.getContractFactory("contracts/OriginalTokenBridge.sol:OriginalTokenBridge")
    const bridge = await upgrades.deployProxy(Bridge, ["0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4", 145, "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629"], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log("Bridge deployed to:", await bridge.getAddress())
}

main()
