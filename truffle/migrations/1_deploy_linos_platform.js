const LinosPlatform = artifacts.require("LinosPlatform.sol");

const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");
const ArtistERC1155Factory = artifacts.require("./ArtistERC1155Factory.sol");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(LinosPlatform);

  const owner = accounts[0];
  const orelsan = accounts[1];
  const userDavid = accounts[2];
  const linosInstance = await LinosPlatform.deployed();

  await linosInstance.registerAsArtist("Orelsan", "ORL", { from: orelsan });
  await linosInstance.registerAsUser("David Quenet", { from: userDavid });

  const nftFactoryAddress = await linosInstance.nftFactoryAddress.call({ from: owner });
  const nftFactoryInstance = await ArtistERC1155Factory.at(nftFactoryAddress);

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

  console.log("resultNft", resultNft);
};
