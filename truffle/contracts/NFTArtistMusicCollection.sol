// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

// JSON URI => https://ipfs.io/ipfs/bafybeig4zjvi4am7zrinqao3hqbjduyn7qxa3emkdiv76zyeuo4dunlbqm/4.json

contract NFTArtistMusicCollection is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _baseUri;

    constructor(string memory baseUri_, string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _baseUri = baseUri_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUri;
    }

    function tokenURI(uint256 _tokenId) override public view returns(string memory) {
        if (!_exists(_tokenId)) {
            return "";
        }
        return string(abi.encodePacked(_baseURI(), Strings.toString(_tokenId), ".json"));
    }

    function mint() public returns (uint256)  {
        _tokenIds.increment();
        _mint(msg.sender, _tokenIds.current());
        return _tokenIds.current();
    }


    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
