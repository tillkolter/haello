
import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'
import contracts from './contracts'

class ContractManager {
  constructor (options) {
    this.web3 = null
    this.pollingInterval = null
    this.account = null
    this.unlocked = false
    this.balanceWei = 0
    this.balance = 0
    this.genesisBlock = 0
    this.loading = false
    this.options = {
      autoInit: true,
      connectionRetries: 3
    }
    this.identityObservers = []

    Object.assign(this.options, options)
    if (this.options.autoInit) this.initWeb3()
  }

  /*
   * Connect
   */

  initWeb3 () {
    return new Promise((resolve, reject) => {

      let web3Provider = false
      let idManager;
      if (process.env.NODE_ENV === 'production') {
        idManager = new IdManagerProvider()
      } else {
        idManager = new IdManagerProvider({
          rpcUrl: 'http://localhost:9545/',
          skipSecurity: true

        })
      }

      idManager.checkIdManager().then((idManagerPresent)=>{
        // check for aedentity app
        if (idManagerPresent) {
          web3Provider = idManager.web3.currentProvider

          // check for metamask
        } else if (global.web3) {
          web3Provider = web3.currentProvider

          // attempt to try again if no aedentity app or metamask
        } else if (this.options.connectionRetries > 0){
          this.options.connectionRetries -= 1
          setTimeout(() => {
            this.initWeb3().then(resolve).catch((error) => {
              reject(new Error(error))
            })
          }, 1000)
          // revert to a read only version using infura endpoint
        } else {
          this.readOnly = true
          web3Provider = ZeroClientProvider({
            getAccounts: function(){},
            rpcUrl: 'https://mainnet.infura.io',
            // rpcUrl: 'https://testnet.infura.io',
            // rpcUrl: 'https://rinkeby.infura.io',
            // rpcUrl: 'https://kovan.infura.io',
          })
        }

        if (web3Provider) {
          global.web3 = new Web3(web3Provider)
          this.web3 = new Web3(web3Provider)
          this.startChecking()

          if (this.options.getPastEvents) this.getPastEvents()
          if (this.options.watchFutureEvents) this.watchFutureEvents()
        }
      })
    })
  }

  /*
   * Check every second for switching network or wallet
   */

  startChecking () {
    if (this.pollingInterval) clearInterval(this.pollingInterval)
    this.getGenesisBlock()
      .then(() => {
        this.pollingInterval = setInterval(this.check.bind(this), 1000)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  check () {
    this.checkNetwork()
      .then(this.checkAccount.bind(this))
      .catch((error) => {
        console.error(error)
        throw new Error(error)
      })
  }

  checkNetwork () {
    return global.web3.eth.net.getId((err, netId) => {
      if (err) console.error(err)
      if (!err && this.network !== netId) {
        this.network = netId
        return this.deployContracts()
      }
    })
  }

  deployContracts () {
    for (const contract in contracts) {
      if (contracts.hasOwnProperty(contract)) {
        this[contract] = new contracts[contract](this)
      }
    }
  }

  checkAccount () {
    return global.web3.eth.getAccounts((error, accounts) => {
      if (error) throw new Error(error)
      if (accounts.length && this.account !== accounts[0]) {
        this.unlocked = true
        this.account = accounts[0]

        for (let i in this.identityObservers) {
          this.identityObservers[i](this.account)
        }

      } else if (!accounts.length) {
        this.unlocked = false
        this.account = null
      }
    })
  }


  /*
   * Not Yet Implemented vvvv
   */

  getGenesisBlock () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  addIdentityObserver (observer) {
    this.identityObservers.push(observer)
    if (this.address) {
      observer(this.account)
    }
  }

}

export default ContractManager
