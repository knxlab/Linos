// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract FanToken is ERC20, Ownable {

    bool _externalTransferEnabled = false;
    address _linosPlatformAddres;
    constructor(string memory artistName, string memory symbol, address linosPlatformAddress) ERC20(artistName, symbol) {
        _linosPlatformAddres = linosPlatformAddress;
    }

    function toggleTransferEnabled() public onlyOwner {
        _externalTransferEnabled = !_externalTransferEnabled;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) override internal virtual {
        require(_externalTransferEnabled, "Token transfers are not allowed");
        super._beforeTokenTransfer(from, to, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function linosTransferFrom(address from, address to, uint amount) public onlyOwner {
        _transfer(from, to, amount);
    }
}
