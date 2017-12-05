
import UserLocationArtifacts from '../../build/contracts/UserLocation.json'

import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'

class UserLocation {
  constructor (contractManager, options) {

    this.contractManager = contractManager
    this.address = '0x0d8cc4b8d15d4c3ef1d70af0071376fb26b5669b'
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

  getGeohash () {
    return this.UserLocation.methods.getGeohash().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getLongitude () {
    return this.UserLocation.methods.getLongitude().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getLatitude () {
    return this.UserLocation.methods.getLatitude().call()
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
  getLocation () {
    return this.UserLocation.methods.getLocation().call()
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

  /*
   *
   * Events
   *
   */




}

export default UserLocation
