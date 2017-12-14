var UserLocation = artifacts.require("./UserLocation.sol");
var Owned = artifacts.require("./Owned.sol");

module.exports = function(deployer, helper, accounts) {
  deployer.deploy(Owned);
  deployer.deploy(UserLocation);
  deployer.link(Owned, UserLocation);
}