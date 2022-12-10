const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { expect } = require("chai");

const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");

// console.log(ArtistERC1155Token);
// console.log("ArtistERC1155Token.NFTTypes", ArtistERC1155Token.NFTTypes);
contract('ArtistERC1155Token', accounts => {
  const owner = accounts[0];
  let instance;

  async function getNewContract(options) {
    return await ArtistERC1155Token.new(
      "ipfs://QmT2uYvfEgNFDMGSwiVvQ6EUuKgEPj88NKnFtmwi5eRquv/{id}.json",
      "0x9FC96dE022142fCa0D36a33bdfAa2D9580c318E9", // linosPlatformAddress
      "Test ERC1155",
      ["TOKEN1", "TOKEN2"],
      [1, 2],
      options,
      {from: owner}
    );
  }

  describe("NFT Basics", () => {
    before(async () => {
      instance = await getNewContract({
        distributionType: ArtistERC1155Token.DistributionType.DROP,
        minimumFanTokenRequiredToMint: 0,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      });
    });

    it("...Chould return the url properly", async () => {
      const uri = await instance.uri(1);
      expect(uri).to.be.equal("ipfs://QmT2uYvfEgNFDMGSwiVvQ6EUuKgEPj88NKnFtmwi5eRquv/{id}.json");
    });

    it("...Should return the name properly", async () => {
      const name2 = await instance.getName(1);
      expect(name2).to.be.equal("TOKEN2");
    });

  });

  describe("NFT Drop with no restrictions", () => {
    before(async () => {
      instance = await getNewContract({
        distributionType: ArtistERC1155Token.DistributionType.DROP,
        minimumFanTokenRequiredToMint: 0,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      });
    });

    it("...Should revert when trying to mint non-existing nft", async () => {
      await expectRevert(
        instance.PublicMint(4, { from: owner }),
        'Token does not exists',
      );
    })

    it("...Should revert when maxSupply reached", async () => {
      await instance.PublicMint(1, { from: owner });
      await instance.PublicMint(1, { from: owner });
      await expectRevert(
        instance.PublicMint(1, { from: owner }),
        'Max supply reached for this token type',
      );
    })
  });
});
