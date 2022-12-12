const LinosPlatform = artifacts.require("LinosPlatform.sol");
const delay = require("delay");
const ArtistERC1155Token = artifacts.require("./ArtistERC1155Token.sol");
const ArtistERC1155Factory = artifacts.require("./ArtistERC1155Factory.sol");



module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(LinosPlatform);
  const linosInstance = await LinosPlatform.deployed();

  const owner = accounts[0];

  for (let index = 0; index < accounts.length; index++) {
    const account = accounts[index];
    await linosInstance.mintListenToken(account, Math.round(Math.random()*1000), { from: owner });
  }
};
