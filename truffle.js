var HDWalletProvider = require("truffle-hdwallet-provider")
var config = require("./secrets")

console.log(config.mnemonic)

module.exports = {
  networks: {
    develop: {
      host: "localhost",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
    kovan: {
        provider: function() {
            return new HDWalletProvider(config.mnemonic, "https://kovan.infura.io/" + config.infura, 0)
        },
        network_id: 42,
        gas: 4700000
    }   
  // },
  // solc: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 200
  //   }
  }
};
