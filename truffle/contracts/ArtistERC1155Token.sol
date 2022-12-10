// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/common/ERC2981.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract ArtistERC1155Token is ERC1155, ERC2981, Ownable, ReentrancyGuard {

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // STATE --------------------------------------------------------------------------------------------------

    // The contract address of the Linos Platform
    address _linosPlatformAddress;

    enum DistributionType { SELL, DROP }
    struct Options {
        DistributionType distributionType;
        uint minimumFanTokenRequiredToMint; // set to zero to disable
        uint maxTotalMintPerWallet; // set to zero to disable
        uint maxMintPerWallerPerToken; // set to zero to disable
    }

    Options private _options;
    string public collectionName; // the token mame
    address public fanTokenAddress; // The contract address of the artist Fan Token

    mapping(string => uint) public nameToId; // name to id mapping
    mapping(uint => string) public idToName; // id to name mapping
    string[] private _tokenNames;
    uint[] private _maxSupply;


    // Mapping to hold the total supply of each token type in the contract
    mapping(uint256 => uint256) private _idToTotalSupply;
    // Mapping to hold the max supply of each token type in the contract
    mapping(uint256 => uint256) private _idToMaxSupply;

    // Number of minted token per wallet per idToken
    mapping(uint256 => mapping(address => uint)) private _countTotalMintPerWalletPerToken;
    // Number of minted token per wallet in total
    mapping(address => uint) private _countTotalMintPerWallet;

    // STATE --------------------------------------------------------------------------------------------------

    // MODIFIERS --------------------------------------------------------------------------------------------------
    modifier onlyWhenNotMintedByUser(uint idToken, address userAddress) {
        require(_countTotalMintPerWalletPerToken[idToken][userAddress] == 0, "You already minted this token");
        _;
    }
    // MODIFIERS --------------------------------------------------------------------------------------------------

    /*
     * _uri should be this format => ipfs://bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/{id}.json
     * [!IMPORTANT!!] => Do NOT use a gateway in the contract
     * The client MUST replace ipfs:// with the gateway of its choice
     * This is opensea compatible
     * See https://docs.opensea.io/docs/metadata-standards
     * => "the uri function in your ERC1155 contract should return an HTTP or IPFS URL"
     * https://docs.opensea.io/docs/metadata-standards#ipfs-and-arweave-uris
    */
    constructor(
        string memory _uri,
        address linosPlatformAddress_,
        string memory _collectionName,
        string[] memory tokenNames_,
        uint[] memory maxSupply_,
        Options memory options_
    ) ERC1155(_uri) {
        _linosPlatformAddress = linosPlatformAddress_;
        if (tokenNames_.length != maxSupply_.length) {
            revert("Names and MaxSupply should have the same size !");
        }

        _options = options_;
        _tokenNames = tokenNames_;
        _maxSupply = maxSupply_;

        collectionName = _collectionName;

        // Transfer OwnerShip to the initiator of the transaction (the artist who use Linos)
        transferOwnership(tx.origin);
    }

    // Private helpers --------------------------------------------------------------------------------------------------

    function _exists(uint _id) private view returns(bool) {
        return _id < _tokenNames.length;
    }

    // Private helpers --------------------------------------------------------------------------------------------------


    // Public accessor --------------------------------------------------------------------------------------------------
    function getName(uint _id) public view returns(string memory) {
        return _tokenNames[_id];
    }

    // Public accessor --------------------------------------------------------------------------------------------------

    /*
     * creates a mapping of strings to ids (i.e ["one","two"], [1,2] - "one" maps to 1, vice versa.)
     * Use id + 1 because tokenIds should begin with 1, not 0!
     */
    // function createMapping(
    //     string[] memory _names,
    //     uint[] memory _maxSupply
    // ) private {
    //     for (uint id = 0; id < _names.length; id++) {
    //         nameToId[_names[id]] = id + 1;
    //         idToName[id + 1] = _names[id];
    //         _idToMaxSupply[id + 1] = _maxSupply[id];
    //     }
    // }



/***
 *    ███╗   ███╗██╗███╗   ██╗████████╗
 *    ████╗ ████║██║████╗  ██║╚══██╔══╝
 *    ██╔████╔██║██║██╔██╗ ██║   ██║
 *    ██║╚██╔╝██║██║██║╚██╗██║   ██║
 *    ██║ ╚═╝ ██║██║██║ ╚████║   ██║
 *    ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝
 */

    /*
     * mint(address account, uint _id)
     *
     * account - address to mint the token to
     * _id - the ID being minted
     * A user can only mint one token
    */
    function PublicMint(uint _id) public nonReentrant() returns (uint)
    {
        require(_exists(_id), "Token does not exists");
        require(
            _idToTotalSupply[_id] + 1 <= _maxSupply[_id],
            "Max supply reached for this token type"
        );
        require(
            _options.maxTotalMintPerWallet == 0 || _countTotalMintPerWallet[msg.sender] + 1 <= _options.maxTotalMintPerWallet,
            "You minted too much"
        );
        require(
            _options.maxMintPerWallerPerToken == 0 || _countTotalMintPerWalletPerToken[_id][msg.sender] + 1 <= _options.maxMintPerWallerPerToken,
            "You minted too much of this token"
        );
        require(
            _options.minimumFanTokenRequiredToMint == 0,
            "You are not fan enought => Stream or boost !"
        );

        _countTotalMintPerWallet[msg.sender]++;
        _countTotalMintPerWalletPerToken[_id][msg.sender]++;
        _idToTotalSupply[_id]++;
        _mint(msg.sender, _id, 1, "");
        return _id;
    }

}