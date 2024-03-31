const { createProvider } = require("hardhat/internal/core/providers/construction");
const { DeploymentsManager } = require("hardhat-deploy/dist/src/DeploymentsManager")
const bridges = require("../constants/bridges.json")

const getDeploymentManager = (hre, networkName) => {
    const network = {
        name: networkName,
        config: hre.config.networks[networkName],
        provider: createProvider(networkName, hre.config.networks[networkName], hre.config.paths, hre.artifacts),
        saveDeployments: true,
    }
    const newHre = Object.assign(Object.create(Object.getPrototypeOf(hre)), hre)
    newHre.network = network
    const deploymentsManager = new DeploymentsManager(newHre, network)
    newHre.deployments = deploymentsManager.deploymentsExtension
    newHre.getNamedAccounts = deploymentsManager.getNamedAccounts.bind(deploymentsManager)
    newHre.getUnnamedAccounts = deploymentsManager.getUnnamedAccounts.bind(deploymentsManager)
    newHre.getChainId = () => deploymentsManager.getChainId()
    return deploymentsManager
}

const deployContract = async (hre, network, tags) => {
    const deploymentsManager = getDeploymentManager(hre, network)
    await deploymentsManager.runDeploy(tags, {
        log: true,
        resetMemory: false,
        writeDeploymentsToFiles: true,
        savePendingTx: false,
    })
}

const providerByNetwork = {}
const getProvider = (hre, network) => {
    if (!providerByNetwork[network]) {
        const networkUrl = hre.config.networks[network].url      
        providerByNetwork[network] = new ethers.JsonRpcProvider(networkUrl)
    }
    return providerByNetwork[network]
}

const getDeploymentAddress = (network, contractName) => {
    const address =  bridges[network][contractName]
    if (!address) {
        throw Error(`contract ${key} not found for network: ${network}`)
    }
    console.log(`${contractName} contract address on ${network} is ${address}`)
    return address
}

const contracts = {}
const getContract = async (hre, network, contractName) => {
    
    const key = `${network}-${contractName}`
    console.log(key)
    if (!contracts[key]) {
        const contractAddress = getDeploymentAddress(network, contractName)
        console.log(contractAddress)
        const provider = getProvider(hre, network)
        const contractFactory = await getContractFactory(hre, contractName)
        const contract = contractFactory.attach(contractAddress)
        contracts[key] = contract.connect(provider)
    }
    return contracts[key]
}

const contractFactories = {}
const getContractFactory = async (hre, contractName) => {
    if (!contractFactories[contractName]) {
        const artifacts = await hre.artifacts.readArtifactSync(contractName)
        contractFactories[contractName] = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode)
    }
    return contractFactories[contractName]
}

const getWallet = () => new ethers.Wallet(process.env.PRIVATE_KEY)

const connectedWallets = {}
const getConnectedWallet = (hre, network, walletIndex) => {
    const key = `${network}-${walletIndex}`
    if (!connectedWallets[key]) {
        const provider = getProvider(hre, network)
        const wallet = getWallet(walletIndex)
        connectedWallets[key] = wallet.connect(provider)
    }
    return connectedWallets[key]
}

const getWalletContract = async (hre, network, contractName, walletIndex = 0) => {   
    const contract = await getContract(hre, network, contractName)
    const wallet = getConnectedWallet(hre, network, walletIndex)
    return contract.connect(wallet)
}

module.exports = {
    deployContract, getWalletContract
}