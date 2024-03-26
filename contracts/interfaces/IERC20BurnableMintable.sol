// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
  * @title ERC20 interface that comply with the tokens of the
  classic AMB tokenbridge. Original bridged token:
  https://github.com/fuseio/tokenbridge-contracts/blob/c1930e2913f83074cc239e31020d6e9331138629/contracts/PermittableToken.sol
 */
interface IERC20BurnableMintable is IERC20 {
    function mint(address _to, uint256 _amount) external returns (bool);
    function burn(uint256 _value) external;
}
