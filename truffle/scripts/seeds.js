/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts:
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const LinosPlatform = artifacts.require("LinosPlatform.sol");
const ListenToken = artifacts.require("./ListenToken.sol");

module.exports = async function (callback) {
  const linosInstance = await LinosPlatform.deployed();
  const accounts = await web3.eth.getAccounts();

  const owner = accounts[0];
  const orelsan = accounts[1];
  const userDavid = accounts[2];

  const listenTokenAddress = await linosInstance.listenTokenAddress.call({ from: owner });
  console.log("listenTokenAddress", listenTokenAddress);
  const listenTokenInstance = await ListenToken.at(listenTokenAddress);

  console.log(accounts);
  console.log("listenTokenInstance address", listenTokenInstance.address);


  try {
    await linosInstance.registerAsArtist("Orelsan", "ORL", { from: orelsan });
    await linosInstance.registerAsUser("David Quenet", { from: userDavid });

    // nftFactoryInstance.createNFTCollection(
    //   "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
    //   "Test ERC1155",
    //   ["TOKEN1", "TOKEN2"],
    //   [11, 22],
    //   {
    //     distributionType: ArtistERC1155Token.DistributionType.DROP,
    //     minimumFanTokenRequiredToMint: 1,
    //     maxTotalMintPerWallet: 0,
    //     maxMintPerWallerPerToken: 0
    //   },
    //   {from}
    // );

  } catch (e) {}

  for (let index = 0; index < accounts.length; index++) {
    const account = accounts[index];
    const listenTokenBalance = await listenTokenInstance.balanceOf(account);
    console.log("ACCOUNT = ", account, listenTokenBalance);
    await linosInstance.mintListenToken(account, Math.round(Math.random()*2000), { from: owner });
  }

  // const nftFactoryAddress = await linosInstance.nftFactoryAddress.call({ from: owner });
  // const nftFactoryInstance = await ArtistERC1155Factory.at(nftFactoryAddress);

  // await nftFactoryInstance.createNFTCollection.call(
  //   "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
  //   "Test NFT Collection DROP",
  //   ["Apple", "Etam", "Nike", "AppleStore"],
  //   [1, 10, 20, 100],
  //   {
  //     distributionType: ArtistERC1155Token.DistributionType.DROP,
  //     minimumFanTokenRequiredToMint: 0,
  //     maxTotalMintPerWallet: 0,
  //     maxMintPerWallerPerToken: 0
  //   },
  //   {from: orelsan}
  // );

  // const resultNft = await nftFactoryInstance.createNFTCollection.call(
  //   "ipfs://bafybeifkrca6zzfn5hggak2jbbjddzwhaj4b3svtwjr4lrzlcisnpb6mpm/linos/{id}",
  //   "Test NFT Collection SELL",
  //   ["Apple", "Etam", "Nike", "AppleStore"],
  //   [1, 10, 20, 100],
  //   {
  //     distributionType: ArtistERC1155Token.DistributionType.SELL,
  //     minimumFanTokenRequiredToMint: 0,
  //     maxTotalMintPerWallet: 0,
  //     maxMintPerWallerPerToken: 0
  //   },
  //   {from: orelsan}
  // );

  // console.log("resultNft", resultNft);

  callback();
};
