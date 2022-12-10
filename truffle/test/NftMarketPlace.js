const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { expect } = require("chai");

const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");
const NftMarketPlace = artifacts.require("./NftMarketPlace.sol");

contract('NftMarketPlace', accounts => {
  const owner = accounts[0];
  const seller = accounts[1];
  const buyer = accounts[2];
  let instanceMarketplace;

  async function getNftContract() {
    return await ArtistERC1155Token.new(
      "ipfs://QmT2uYvfEgNFDMGSwiVvQ6EUuKgEPj88NKnFtmwi5eRquv/{id}.json",
      "Test ERC1155",
      ["TOKEN1", "TOKEN2"],
      [11, 22],
      {
        distributionType: ArtistERC1155Token.DistributionType.DROP,
        minimumFanTokenRequiredToMint: 0,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      },
      {from: owner}
    );
  }
  async function getMarketPlaceInstance(fees = 0) {
    return await NftMarketPlace.new(fees, { from: owner });
  }

  describe("Basics", () => {
    before(async () => {
      instanceMarketplace = await getMarketPlaceInstance();
      instanceNFT = await getNftContract();
    });

    it("...Fees should be zero", async () => {
      const fees = await instanceMarketplace.fees.call();
      expect(fees).to.be.bignumber.equal(new BN(0));
    });

    it("...Can't list until approve", async () => {
      await expectRevert(
        instanceMarketplace.listItems(
          instanceNFT.address,
          0,
          1,
          '10000000000',
          { from: owner }
        ),
        'You must approve before list',
      );
    });
  });

  describe("Listing with fees", () => {
    before(async () => {
      instanceMarketplace = await getMarketPlaceInstance(1000);
      instanceNFT = await getNftContract();

      await instanceNFT.PublicMint(0, { from: seller });
    });

    it("...Fees should be 1000", async () => {
      const fees = await instanceMarketplace.fees.call();
      expect(fees).to.be.bignumber.equal(new BN(1000));
    });

    it("...Can list after approve", async () => {
      await instanceNFT.setApprovalForAll(instanceMarketplace.address, true, { from: seller });
      await instanceMarketplace.listItems(
        instanceNFT.address,
        0,
        1,
        web3.utils.toWei("1", "ether"),
        { from: seller }
      );

      const sellId = await instanceMarketplace.getCurrentListingId();
      const listing = await instanceMarketplace.getListing(0);

      expect(sellId).to.be.bignumber.equal(BN(1));
      // web3.utils.toBN(web3.utils.toWei('1', 'ether'))
      expect(listing.pricePerToken).to.be.bignumber.equal(web3.utils.toWei("1", "ether"));
    });

    it("...Can buy the listing", async () => {
      const ethBalanceOfBuyer = web3.utils.toBN(await web3.eth.getBalance(buyer));
      const ethBalanceOfSeller = web3.utils.toBN(await web3.eth.getBalance(seller));
      const ethBalanceOfMarketplace = web3.utils.toBN(await web3.eth.getBalance(owner));

      await instanceMarketplace.buyItem(0, 1, {
        from: buyer, value: web3.utils.toBN(web3.utils.toWei("1", 'ether'))
      });
      const sellerBalance = await instanceNFT.balanceOf(seller, 0);
      const buyerBalance = await instanceNFT.balanceOf(buyer, 0);

      expect(sellerBalance).to.be.bignumber.equal(BN(0));
      expect(buyerBalance).to.be.bignumber.equal(BN(1));

      const ethBalanceOfBuyerAfter = web3.utils.toBN(await web3.eth.getBalance(buyer));
      const ethBalanceOfSellerAfter = web3.utils.toBN(await web3.eth.getBalance(seller));
      const ethBalanceOfMarketplaceAfter = web3.utils.toBN(await web3.eth.getBalance(owner));

      const Fees = web3.utils.toBN(web3.utils.toWei("0.1", 'ether'));

      expect(ethBalanceOfBuyerAfter).to.be.bignumber.lessThan(ethBalanceOfBuyer);
      expect(ethBalanceOfSellerAfter).to.be.bignumber.greaterThan(ethBalanceOfSeller);
      expect(ethBalanceOfMarketplaceAfter.sub(ethBalanceOfMarketplace)).to.be.bignumber.equal(Fees);
    })
  });

});
