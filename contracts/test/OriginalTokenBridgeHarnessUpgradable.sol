// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {OriginalTokenBridgeBaseUpgradable} from "../OriginalTokenBridgeBaseUpgradable.sol";

/// @dev used only in unit tests to call internal _nonblockingLzReceive
contract OriginalTokenBridgeHarnessUpgradable is OriginalTokenBridgeBaseUpgradable {
      
    function initialize(address _endpoint, uint16 _remoteChainId, address _weth) external initializer {
        __OriginalTokenBridgeBaseUpgradable_init(_endpoint, _remoteChainId, _weth);
    }

    function simulateNonblockingLzReceive(uint16 srcChainId, bytes memory payload) external {
        _nonblockingLzReceive(srcChainId, "0x", 0, payload);
    }
}
