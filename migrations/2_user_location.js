var UserLocation = artifacts.require("./UserLocation.sol");

module.exports = function(deployer, helper, accounts) {
  return deployer.deploy(UserLocation)
}