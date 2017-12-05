var CheersContract = artifacts.require("./CheersContract.sol");

module.exports = function(deployer, helper, accounts) {
  return deployer.deploy(CheersContract)
}