// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract NftMarketPlace {

    address _linosPlatformAddress;

    mapping(address => bool) nftCollectionWhiteList;

    constructor(address linosPlatformAddress_) {
        _linosPlatformAddress = linosPlatformAddress_;
    }

    function whiteListNftCollection(address nftCollectionAddress) public {
        nftCollectionWhiteList[nftCollectionAddress] = true;
    }

}