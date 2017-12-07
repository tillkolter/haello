module.exports = {
  networks: {
    develop: {
      host: "localhost",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 4600000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
