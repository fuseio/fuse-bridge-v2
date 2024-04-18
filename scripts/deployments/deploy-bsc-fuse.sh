WRAPPED_NETWORK=bsc npx hardhat run ./scripts/deployOriginalTokenBridgeProxy.js --network fuse # V
BRIDGE_TYPE=burnable-mintable npx hardhat run ./scripts/deployWrappedTokenBridgeProxy.js --network bsc # V

# Update bridges on contsacts/bridges.json
#verify with: # npx hardhat verify --network  bsc BSC_BRDIGE_ADDRESS

export ORIGINAL_TOKEN=0x0BE9e53fd7EDaC9F859882AfdDa116645287C629 #WFUSE
export WRAPPED_TOKEN=0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3 #Fuse Token on BSC

npx hardhat setTrustedRemote  --original-networks fuse  --wrapped-network bsc # V
npx hardhat setUseCustomAdapter  --original-networks fuse  --wrapped-network bsc # V
npx hardhat setMinDstGas --original-networks fuse  --wrapped-network bsc # V
npx hardhat registerToken --original-network fuse --wrapped-network bsc --original-token $ORIGINAL_TOKEN --wrapped-token $WRAPPED_TOKEN


#Test the network with
npx hardhat lockAndMintETH --amount "10" --network fuse
npx hardhat burnAndUnlock --amount 5 --original-network fuse --token $WRAPPED_TOKEN  --decimals 18 --network bsc

# if case you want debug a script, use `npx --node-options=--inspect-brk hardhat...`
