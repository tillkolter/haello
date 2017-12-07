import Geohash from 'latlon-geohash'

import { getLocation, getUserLocation, getUsers, setLocation } from '../../utils/blockchain'
const state = {
  latitude: 13.4050,
  longitude: 52.52,
  geohash: 'u33dc',
  precision: 5,
  userLocations: {}
}

const mutations = {
  SET_LOCATION (state, args) {
    state.latitude = args.lat
    state.longitude = args.lon
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
  setLocation ({ commit, state }, {lat, lon}) {
    let geohash = Geohash.encode(lat, lon, state.precision)
    setLocation(lat, lon, geohash).then(
      (data) => {
        commit('SET_LOCATION', data)
      }
    )
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
      }
    )
  },
  getUserLocations ({ dispatch }, data) {
    let uniqueData = data.filter(function (item, pos) {
      return data.indexOf(item) === pos
    })
    for (let address in uniqueData) {
      dispatch('getUserLocation', data[address])
    }
  },
  getUserLocation ({ commit }, address) {
    getUserLocation(address).then(
      (location) => {
        commit('ADD_USER_LOCATION', {address: address, location: location})
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
    return state.userLocations.filter((user) => {
      return user.address !== getters.account
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
