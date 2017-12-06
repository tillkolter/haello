import web3 from 'web3'
import ContractManager from '../../dapp-scratch-wrapper'

let contractManager = new ContractManager()

export const setLocation = (latitude, longitude, geohash) => new Promise((resolve, reject) => {
  contractManager.UserLocation.setLocation(web3.utils.fromAscii(latitude.toString()), web3.utils.fromAscii(longitude.toString()), geohash).then(() => {
    let lat = latitude.toString()
    let lon = longitude.toString()
    console.log(`getLocation returns ${lat}, ${lon}, ${location[2]}`)
    resolve({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      geohash: geohash
    })
    // return contractManager.UserLocation.getLocation().then((location) => {
    // })
  })
})
