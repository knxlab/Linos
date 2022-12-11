// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "./LinosPlatformInterface.sol";
import "./ArtistERC1155Factory.sol";
import "./NftMarketPlace.sol";
import "./FanToken.sol";

contract LinosPlatform is LinosPlatformInterface, Ownable {


    address public listenTokenAddress;
    address public nftFactoryAddress;
    address public nftMarketPlaceAddress;

    mapping(address => User) public users;
    mapping(address => Artist) public artists;
    mapping(address => Track[]) public artistTracks;

    modifier notAUser(address _address) {
        require(!users[_address].isRegistered, "User Already registered");
        _;
    }
    modifier notAnArtist(address _address) {
        require(!artists[_address].isRegistered, "Artist Already registered");
        _;
    }
    modifier onlyValidArtist(address _address) {
        require(artists[_address].isValid, "Artist is not valid");
        _;
    }

    constructor() {
        NftMarketPlace nftMarketPlace = new NftMarketPlace();
        nftMarketPlace.setFees(5);
        nftMarketPlace.setLinosPlatformAddress(address(this));
        nftMarketPlaceAddress = address(nftMarketPlace);

        nftFactoryAddress = address(new ArtistERC1155Factory(
            address(this),
            address(nftMarketPlace)
        ));

        nftMarketPlace.setNftFactoryAddress(nftFactoryAddress);
    }

    function getArtist(address artistAddress) external view returns(Artist memory) {
        return artists[artistAddress];
    }

    function getUser(address userAddress) external view returns(User memory) {
        return users[userAddress];
    }

    function isArtistValid(address artistAddress) external view returns(bool) {
        return artists[artistAddress].isValid;
    }

    function registerAsArtist(
        string calldata _artistName,
        string calldata _symbol
    ) public notAnArtist(msg.sender) notAUser(msg.sender) {
        FanToken artistFanToken = new FanToken(
            _artistName,
            string(abi.encodePacked('L-', _symbol)),
            address(this)
        );
        artists[msg.sender] = Artist(_artistName, address(artistFanToken), true, true);
    }

    function registerAsUser(
        string calldata _userName
    ) public notAnArtist(msg.sender) notAUser(msg.sender) {
        users[msg.sender] = User(_userName, true);
    }

    function createTrack(string calldata _name, string calldata _coverUri) external onlyValidArtist(msg.sender) {
        artistTracks[msg.sender].push(Track(_name, _coverUri));
    }

    receive() external payable {}
    fallback() external payable {}
}