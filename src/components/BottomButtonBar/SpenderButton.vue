<template>
  <div id="spender-btns">
    <div>
      <div v-if="showOptions" class="spending-options">
        <div @click="hideMenu" @touchend.stop.prevent="hideMenu" class="btn cancel-btn">
          <img src="../../assets/if_cancel_1303884.svg" />
        </div>
        <div v-if="spending" @click="cancelSpending" @touchend.stop.prevent="cancelSpending" class="btn cancel-btn">
          <img src="../../assets/if_icon-ios7-minus-outline_211774.svg" />
        </div>
        <div class="btn" @click="selectOption(option)" v-for="option in spendingOptions">
          <img :src="getIconUrl(option)" />
        </div>
      </div>
      <div :class="['btn', spending ? 'active': '']" id="spender-btn">
        <img @click="openMenu" @touchend.stop.prevent="openMenu" :src="getIconUrl(currentIndex)" />
      </div>
    </div>
  </div>
</template>

<script>
  import Web3 from 'web3'
  import { createCheersContract, updateActivity } from '../../utils/blockchain'
  import { mapGetters } from 'vuex'

  const BN = Web3.utils.BN
  const spendingTypes = {
    0: require('../../assets/if_champagne_glasses_1_811448.svg'),
    1: require('../../assets/if_2_1845738.svg'),
    2: require('../../assets/if_sound_speaker_811460.svg')
  }

  export default {
    name: 'SpenderButton',
    data () {
      return {
        currentIndex: '0',
        showOptions: false,
        spending: false,
        spendingBudget: null
      }
    },
    computed: {
      ...mapGetters(['currentSpendingOffer']),
      spendingOptions () {
        let vm = this
        return Object.keys(spendingTypes).filter(function (x) {
          return x !== vm.currentIndex
        })
      }
    },
    watch: {
      spendingBudget (value) {
        if (value && value > 0) {
          this.spending = true
        } else {
          this.spending = false
        }
      },
      currentSpendingOffer (offer) {
        this.currentIndex = offer.activity
        this.spending = true
      }
    },
    methods: {
      openMenu () {
        this.showOptions = true
      },
      hideMenu () {
        this.showOptions = false
      },
      selectOption (activityIndex) {
        this.currentIndex = activityIndex
        this.showOptions = false
        this.spending = true

        if (!this.currentSpendingOffer) {
          // For now the contact reward and max candidates are hard coded
          let maxCandidates = 10
          let reward = 10000
          let initialBalance = new BN(1000000000, 10)
          let data = {
            maxCandidates: maxCandidates,
            firstContactReward: reward,
            activity: parseInt(activityIndex),
            initialBalance: initialBalance
          }
          createCheersContract(data).then(
            contract => {
              console.log('created contract ' + contract)
            }
          )
        } else {
          updateActivity(this.currentSpendingOffer.address, activityIndex).then(
            () => {
              let newOffer = Object.assign({}, this.currentSpendingOffer, {activity: parseInt(activityIndex)})
              this.$store.commit('SET_SPENDING_OFFER', newOffer)
            }
          )
        }
      },
      cancelSpending () {
        this.spending = false
        this.spendingBudget = null
        this.showOptions = false
      },
      getIconUrl (index) {
        return spendingTypes[index]
      },
      getOfferText (index) {
        if (index === '0') {
          return 'classy drinks'
        } else if (index === '1') {
          return 'a fantastic meal'
        } else if (index === '2') {
          return 'club entry'
        }
        return ''
      }
    }
  }
</script>

<style lang="scss">
  #spender-btns {
    margin-left: 16px;
    display: flex;
    /*pointer-events : none;*/
    &:hover {
      #spender-btn {
        background-color: lighten(#2e561e, 5);
      }
    }
  }
  #spender-btn {
    background-color: #2e561e;
    opacity: 0.4;
    z-index: 2;
    &.active {
      opacity: 1;
    }
    &:hover {
      background-color: lighten(#2e561e, 5);
    }
  }
  .spending-options {
    position: absolute;
    padding-bottom: 80px;
    bottom: 0px;
    background-color: #2e561e;
    border-radius: 36px;
    opacity: 0.6;
    &.active {
      opacity: 1;
    }
  }
  .cancel-btn {
    svg {
      fill: #fff;
    }
    img {
      max-width: 32px;
      max-height: 32px;
    }
  }
  .spending-budget {
    position: absolute;
    padding: 0 10px;
    width: 64px;
    bottom: 0;
    height: 32px;
    margin-bottom: 1px;
    margin-left: 12px;
    opacity: 0.7;
    &.active{
      opacity: 1;
    }
  }
  .spending-info {
    background-color: black;
    opacity: 0.5;
    padding: 4px;
    font-size: .8rem;
    color: white;
    max-width: 140px;
    margin: 0 16px
  }
</style>
