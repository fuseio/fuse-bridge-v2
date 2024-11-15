// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ERC20 interface that comply with the Fuse token of the
 *     classic native-to-erc20 bridge. Original bridged token:
 *     https://github.com/fuseio/fuse-bridge/blob/c034421baba4d38989451497dc5b9ea4f81c8b5e/native-to-erc20/contracts/contracts/ERC677BridgeToken.sol#L14
 */
interface IERC20Burnable is IERC20 {
    function mint(address _to, uint256 _amount) external;

    function burnFrom(address _from, uint256 _amount) external;
}
