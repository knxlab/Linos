const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { expect } = require("chai");

const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");
const ArtistERC1155Factory = artifacts.require("./ArtistERC1155Factory.sol");

const NftMarketPlace = artifacts.require("./NftMarketPlace.sol");
const LinosPlatform = artifacts.require("./LinosPlatform.sol");

contract('NftMarketPlace', accounts => {
  const owner = accounts[0];
  const seller = accounts[1];
  const buyer = accounts[2];
  const artist = accounts[3];

  const addressZero = "0x0000000000000000000000000000000000000000";

  let instances;

  async function createNftContract(nftFactoryInstance, from) {
    return await nftFactoryInstance.createNFTCollection.call(
      "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
      "Test ERC1155",
      ["TOKEN1", "TOKEN2"],
      [11, 22],
      {
        distributionType: ArtistERC1155Token.DistributionType.DROP,
        minimumFanTokenRequiredToMint: 0,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      },
      {from}
    );
  }
  async function getLinosAndMarketplace() {
    const linosInstance = await LinosPlatform.new({ from: owner });
    const marketPlaceAddress = await linosInstance.nftMarketPlaceAddress.call({ from: owner });
    const nftFactoryAddress = await linosInstance.nftFactoryAddress.call({ from: owner });
    const marketPlaceInstance = await NftMarketPlace.at(marketPlaceAddress);
    const nftFactoryInstance = await ArtistERC1155Factory.at(nftFactoryAddress);
    return {
        linosInstance,
        marketPlaceInstance,
        nftFactoryInstance
    };
  }

  describe("Basics", () => {
    before(async () => {
      instances = await getLinosAndMarketplace();
    });

    it("...Can register as artist", async () => {
      const { linosInstance } = instances;
      await linosInstance.registerAsArtist("Orelsan", "ORL", { from: artist });
      const artistObj = await linosInstance.getArtist(artist);
      const notArtist = await linosInstance.getArtist(addressZero);
      expect(artistObj.isRegistered).to.be.true;
      expect(notArtist.fanTokenAddress).to.be.equal(addressZero);
      expect(artistObj.fanTokenAddress).not.to.be.equal(addressZero);
    });

    it("...Can't create an nft collection", async () => {
      const { nftFactoryInstance } = instances;
      await expectRevert(
        createNftContract(nftFactoryInstance, owner),
        'Not artist',
      );
    });

    it("...Can create an nft collection", async () => {
      const { nftFactoryInstance } = instances;
      const nftAddress = await createNftContract(nftFactoryInstance, artist);
      console.log(nftAddress);
    })

  });

  // describe("Listing with fees", () => {
  //   before(async () => {
  //     instanceMarketplace = await getMarketPlaceInstance(1000);
  //     instanceNFT = await getNftContract();

  //     await instanceNFT.PublicMint(0, { from: seller });
  //   });

  //   it("...Fees should be 1000", async () => {
  //     const fees = await instanceMarketplace.fees.call();
  //     expect(fees).to.be.bignumber.equal(new BN(1000));
  //   });

  //   it("...Can list after approve", async () => {
  //     await instanceNFT.setApprovalForAll(instanceMarketplace.address, true, { from: seller });
  //     await instanceMarketplace.listItems(
  //       instanceNFT.address,
  //       0,
  //       1,
  //       web3.utils.toWei("1", "ether"),
  //       { from: seller }
  //     );

  //     const listing = await instanceMarketplace.getListing(0);

  //     // web3.utils.toBN(web3.utils.toWei('1', 'ether'))
  //     expect(listing.pricePerToken).to.be.bignumber.equal(web3.utils.toWei("1", "ether"));
  //   });

  //   it("...Can buy the listing", async () => {
  //     const ethBalanceOfBuyer = web3.utils.toBN(await web3.eth.getBalance(buyer));
  //     const ethBalanceOfSeller = web3.utils.toBN(await web3.eth.getBalance(seller));
  //     const ethBalanceOfMarketplace = web3.utils.toBN(await web3.eth.getBalance(owner));

  //     await instanceMarketplace.buyItem(0, 1, {
  //       from: buyer, value: web3.utils.toBN(web3.utils.toWei("1", 'ether'))
  //     });
  //     const sellerBalance = await instanceNFT.balanceOf(seller, 0);
  //     const buyerBalance = await instanceNFT.balanceOf(buyer, 0);

  //     expect(sellerBalance).to.be.bignumber.equal(BN(0));
  //     expect(buyerBalance).to.be.bignumber.equal(BN(1));

  //     const ethBalanceOfBuyerAfter = web3.utils.toBN(await web3.eth.getBalance(buyer));
  //     const ethBalanceOfSellerAfter = web3.utils.toBN(await web3.eth.getBalance(seller));
  //     const ethBalanceOfMarketplaceAfter = web3.utils.toBN(await web3.eth.getBalance(owner));

  //     const Fees = web3.utils.toBN(web3.utils.toWei("0.1", 'ether'));

  //     expect(ethBalanceOfBuyerAfter).to.be.bignumber.lessThan(ethBalanceOfBuyer);
  //     expect(ethBalanceOfSellerAfter).to.be.bignumber.greaterThan(ethBalanceOfSeller);
  //     expect(ethBalanceOfMarketplaceAfter.sub(ethBalanceOfMarketplace)).to.be.bignumber.equal(Fees);
  //   })
  // });

});
