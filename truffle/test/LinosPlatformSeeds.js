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

  const orelsan = accounts[1];
  const userDavid = accounts[2];

  const addressZero = "0x0000000000000000000000000000000000000000";

  let linosInstance;
  let nftFactoryInstance;

  describe("Basics", () => {
    before(async () => {
      linosInstance = await LinosPlatform.at("0x716c961B9644bB9EC125698781c475bEA7d2CA89");
      console.log("LINOS INSTANCE", linosInstance);
      await linosInstance.registerAsArtist("Orelsan", "ORL", { from: orelsan });
      await linosInstance.registerAsUser("David Quenet", { from: userDavid });

      const nftFactoryAddress = await linosInstance.nftFactoryAddress.call({ from: owner });
      nftFactoryInstance = await ArtistERC1155Factory.at(nftFactoryAddress);
    });

    it("...Seed data", async () => {
      await nftFactoryInstance.createNFTCollection.call(
        "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
        "Test NFT Collection DROP",
        ["Apple", "Etam", "Nike", "AppleStore"],
        [1, 10, 20, 100],
        {
          distributionType: ArtistERC1155Token.DistributionType.DROP,
          minimumFanTokenRequiredToMint: 0,
          maxTotalMintPerWallet: 0,
          maxMintPerWallerPerToken: 0
        },
        {from: orelsan}
      );

      const resultNft = await nftFactoryInstance.createNFTCollection.call(
        "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
        "Test NFT Collection SELL",
        ["Apple", "Etam", "Nike", "AppleStore"],
        [1, 10, 20, 100],
        {
          distributionType: ArtistERC1155Token.DistributionType.SELL,
          minimumFanTokenRequiredToMint: 0,
          maxTotalMintPerWallet: 0,
          maxMintPerWallerPerToken: 0
        },
        {from: orelsan}
      );

    });


  });


});
