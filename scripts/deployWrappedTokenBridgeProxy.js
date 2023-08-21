// scripts/deployWrappedTokenBridgeProxy.js

const { ethers, upgrades } = require("hardhat")

async function main() {
    const Bridge = await ethers.getContractFactory("contracts/WrappedTokenBridgeUpgradable.sol:WrappedTokenBridgeUpgradable")
    const bridge = await upgrades.deployProxy(Bridge, ["0x3c2269811836af69497E5F486A85D7316753cf62"], { kind: "uups" })
    console.log("Deploying bridge...")
    await bridge.waitForDeployment()
    console.log("Bridge deployed to:", await bridge.getAddress())
}

main()
