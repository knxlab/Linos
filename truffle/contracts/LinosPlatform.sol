// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "./NFTArtistMusicCollectionFactory.sol";
import "./NftMarketPlace.sol";

contract LinosPlatform is Ownable {

    struct Track {
        // address contractAddress;
        string name;
        string coverUri;
    }

    struct Artist {
        string name;
        bool isRegistered;
        bool isValid;
    }

    address public nftFactoryAddress;
    address public nftMarketPlaceAddress;

    mapping(address => Artist) public artists;
    mapping(address => Track[]) public artistTracks;

    modifier notAnArtist(address _address) {
        require(!artists[_address].isRegistered, "Already registered");
        _;
    }
    modifier onlyValidArtist(address _address) {
        require(artists[_address].isValid, "Artist is not valid");
        _;
    }

    constructor() {
        nftMarketPlaceAddress = address(new NftMarketPlace(address(this)));
        nftFactoryAddress = address(new NFTArtistMusicCollectionFactory(address(this), nftMarketPlaceAddress));
    }

    function isArtistValid(address artistAddress) public view returns(bool) {
        return artists[artistAddress].isValid;
    }

    function registerValidArtist(address _artistAddress, string calldata _artistName) public onlyOwner notAnArtist(_artistAddress) {
        artists[_artistAddress] = Artist(_artistName, true, true);
    }

    function createTrack(string calldata _name, string calldata _coverUri) external onlyValidArtist(msg.sender) {
        artistTracks[msg.sender].push(Track(_name, _coverUri));
    }
}