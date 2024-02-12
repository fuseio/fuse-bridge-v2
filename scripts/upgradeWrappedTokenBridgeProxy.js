// scripts/deployOriginalTokenBridgeProxy.js
const { ethers, upgrades } = require("hardhat")

const OLD_PROXY_ADDRESS = "" // <-- Replace with the address of the proxy you want to upgrade

async function main() {
    const BridgeV2 = await ethers.getContractFactory("contracts/WrappedTokenBridgeUpgradable.sol:WrappedTokenBridgeUpgradable")
    console.log("Deploying bridge...")
    const bridge = await BridgeV2.deploy()
    const tx = await bridge.waitForDeployment()
    console.log(await tx.getAddress())
}

main()
