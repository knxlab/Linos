const LinosPlatform = artifacts.require("LinosPlatform.sol");
const delay = require("delay");
const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");
const ArtistERC1155Factory = artifacts.require("./ArtistERC1155Factory.sol");



module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(LinosPlatform);
  const linosInstance = await LinosPlatform.deployed();

  const owner = accounts[0];

  const seedAccounts = [
    "0xbc5A3940775374568227884b5Cb1F50d4823212E",
    "0x55840eE140F60DA31D29De1f9e0Da8b46106A6fC"
  ]

  for (let index = 0; index < seedAccounts.length; index++) {
    const account = accounts[index];
    await linosInstance.mintListenToken(account, Math.round(Math.random()*1000), { from: owner });
  }
};
