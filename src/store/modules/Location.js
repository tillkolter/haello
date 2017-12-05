import Geohash from 'latlon-geohash'

import { setLocation } from '../../utils/blockchain'
const state = {
  latitude: 13.4050,
  longitude: 52.52,
  geohash: 'u33dc',
  precision: 5
}

const mutations = {
  SET_LOCATION (state, args) {
    state.latitude = args.lat
    state.longitude = args.lon
    state.geohash = args.geohash
  }
}

const actions = {
  setLocation ({ commit, state }, {lat, lon}) {
    let geohash = Geohash.encode(lat, lon, state.precision)
    setLocation(lat, lon, geohash).then(
      (data) => {
        console.log(`lat ${data.lat}, lon ${data.lon}, geohash: ${data.geohash}`)
        commit('SET_LOCATION', data)
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
