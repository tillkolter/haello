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
          <img :src="option" />
        </div>
      </div>
      <div :class="['btn', spending ? 'active': '']" id="spender-btn">
        <img @click="openMenu" @touchend.stop.prevent="openMenu" :src="spenderButton" />
      </div>
    </div>
    <div>
      <input v-model="spendingBudget" :class="['spending-budget', spending ? 'active': '']" type="number"/>
    </div>
  </div>
</template>

<script>
  const drinks = require('../../assets/if_champagne_glasses_1_811448.svg')
  const spendingTypes = [
    drinks,
    require('../../assets/if_2_1845738.svg'),
    require('../../assets/if_sound_speaker_811460.svg')
  ]

  export default {
    name: 'SpenderButton',
    data () {
      return {
        spenderButton: drinks,
        showOptions: false,
        spending: false,
        spendingBudget: null
      }
    },
    computed: {
      spendingOptions () {
        let vm = this
        return spendingTypes.filter(function (x) {
          return x !== vm.spenderButton
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
      }
    },
    methods: {
      openMenu () {
        this.showOptions = true
      },
      hideMenu () {
        this.showOptions = false
      },
      selectOption (option) {
        this.spenderButton = option
        this.showOptions = false
        this.spending = true
      },
      cancelSpending () {
        this.spending = false
        this.spendingBudget = null
        this.showOptions = false
      }
    }
  }
</script>

<style lang="scss">
  #spender-btns {
    margin-left: 16px;
    display: flex;
  }
  #spender-btn {
    background-color: #2e561e;
    opacity: 0.4;
    z-index: 2;
    &.active {
      opacity: 1;
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
</style>
