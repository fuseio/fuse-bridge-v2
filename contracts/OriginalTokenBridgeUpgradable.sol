// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {OriginalTokenBridgeBaseUpgradable} from "./OriginalTokenBridgeBaseUpgradable.sol";

/// @dev Locks an ERC20 on the source chain and sends LZ message to the remote chain to mint a wrapped token
contract OriginalTokenBridgeUpgradable is OriginalTokenBridgeBaseUpgradable {

    function initialize(address _endpoint, uint16 _remoteChainId, address _weth) external initializer {
        __OriginalTokenBridgeBaseUpgradable_init(_endpoint, _remoteChainId, _weth);
    }
    
}
