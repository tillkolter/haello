
import CheersContractArtifacts from '../../build/contracts/CheersContract.json'

import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'

class CheersContract {
  constructor (contractManager, options) {

    this.contractManager = contractManager
    this.address = '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f'
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

  getCandidates () {
    return this.CheersContract.methods.getCandidates().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
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
  activity () {
    return this.CheersContract.methods.activity().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  maxCandidates () {
    return this.CheersContract.methods.maxCandidates().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getCandidatesCount () {
    return this.CheersContract.methods.getCandidatesCount().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  firstContactBudget () {
    return this.CheersContract.methods.firstContactBudget().call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  isCandidate (userAddress) {
    return this.CheersContract.methods.isCandidate(userAddress).call()
      .then((resp) => {
      console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  spender () {
    return this.CheersContract.methods.spender().call()
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
  setActivity (_activity) {
    if (!this.contractManager.account) return new Error('Unlock Wallet')
    return this.CheersContract.methods.setActivity(new BN(_activity, 10)).send({from: this.contractManager.account})
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
