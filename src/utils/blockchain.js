import web3 from 'web3'
import ContractManager from '../../dapp-scratch-wrapper'

let contractManager = new ContractManager()

export const setLocation = (latitude, longitude, geohash) => new Promise((resolve, reject) => {
  contractManager.UserLocation.setLocation(web3.utils.fromAscii(latitude.toString()), web3.utils.fromAscii(longitude.toString()), geohash).then(() => {
    return contractManager.UserLocation.getLocation().then((location) => {
      let lat = web3.utils.toAscii(location[0]).replace('/\0/g', '')
      let lon = web3.utils.toAscii(location[1]).replace('/\0/g', '')
      console.log(`getLocation returns ${lat}, ${lon}, ${location[2]}`)
      resolve({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        geohash: location[2]
      })
    })
  })
})
