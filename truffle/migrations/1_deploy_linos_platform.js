const LinosPlatform = artifacts.require("LinosPlatform.sol");

module.exports = function (deployer) {
  deployer.deploy(LinosPlatform);
};
