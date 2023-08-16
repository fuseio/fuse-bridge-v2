// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {WrappedTokenBridgeBaseUpgradable} from "./WrappedTokenBridgeBaseUpgradable.sol";

/// @dev Locks an ERC20 on the source chain and sends LZ message to the remote chain to mint a wrapped token
contract WrappedTokenBridgeUpgradable is WrappedTokenBridgeBaseUpgradable {
    function initialize(address _endpoint) external initializer {
        __WrappedTokenBridgeBaseUpgradable_init(_endpoint);
    }
}
