// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// importing the ERC-721 contract to deploy for an artist
import "./ArtistERC1155Token.sol";
import "./LinosPlatformInterface.sol";
import "./NftMarketPlaceInterface.sol";

/**
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist. S/O @Snow
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract ArtistERC1155Factory {

    event NFTCollectionCreated(string _artistName, address _collectionAddress, uint _timestamp);

    address _linosPlatformAddress;
    address _nftMarketPlaceAddress;

    constructor(address linosPlatformAddress_, address nftMarketPlaceAddress_) {
      _linosPlatformAddress = linosPlatformAddress_;
      _nftMarketPlaceAddress = nftMarketPlaceAddress_;
    }

    /**
      * @notice Deploy the ERC-1155 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createNFTCollection(
      string calldata _uri,
      string calldata _collectionName,
      string[] calldata tokenNames_,
      uint[] calldata maxSupply_,
      ArtistERC1155Token.Options calldata options_
    ) external returns (address collectionAddress) {

      require(LinosPlatformInterface(_linosPlatformAddress).isArtistValid(msg.sender), "Not artist");

      ArtistERC1155Token nftCollection = new ArtistERC1155Token(
        _uri,
        _collectionName,
        tokenNames_,
        maxSupply_,
        options_
      );

      nftCollection.setFanTokenAddress(LinosPlatformInterface(_linosPlatformAddress).getArtist(msg.sender).fanTokenAddress);
      nftCollection.transferOwnership(msg.sender);
      emit NFTCollectionCreated(_collectionName, address(nftCollection), block.timestamp);

      NftMarketPlaceInterface nftMarketPlace = NftMarketPlaceInterface(_nftMarketPlaceAddress);
      nftMarketPlace.whiteListNftCollection(address(nftCollection));

      return address(nftCollection);
    }
}
