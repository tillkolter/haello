import Web3 from 'web3'
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
    state.userOffers[userAddress] = offer
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
          console.log(`Found spending offer ${data} for user with address ${account}`)
          dispatch('getSpendingOfferDetails', data)
        }
      }
    )
  },
  getSpendingOfferDetails ({commit, getters}, address) {
    console.log(`getSpendingOffer details for ${address}`)
    getSpendingOffer(address).then(
      offer => {
        console.log(`retrieved spendingOffer details for ${offer}`)
        if (offer.spender === getters.account) {
          commit('SET_SPENDING_OFFER', offer)
        }
        commit('ADD_USER_SPENDING_OFFER', offer)
      }
    )
  },
  getUserOffers ({commit, dispatch}, userAddresses) {
    let uniqueData = userAddresses.filter(function (item, pos) {
      return userAddresses.indexOf(item) === pos
    })
    for (let address in uniqueData) {
      dispatch('getUserSpendingOfferAddress', uniqueData[address])
    }
  }
}

const getters = {
  currentSpendingOffer: state => state.offer,
  userOffers: state => state.userOffers,
  currentOfferType: (state, getters) => getters.getOfferType(state.offer),
  getOfferType: (state) => (offer) => {
    if (offer) {
      if (offer.activity === '0') {
        return 'classy drinks'
      } else if (offer.activity === '1') {
        return 'a fantastic meal'
      } else if (offer.activity === '2') {
        return 'club entry'
      }
    }
    return ''
  },
  currentOfferValue: (state, getters) => getters.getOfferValue(state.offer),
  getOfferValue: (state) => (offer) => {
    if (offer) {
      return Web3.utils.fromWei(offer.compensation, 'ether')
    } else {
      return 0
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
