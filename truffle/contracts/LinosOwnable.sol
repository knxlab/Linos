// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LinosOwnable is Ownable {
  address _linosPlatformAddress;
  address _nftFactoryAddress;
  address _nftMarketPlaceAddress;

  modifier onlyLinosOwner() {
    require(
      msg.sender == _linosPlatformAddress || msg.sender == _nftFactoryAddress || msg.sender == _nftMarketPlaceAddress,
      "LinosOwnable: not an owner"
    );
    _;
  }

  modifier onlyOwnerOrLinosOwner() {
    require(
      msg.sender == owner() ||
      msg.sender == _linosPlatformAddress || msg.sender == _nftFactoryAddress || msg.sender == _nftMarketPlaceAddress,
      "LinosOwnable: not an owner"
    );
    _;
  }

  function setLinosPlatformAddress(address _add) public onlyOwner {
    _linosPlatformAddress = _add;
  }
  function setNftFactoryAddress(address _add) public onlyOwner {
    _nftFactoryAddress = _add;
  }
  function setNftMarketPlaceAddress(address _add) public onlyOwner {
    _nftMarketPlaceAddress = _add;
  }

}