// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// importing the ERC-721 contract to deploy for an artist
import "./NFTArtistMusicCollection.sol";
import "./LinosPlatform.sol";
import "./NftMarketPlace.sol";

error NotValidArtist();

/**
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist. S/O @Snow
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract NFTArtistMusicCollectionFactory {

    event NFTCollectionCreated(string _artistName, address _collectionAddress, uint _timestamp);

    modifier onlyValidArtist(
        address artistAddress
    ) {
        LinosPlatform linosPlatform = getLinosPlatform();
        if (!linosPlatform.isArtistValid(artistAddress)) {
            revert NotValidArtist();
        }
        _;
    }

    address _linosPlatformAddress;
    address _nftMarketPlaceAddress;
    constructor(address linosPlatformAddress_, address nftMarketPlaceAddress_) {
      _linosPlatformAddress = linosPlatformAddress_;
      _nftMarketPlaceAddress = nftMarketPlaceAddress_;
    }

    function getLinosPlatform() private view returns(LinosPlatform) {
        return LinosPlatform(_linosPlatformAddress);
    }

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createNFTCollection(string memory baseUri_, string memory _artistName, string memory _artistSymbol)
        external
        onlyValidArtist(msg.sender)
        returns (address collectionAddress)
    {

      NFTArtistMusicCollection nftCollection = new NFTArtistMusicCollection(baseUri_, _artistName, _artistSymbol);
      address nftCollectionAddresss = address(nftCollection);
      // TransferOwnerShip to msg.sender
      emit NFTCollectionCreated(_artistName, nftCollectionAddresss, block.timestamp);

      NftMarketPlace nftMarketPlace = NftMarketPlace(_nftMarketPlaceAddress);
      nftMarketPlace.whiteListNftCollection(nftCollectionAddresss);

      return nftCollectionAddresss;
    }
}
