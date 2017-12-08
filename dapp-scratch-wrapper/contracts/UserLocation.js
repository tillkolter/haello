
import UserLocationArtifacts from '../../build/contracts/UserLocation.json'

import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'

class UserLocation {
  constructor (contractManager, options) {

    this.contractManager = contractManager
    this.address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10'
    this.genesisBlock = 0
    this.options = {
      getPastEvents: false,
      watchFutureEvents: false
    }
    Object.assign(this.options, options)

    if (!this.address || this.address === 'REPLACE_WITH_CONTRACT_ADDRESS') return new Error('Please provide a contract address')
    this.UserLocation = new global.web3.eth.Contract(UserLocationArtifacts.abi, this.address)

  }

  // hello world : )
  helloWorld () {
    console.log('hello world!')
  }

  /*
   * Not Yet Implemented vvvv
   */

  getGenesisBlock () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  getPastEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  watchFutureEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }




  /*
   *
   * Constant Functions
   *
   */

  getUserLocation (user) {
    return this.UserLocation.methods.getUserLocation(user).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getUsers (geohash) {
    return this.UserLocation.methods.getUsers(geohash).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getSpendingOffer (_owner) {
    return this.UserLocation.methods.getSpendingOffer(_owner).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  owner () {
    return this.UserLocation.methods.owner().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  isSpending (_owner) {
    return this.UserLocation.methods.isSpending(_owner).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getLocation () {
    return this.UserLocation.methods.getLocation().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  hasLocation (userAddress) {
    return this.UserLocation.methods.hasLocation(userAddress).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }

  /*
   *
   * Transaction Functions
   *
   */

  setSpendingOffer (contractAddress) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.UserLocation.methods.setSpendingOffer(contractAddress).send({from: this.contractManager.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  setLocation (latitude, longitude, geohash) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.UserLocation.methods.setLocation(latitude, longitude, geohash).send({from: this.contractManager.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  kill () {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.UserLocation.methods.kill().send({from: this.contractManager.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  deleteLocation () {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.UserLocation.methods.deleteLocation().send({from: this.contractManager.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }

  /*
   *
   * Events
   *
   */




}

export default UserLocation
