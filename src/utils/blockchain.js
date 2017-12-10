import web3 from 'web3'

import ContractManager from '../../dapp-scratch-wrapper'
import CheersContractArtifacts from '../../build/contracts/CheersContract.json'

let contractManager = new ContractManager()

export const setLocation = (latitude, longitude, geohash) => new Promise((resolve, reject) => {
  contractManager.UserLocation.setLocation(
    web3.utils.fromAscii(latitude.toString()),
    web3.utils.fromAscii(longitude.toString()),
    web3.utils.fromAscii(geohash)
  ).then(() => {
    return contractManager.UserLocation.getUserLocation(contractManager.account).then((location) => {
      let lat = web3.utils.toAscii(location[0]).replace('/\0/g', '')
      let lon = web3.utils.toAscii(location[1]).replace('/\0/g', '')

      resolve({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        geohash: web3.utils.toAscii(location[2]).replace('/\0/g', '')
      })
    })
  })
})

export const getLocation = (address) => new Promise((resolve, reject) => {
  contractManager.UserLocation.getLocation(address).then((data) => {
    resolve(parseLocation(data))
  })
})

export const getUsers = (geohash) => new Promise((resolve, reject) => {
  contractManager.UserLocation.getUsers(web3.utils.fromAscii(geohash)).then((data) => {
    resolve(data)
  })
})

export const deleteLocation = () => {
  contractManager.UserLocation.deleteLocation().then((data) => {
    console.log(`Deleted ${data}`)
  })
}

export const getUserLocation = (address) => new Promise((resolve, reject) => {
  console.log('getUserLocation for address ' + address)
  contractManager.UserLocation.getUserLocation(address).then((data) => {
    resolve(parseLocation(data))
  })
})

export const parseLocation = (data) => {
  if (data) {
    let lat = web3.utils.toAscii(data[0]).replace('/\0/g', '')
    let lon = web3.utils.toAscii(data[1]).replace('/\0/g', '')
    let geohash = web3.utils.toAscii(data[2]).replace('/\0/g', '')
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      geohash: geohash
    }
  }
  return undefined
}

export const createCheersContract = (options, transactionCallback, confirmationCallback, receiptCallback) => new Promise((resolve, reject) => {
  let maxCandidates = options.maxCandidates
  let initialBalance = options.initialBalance
  let activity = options.activity
  let firstContactReward = options.firstContactReward
  if (!transactionCallback) {
    transactionCallback = function (transactionHash) {}
  }
  if (!confirmationCallback) {
    confirmationCallback = function (confirmationNumber, receipt) {}
  }
  if (!receiptCallback) {
    receiptCallback = function (receipt) {}
  }
  let data = CheersContractArtifacts.bytecode
  let params = [maxCandidates, firstContactReward, activity]
  let estimateGas = global.web3.eth.estimateGas(arguments, {data: data})
  let estimateGasPrice = global.web3.eth.getGasPrice()
  Promise.all([estimateGas, estimateGasPrice])
    .then(([gasEstimate, gasPrice]) => {
      contractManager.CheersContract.CheersContract.deploy({
        data: data,
        arguments: params
      }).send({
        from: contractManager.account,
        // something seems wrong with the current gas estimation or I am just too stupid
        // so I fix it for now with a high (but not too high) enough number
        gas: 2000000,
        gasPrice: 10000000,
        value: initialBalance
        // gas: gasEstimate,
        // gasPrice: gasPrice
      }, function (error, transactionHash) {
        if (error) {
          console.error('The contract could not be created. Please make sure ' +
            'that you send enough ether to the contract. It has to be at ' +
            'least one more than the contact reward times the maximum candidates')
        }
      })
        .on('error', function (error) {
          reject(error)
        })
        .on('transactionHash', transactionCallback)
        .on('receipt', receiptCallback)
        .on('confirmation', confirmationCallback)
        .then(function (newContractInstance) {
          resolve(newContractInstance) // instance with the new contract address
        })
    })
})

export const updateActivity = (address, activity) => new Promise((resolve, reject) => {
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, address)
  contract.methods.setActivity(activity).then(() => resolve())
})

export const observeIdentity = (fun) => {
  contractManager.addIdentityObserver(fun)
}

export const setSpendingOffer = (address) => new Promise((resolve, reject) => {
  contractManager.UserLocation.setSpendingOffer(address).then(
    success => {
      resolve(success)
    }
  ).catch(
    (error) => {
      console.error('Bad error' + error)
    }
  )
})

export const getSpendingOffer = (address, sender) => new Promise((resolve, reject) => {
  console.log(`get details on spending offer for user ${sender}`)
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, address)
  let getCompensation = contract.methods.getCompensation().call()
  let getSpender = contract.methods.spender().call()
  let getActivity = contract.methods.activity().call()
  let getIsCandidate = contract.methods.isCandidate(sender).call({from: sender})
  let getIsOpen = contract.methods.isOpen().call()

  console.log('getIsCandidate ' + sender)

  Promise.all([
    getCompensation,
    getSpender,
    getActivity,
    getIsCandidate,
    getIsOpen
  ]).then(function ([compensation, spender, activity, isCandidate, isOpen]) {
    resolve({
      address: address,
      compensation: compensation,
      spender: spender,
      activity: activity,
      applied: isCandidate,
      open: isOpen
    })
  })
})

export const getUserSpendingOfferAddress = (address) => new Promise((resolve, reject) => {
  contractManager.UserLocation.getSpendingOffer(address)
    .then(data => resolve(data))
    .catch(error => {
      if (error) {
        console.error('Bad Error ' + error)
      }
    })
})

export const addCandidate = (contractAddress, userAddress) => new Promise((resolve, reject) => {
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, contractAddress)
  console.log('addCandidate ' + userAddress)
  contract.methods.addCandidate(userAddress)
    .send({
      from: userAddress,
      gas: 2000000,
      gasPrice: 10000000
    }).on('transactionHash', (hash) => {
      console.log(hash)
    }).then(
    (success) => {
      console.log('success')
    }
  )
})

export const getCandidates = (contractAddress, sender) => new Promise((resolve, reject) => {
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, contractAddress)
  contract.methods.getCandidates().call({from: sender})
    .then(resp => resolve(resp))
    .catch((err) => {
      console.error(err)
    })
})

export const selectCandidate = (contractAddress, candidate, sender) => new Promise((resolve, reject) => {
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, contractAddress)

  contract.methods.addProfiteer(candidate).send({from: sender})
    .then(resp => resolve(resp))
    .catch((err) => {
      console.error(err)
    })
})

export const cashOut = (contractAddress, sender) => new Promise((resolve, reject) => {
  let contract = new global.web3.eth.Contract(CheersContractArtifacts.abi, contractAddress)

  contract.methods.cashOut().send({from: sender})
    .on('transactionHash', (hash) => console.log('cashOut hash: ' + hash))
    .then(resp => resolve(resp))
    .catch((err) => {
      console.error(err)
    })
})
