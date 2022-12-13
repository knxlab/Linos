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
  const toAccounts = [
    ...accounts,
    "0x11F3a11a83871BcAc3a5c031f5CE923b0E5f7D6B",
    "0x97F0B7312D15B616Bc5B5629Ba865bfD3f400f0b"
  ]

  const listenTokenAddress = await linosInstance.listenTokenAddress.call({ from: owner });
  console.log("listenTokenAddress", listenTokenAddress);
  const listenTokenInstance = await ListenToken.at(listenTokenAddress);

  console.log(toAccounts);

  for (let index = 0; index < toAccounts.length; index++) {
    const account = toAccounts[index];
    await linosInstance.mintListenToken(account, Math.round(Math.random()*2000), { from: owner });
    const listenTokenBalance = await listenTokenInstance.balanceOf(account);
    console.log("ACCOUNT = ", account, listenTokenBalance);
  }

  callback();
};
