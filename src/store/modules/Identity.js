import { observeIdentity } from '../../utils/blockchain'
const state = {
  account: undefined
}

const mutations = {
  'SET_IDENTITY' (state, account) {
    state.account = account
  }
}

const actions = {
  getIdentity ({commit, dispatch}) {
    observeIdentity(function (account) {
      commit('SET_IDENTITY', account)
      dispatch('getUserSpendingOfferAddress', account)
      dispatch('getUserLocation', account)
    })
  }
}

const getters = {
  account: state => state.account
}

export default {
  state,
  mutations,
  actions,
  getters
}
