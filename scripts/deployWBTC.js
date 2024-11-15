// run as:
// npx hardhat ./scripts/deployWBTC.js --network $NETWORK
const { hardhat } = require("hardhat")
const BRIDGES = require("../constants/bridges.json")
const { getTxHashLink } = require("../utils/print")
const hre = require("hardhat")

async function main() {
    try {
        const { network } = hre
        const wrappedBridgeAddress = BRIDGES[network.name].WrappedTokenBridgeUpgradable
        console.log(`[${network.name}] Wrapped Bridge Address: ${wrappedBridgeAddress}`)

        const Token = await ethers.getContractFactory("contracts/wrappedTokens/WBTC.sol:WBTC")
        const token = await Token.deploy(wrappedBridgeAddress)
        console.log("Deploying token...")
        await token.waitForDeployment()
        console.log(getTxHashLink(network.name, token.deploymentTransaction().hash))
        console.log(`[${network.name}] Bridge deployed to:`, await token.getAddress())
    } catch (error) {
        console.error("Deployment failed:", error.message)
        process.exit(1)
    }
}

main()
