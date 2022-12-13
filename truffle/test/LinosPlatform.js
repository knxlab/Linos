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
  const userLambda = accounts[4];

  const addressZero = "0x0000000000000000000000000000000000000000";

  let instances;

  async function createNftContract(nftFactoryInstance, from) {
    return await nftFactoryInstance.createNFTCollection(
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

  async function createNftContractToMint(nftFactoryInstance, from) {
    return await nftFactoryInstance.createNFTCollection(
      "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
      "Test ERC1155",
      ["TOKEN1", "TOKEN2"],
      [11, 22],
      {
        distributionType: ArtistERC1155Token.DistributionType.DROP,
        minimumFanTokenRequiredToMint: 1,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      },
      {from}
    );
  }
  async function getLinosAndMarketplace() {
    const linosInstance = await LinosPlatform.new({ from: owner });
    const marketPlaceAddress = await linosInstance.nftMarketPlaceAddress.call({ from: owner });
    const marketPlaceInstance = await NftMarketPlace.at(marketPlaceAddress);
    const nftFactoryAddress = await linosInstance.nftFactoryAddress.call({ from: owner });
    const nftFactoryInstance = await ArtistERC1155Factory.at(nftFactoryAddress);
    return {
        linosInstance,
        marketPlaceInstance,
        nftFactoryInstance
    };
  }

  // describe("Basics", () => {
  //   before(async () => {
  //     instances = await getLinosAndMarketplace();
  //   });

  //   it("...Can register as artist", async () => {
  //     const { linosInstance } = instances;
  //     await linosInstance.registerAsArtist("Orelsan", "ORL", { from: artist });
  //     const artistObj = await linosInstance.getArtist(artist);
  //     const notArtist = await linosInstance.getArtist(addressZero);
  //     expect(artistObj.isRegistered).to.be.true;
  //     expect(notArtist.fanTokenAddress).to.be.equal(addressZero);
  //     expect(artistObj.fanTokenAddress).not.to.be.equal(addressZero);
  //   });

  //   it("...Can't create an nft collection", async () => {
  //     const { nftFactoryInstance } = instances;
  //     await expectRevert(
  //       createNftContract(nftFactoryInstance, owner),
  //       'Not artist',
  //     );
  //   });

  //   it("...Can create an nft collection", async () => {
  //     const { nftFactoryInstance } = instances;
  //     const nftAddress = await createNftContract(nftFactoryInstance, artist);
  //     console.log(nftAddress);
  //   })

  // });

  describe("User - Fan - Mint", () => {
    let nftContract;
    before(async () => {
      instances = await getLinosAndMarketplace();
      const { linosInstance, nftFactoryInstance } = instances;
      await linosInstance.registerAsArtist("Orelsan", "ORL", { from: artist });
      await linosInstance.registerAsUser("David", { from: userLambda });
      const tx = await createNftContractToMint(nftFactoryInstance, artist);
      const nftAddress = tx.logs[0].address;
      console.log("nftAddress", nftAddress);
      nftContract = await ArtistERC1155Token.at(nftAddress);

    });

    it("... Can mint", async () => {
      console.log("nftContract", nftContract.publicMint);
      await nftContract.publicMint(0);
    });

    // it("...Cannot Mint when not fan", async () => {
    //   await expectRevert(
    //     nftContract.PublicMint(0, { from: userLambda }),
    //     'not fan enought',
    //   );
    // });

    // it("...Can Boost an artist and mint", async () => {
    //   const { linosInstance } = instances;
    //   await linosInstance.mintListenToken(userLambda, 100, { from: owner });
    //   await linosInstance.boostArtist(artist, 20, { from: userLambda });
    //   await nftContract.PublicMint(0, { from: userLambda });
    //   const balance = await nftContract.balanceOf(userLambda);

    //   console.log(balance);
    // });
  });

});
