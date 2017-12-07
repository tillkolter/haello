import {
  getSpendingOffer, getUserSpendingOfferAddress, observeIdentity,
  setSpendingOffer
} from '../../utils/blockchain'
const state = {
  offer: undefined,
  userOffers: {}
}

const mutations = {
  'SET_SPENDING_OFFER' (state, offer) {
    state.offer = offer
  },
  'ADD_USER_SPENDING_OFFER' (state, offer) {
    let userAddress = offer.spender
    let location = offer.location
    state.userOffers[userAddress] = location
    state.userOffers = Object.assign({}, state.userOffers)
  }
}

const actions = {
  getIdentity ({commit}) {
    observeIdentity(function (account) {
      commit('SET_IDENTITY', account)
    })
  },
  setSpendingOffer ({commit}, offer) {
    setSpendingOffer(offer.options.address)
  },
  getUserSpendingOfferAddress ({commit, dispatch}, account) {
    getUserSpendingOfferAddress(account).then(
      data => {
        if (data) {
          getSpendingOffer(data).then(
            offer => {
              commit('SET_SPENDING_OFFER', offer)
            }
          )
        }
      }
    )
  },
  getSpendingOffer ({commit, getters}, address) {
    getSpendingOffer(address).then(
      offer => {
        if (offer.spender === getters.account) {
          commit('SET_SPENDING_OFFER')
        } else {
          commit('ADD_USER_SPENDING_OFFER')
        }
      }
    )
  },
  getUserOffers ({commit, dispatch}, userAddresses) {
    let uniqueData = userAddresses.filter(function (item, pos) {
      return userAddresses.indexOf(item) === pos
    })
    for (let address in uniqueData) {
      dispatch('getSpendingOffer', uniqueData[address])
    }
  }
}

const getters = {
  currentSpendingOffer: state => state.offer,
  userOffers: state => state.userOffers
}

export default {
  state,
  mutations,
  actions,
  getters
}
