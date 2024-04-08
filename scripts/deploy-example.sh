npx hardhat run ./scripts/deployOriginalTokenBridgeProxy.js --network spark
BRIDGE_TYPE=burnable-mintable npx hardhat run ./scripts/deployWrappedTokenBridgeProxy.js --network bsc-testnet
# Update bridges on contsacts/bridges.json

export ORIGINAL_TOKEN_SPARK=0xE7fC46eCdDBd42b1934323ff7276D2e4F02B54E9
export WRAPPED_TOKEN_BSC_TESTNET=0x58C70f0e6777801edB1bB66f33D3456df4F6F051

npx hardhat setTrustedRemote  --original-networks spark  --wrapped-network bsc-testnet
npx hardhat setUseCustomAdapter  --original-networks spark  --wrapped-network bsc-testnet
npx hardhat setMinDstGas --original-networks spark  --wrapped-network bsc-testnet
npx hardhat registerToken --original-network spark --wrapped-network bsc-testnet --original-token $ORIGINAL_TOKEN_SPARK --wrapped-token $WRAPPED_TOKEN_BSC_TESTNET


# to deploy test tokens
npx hardhat deployTokens --network bsc-testnet --wrapped-tokens "WETH,USDC,USDT"

#Test the network with
npx hardhat lockAndMintETH --amount "1" --network spark
npx hardhat burnAndUnlock --amount 0.1 --original-network spark --token 0x58C70f0e6777801edB1bB66f33D3456df4F6F051  --decimals 18 --network bsc-testnet

# if case you want debug a script, use `npx --node-options=--inspect-brk hardhat...`
