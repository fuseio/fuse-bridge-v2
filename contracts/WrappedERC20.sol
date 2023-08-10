// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Wrapped ERC20
/// @notice Represents a token on another chain
/// @dev Can be minted only by the new bridge but burned by any of old/new bridge
contract WrappedERC20 is ERC20, ERC20Permit, Ownable {
    using SafeERC20 for IERC20;
    address public currentBridge;
    address[] public bridges;
    uint8 private immutable _tokenDecimals;

    /// @param _bridge responsible for minting and burning the wrapped token
    /// @param _name wrapped token name
    /// @param _symbol wrapped token symbol
    /// @param _decimals number of decimals of the original token
    constructor(address _bridge, string memory _name, string memory _symbol, uint8 _decimals) ERC20(_name, _symbol) ERC20Permit(_name) {
        require(_bridge != address(0), "WrappedERC20: invalid bridge");

        currentBridge = _bridge;
        bridges.push(_bridge);
        _tokenDecimals = _decimals;
    }

    modifier onlyCurrentBridge() {
        require(msg.sender == currentBridge, "WrappedERC20: caller is not the bridge");
        _;
    }

    modifier onlyBridge() {
        bool isBridge = false;
        for (uint i = 0; i < bridges.length; i++) {
            if (msg.sender == bridges[i]) {
                isBridge = true;
                break;
            }
        }
        require(isBridge, "WrappedERC20: caller is not the bridge");
        _;
    }

    /// @notice Number of decimal places used to represent the token's smallest unit
    /// @dev Overrides the default value of 18
    /// @return number of decimal places
    function decimals() public view virtual override returns (uint8) {
        return _tokenDecimals;
    }

    /// @notice Creates `amount` tokens and assigns them to `account`, increasing the total supply
    /// @dev called only by the bridge
    function mint(address _to, uint _amount) external virtual onlyCurrentBridge {
        _mint(_to, _amount);
    }

    /// @notice Destroys `amount` tokens from `account`, reducing the total supply
    /// @dev Called only by the bridge
    function burn(address _from, uint _amount) external virtual onlyBridge {
        _burn(_from, _amount);
    }

    /// @notice Sets a new bridge
    /// @dev called only by the owner
    function upgradeBridge(address _newBridge) external virtual onlyOwner {
        require(_newBridge != address(0), "WrappedERC20: invalid bridge");
        require(_newBridge != currentBridge, "WrappedERC20: same bridge");
        require(_newBridge != owner(), "WrappedERC20: owner cannot be the bridge");
        currentBridge = _newBridge;
        bridges.push(_newBridge);
    }
}
