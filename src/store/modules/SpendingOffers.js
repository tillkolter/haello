import Web3 from 'web3'
import {
  addCandidate, getCandidates,
  getSpendingOffer, getUserSpendingOfferAddress, observeIdentity
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
  },
  'SET_SPENDING_CANDIDATES' (state, {user, address, candidates}) {
    let offer = state.userOffers[user]
    if (offer) {
      offer.candidates = candidates
    }
  }
}

const actions = {
  getIdentity ({commit}) {
    observeIdentity(function (account) {
      commit('SET_IDENTITY', account)
    })
  },
  getUserSpendingOfferAddress ({commit, getters, dispatch}, account) {
    getUserSpendingOfferAddress(account).then(
      data => {
        if (data) {
          console.log(`Found spending offer ${data} for user with address ${account}`)
          dispatch('getSpendingOfferDetails', {address: data, isOwner: account === getters.account})
        }
      }
    )
  },
  getSpendingOfferDetails ({commit, getters}, {address, isOwner}) {
    console.log(`getSpendingOffer details for ${address}`)
    getSpendingOffer(address, getters.account).then(
      offer => {
        console.log(`retrieved spendingOffer details for ${offer}`)
        if (offer.spender === getters.account) {
          commit('SET_SPENDING_OFFER', offer)
        }
        commit('ADD_USER_SPENDING_OFFER', offer)
      }
    )
    if (isOwner) {
      console.log('get candidates')
      getCandidates(address, getters.account).then(
        candidates => {
          commit('SET_SPENDING_CANDIDATES', {user: getters.account, address, candidates})
        }
      )
    }
  },
  getUserOffers ({commit, dispatch}, userAddresses) {
    let uniqueData = userAddresses.filter(function (item, pos) {
      return userAddresses.indexOf(item) === pos
    })
    for (let address in uniqueData) {
      dispatch('getUserSpendingOfferAddress', uniqueData[address])
    }
  },
  addCandidate ({commit, getters}, address) {
    addCandidate(address, getters.account)
  }
}

const getters = {
  currentSpendingOffer: state => state.offer,
  userOffers: state => state.userOffers,
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
