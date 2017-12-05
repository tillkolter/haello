var UserLocation = artifacts.require("./UserLocation.sol");
var StringUtils = artifacts.require("./stringUtils.sol");

module.exports = function(deployer, helper, accounts) {
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, UserLocation);
  return deployer.deploy(UserLocation)
}