import web3 from 'web3'
import ContractManager from '../../dapp-scratch-wrapper'

let contractManager = new ContractManager()

export const setLocation = (latitude, longitude, geohash) => new Promise((resolve, reject) => {
  contractManager.UserLocation.setLocation(
    web3.utils.fromAscii(latitude.toString()),
    web3.utils.fromAscii(longitude.toString()),
    web3.utils.fromAscii(geohash)
  ).then(() => {
    return contractManager.UserLocation.getLocation().then((location) => {
      let lat = web3.utils.toAscii(location[0]).replace('/\0/g', '')
      let lon = web3.utils.toAscii(location[1]).replace('/\0/g', '')
      resolve({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
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
  console.log(`Get User for geohash: ${geohash}`)
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
  contractManager.UserLocation.getUserLocation(address).then((data) => {
    resolve(parseLocation(data))
  })
})

export const parseLocation = (data) => {
  let lat = web3.utils.toAscii(data[0]).replace('/\0/g', '')
  let lon = web3.utils.toAscii(data[1]).replace('/\0/g', '')
  let geohash = web3.utils.toAscii(data[2]).replace('/\0/g', '')
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    geohash: geohash
  }
}

export const observeIdentity = (fun) => {
  contractManager.addIdentityObserver(fun)
}
