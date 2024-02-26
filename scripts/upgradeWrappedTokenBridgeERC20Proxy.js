// scripts/deployOriginalTokenBridgeProxy.js
const { ethers } = require("hardhat")

async function main() {
    const BridgeV2 = await ethers.getContractFactory("contracts/WrappedTokenBridgeERC20Upgradable.sol:WrappedTokenBridgeERC20Upgradable")
    console.log("Deploying bridge...")
    const bridge = await BridgeV2.deploy()
    const tx = await bridge.waitForDeployment()
    console.log(await tx.getAddress())
}

main()
