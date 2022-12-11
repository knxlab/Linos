// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "./NftMarketPlaceInterface.sol";
import "./LinosOwnable.sol";

contract NftMarketPlace is NftMarketPlaceInterface, LinosOwnable {

    struct SellListing {
        address sellerAddress;
        address tokenAddress;
        uint tokenId;
        uint amountOfTokens;
        uint pricePerToken;
        bool canceled;
    }

    // @notice This is the emitted event, when a offer for a certain amount of tokens.
    event SellEvent (
        address sellerAddress,
        address tokenAddress,
        uint tokenId,
        uint sellId,
        uint pricePerToken
    );

    // @notice This is the emitted event, when a offer for a certain amount of tokens.
    event SellCanceledEvent (
        uint sellId
    );

    // @notice This is the emitted event, when a offer for a certain amount of tokens.
    event BuyEvent (
        address buyerAddress,
        address sellerAddress,
        uint sellId,
        uint amountOfTokens
    );

    uint public fees;
    uint _feeDenominator = 10000;
    mapping(address => bool) nftCollectionWhiteList;

    uint private _currentSellId;
    mapping(uint => SellListing) private _allSellListing;
    // TokenAddress => TokenId => SellerAddress => Struct describing the Sell
    mapping(address => mapping(uint => uint)) private _collectionTokenListSells;
    mapping(address => uint) private _collectionListSells;
    mapping(address => uint) private _userListSells;

    function setFees(uint fees_) public onlyOwner {
        require(fees_ < _feeDenominator, "Fees must be < 9999");
        fees = fees_;
    }

    function whiteListNftCollection(address nftCollectionAddress) public onlyLinosOwner {
        nftCollectionWhiteList[nftCollectionAddress] = true;
    }

    function getListing(uint sellId) public view returns(SellListing memory) {
        require(_allSellListing[sellId].sellerAddress != address(0), "This listing does not exists");
        return _allSellListing[sellId];
    }

    function cancelListing(uint sellId) external {
        require(_allSellListing[sellId].sellerAddress == msg.sender, "This listing is not yours");
        require(!_allSellListing[sellId].canceled, "listing already canceled");
        _allSellListing[sellId].canceled = true;

        emit SellCanceledEvent(sellId);
    }

    function listItems(
        address tokenAddress,
        uint tokenId,
        uint amountOfTokens,
        uint pricePerToken
    ) external returns(uint) {
        require(amountOfTokens > 0, "The amount of tokens to sell, needs to be greater than 0");
        require(pricePerToken > 0, "The full price for the tokens need to be greater than 0");

        IERC1155 token = IERC1155(tokenAddress);

        require(token.isApprovedForAll(msg.sender, address(this)), "You must approve before list");
        require(token.balanceOf(msg.sender, tokenId) >= amountOfTokens, "You don't have enought tokens");

        _allSellListing[_currentSellId] = SellListing(
            msg.sender,
            tokenAddress,
            tokenId,
            amountOfTokens,
            pricePerToken,
            false
        );
        _collectionTokenListSells[tokenAddress][tokenId] = _currentSellId;
        _collectionListSells[tokenAddress] = _currentSellId;
        _userListSells[msg.sender] = _currentSellId;

        emit SellEvent(
            msg.sender, tokenAddress, tokenId, _currentSellId, pricePerToken
        );

        _currentSellId++;

        return _currentSellId - 1;
    }

    function buyItem(
        uint sellId,
        uint amountOfTokens
    ) external payable returns(bool) {

        require(amountOfTokens > 0, "You must buy at least 1 token");
        require(_allSellListing[sellId].sellerAddress != address(0), "This listing does not exists");
        require(_allSellListing[sellId].amountOfTokens >= amountOfTokens, "Not enought token to sell");
        require(_allSellListing[sellId].pricePerToken * amountOfTokens == msg.value, "You must pay exactly the price per token * amount per token");

        _allSellListing[sellId].amountOfTokens = _allSellListing[sellId].amountOfTokens - amountOfTokens;

        IERC1155 token = IERC1155(_allSellListing[sellId].tokenAddress);

        // This will fail if not enought token on account, no need to check it before
        token.safeTransferFrom(
            _allSellListing[sellId].sellerAddress,
            msg.sender,
            _allSellListing[sellId].tokenId,
            amountOfTokens,
            ""
        );

        uint totalPrice = msg.value;
        uint feesForMarketPlace = fees * totalPrice / _feeDenominator; // Rounded (floor)
        uint sellerPriceReceived = totalPrice - feesForMarketPlace;

        (bool successTransferToSeller, )= payable(_allSellListing[sellId].sellerAddress).call{value: sellerPriceReceived}("");
        (bool successTransferToOwner, )= payable(owner()).call{value: feesForMarketPlace}("");

        require(successTransferToSeller, "Transfer failed to Seller");
        require(successTransferToOwner, "Transfer failed to Owner");

        emit BuyEvent(
            msg.sender,
            _allSellListing[sellId].sellerAddress,
            sellId,
            amountOfTokens
        );

        return true;
    }
}