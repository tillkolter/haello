import Geohash from 'latlon-geohash'

import { getLocation, getUserLocation, getUsers, setLocation } from '../../utils/blockchain'
const state = {
  longitude: 52.52,
  latitude: 13.4050,
  geohash: 'u33dc',
  precision: 5,
  userLocations: {}
}

const mutations = {
  SET_LOCATION (state, args) {
    state.latitude = args.latitude
    state.longitude = args.longitude
    state.geohash = args.geohash
  },
  ADD_USER_LOCATION (state, args) {
    let userAddress = args.address
    let location = args.location
    state.userLocations[userAddress] = location
    state.userLocations = Object.assign({}, state.userLocations)
  }
}

const actions = {
  setLocation ({ commit, state }, {latitude, longitude}) {
    return new Promise((resolve, reject) => {
      let geohash = Geohash.encode(latitude, longitude, state.precision)
      setLocation(latitude, longitude, geohash).then(
        (data) => {
          commit('SET_LOCATION', data)
        }
      )
      resolve(geohash)
    })
  },
  getLocation ({ commit }, args) {
    let address = args.address
    getLocation(address).then(
      (data) => {
        commit('SET_USER_LOCATION', data)
      }
    )
  },
  getUsers ({ dispatch }, geohash) {
    getUsers(geohash).then(
      (data) => {
        dispatch('getUserLocations', data)
        dispatch('getUserOffers', data)
      }
    )
  },
  getUserLocations ({ dispatch }, data) {
    let uniqueData = data.filter(function (item, pos) {
      return data.indexOf(item) === pos
    })
    for (let address in uniqueData) {
      dispatch('getUserLocation', uniqueData[address])
    }
  },
  getUserLocation ({ commit, getters }, address) {
    console.log('getUserLocation for ' + address)
    getUserLocation(address).then(
      (location) => {
        console.log('retrieved location ' + JSON.stringify(location))
        if (location) {
          if (address === getters.account) {
            commit('SET_LOCATION', location)
          } else {
            commit('ADD_USER_LOCATION', {address: address, location: location})
          }
        }
      }
    )
  }
}

const getters = {
  currentLocation: (state) => {
    return {
      latitude: state.latitude,
      longitude: state.longitude,
      geohash: state.geohash
    }
  },
  geohashPrecision: (state) => {
    return state.precision
  },
  userLocations: (state, getters) => {
    let locations = state.userLocations
    return Object.keys(locations).reduce(function (filtered, key) {
      if (key !== getters.account) filtered[key] = locations[key]
      return filtered
    }, {})
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
