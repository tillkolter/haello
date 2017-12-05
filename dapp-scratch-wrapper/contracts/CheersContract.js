
import CheersContractArtifacts from '../../build/contracts/CheersContract.json'

import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'

class CheersContract {
  constructor (contractManager, options) {

    this.contractManager = contractManager
    this.address = '0x27e622dc2888fc99ab9438a59ae30089e3556998'
    this.genesisBlock = 0
    this.options = {
      getPastEvents: false,
      watchFutureEvents: false
    }
    Object.assign(this.options, options)

    if (!this.address || this.address === 'REPLACE_WITH_CONTRACT_ADDRESS') return new Error('Please provide a contract address')
    this.CheersContract = new global.web3.eth.Contract(CheersContractArtifacts.abi, this.address)

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

  getCompensation () {
    return this.CheersContract.methods.getCompensation().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  isOpen () {
    return this.CheersContract.methods.isOpen().call()
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

  addCandidate (candidate) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.CheersContract.methods.addCandidate(candidate).send({from: this.contractManager.account})
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
    return this.CheersContract.methods.kill().send({from: this.contractManager.account})
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
  cashOut () {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.CheersContract.methods.cashOut().send({from: this.contractManager.account})
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
  setActivities (_activities) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.CheersContract.methods.setActivities(new BN(_activities, 10)).send({from: this.contractManager.account})
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
  addProfiteer (_profiteer) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.CheersContract.methods.addProfiteer(_profiteer).send({from: this.contractManager.account})
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

export default CheersContract
