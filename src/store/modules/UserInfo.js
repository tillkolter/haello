import { observeIdentity } from '../../utils/blockchain'
const state = {
  account: undefined,
  currentUserAddress: undefined
}

const mutations = {
  SET_IDENTITY (state, account) {
    state.account = account
  },
  SET_CURRENT_USER (state, address) {
    state.currentUserAddress = address
  }
}

const actions = {
  getIdentity ({commit, dispatch}) {
    observeIdentity(function (account) {
      commit('SET_IDENTITY', account)
      dispatch('getUserSpendingOfferAddress', account)
      dispatch('getUserLocation', account).then(
        location => dispatch('getUsers', location.geohash)
      )
      commit('SET_CURRENT_USER', account)
    })
  }
}

const getters = {
  account: state => state.account,
  currentUserInfo: (state, getters) => {
    let address = state.currentUserAddress
    let currentUserOffer = getters.userOffers[address]
    let location = getters.userLocations[address]
    let userInfo = Object.assign({address: address}, location)
    if (currentUserOffer) {
      userInfo['offer'] = currentUserOffer
    }
    return userInfo
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
