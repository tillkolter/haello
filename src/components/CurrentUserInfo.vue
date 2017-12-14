<template>
  <div class="user-info" v-if="currentUserInfo">
    <div class="user-info__header">
      <template v-if="currentUserInfo.address === account">
        <span>💗 Your Info</span>
      </template>
      <template v-else>
        <span>💙 User Info</span>
      </template>
    </div>
    <div class="user-info__box">
      <strong>Basics</strong>
      <div class="user-info__address">
        <div>Address: {{currentUserInfo.address}}</div>
        <div v-if="currentUserInfo.latitude">
          Location: {{currentUserInfo.latitude.toFixed(5)}}, {{currentUserInfo.longitude.toFixed(5)}}
        </div>
      </div>
    </div>
    <template v-if="currentUserInfo.offer">
      <div class="user-info__box">
        <div class="user-info__offering">
          <div>
            <strong>Offering</strong>
            <div>Type: {{getOfferType(offer)}}</div>
            <div>Value: {{getOfferValue(offer)}} Ether</div>
          </div>
          <template v-if="currentUserInfo.address !== account">
            <template v-if="!offer.applied">
              <div @click="onApply" @touchend.stop.prevent="onApply" class="application apply-btn">
                Apply

              </div>
            </template>
            <template v-else>
              <div class="application offering__pending">Applied</div>
            </template>
          </template>
          <template v-else-if="offer.candidates && offer.candidates.length > 0">
            <div @click="toggleCandidates" @touchend.stop.prevent="toggleCandidates"
                 class="application offering__candidates">{{offer.candidates.length}} applicants
            </div>
          </template>
        </div>
        <div class="user-info__box" v-if="showCandidates">
          <strong>Candidates</strong>
          <div class="candidate" v-for="(candidate, i) in offer.candidates">
            <div class="candidate__info">{{i + 1}}) {{candidate}}</div>
            <div @click="onSelectCandidate(candidate)" @touchend.stop.prevent="onSelectCandidate(candidate)"
                 class="candidate__select">Select
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="margin-top: 8px"></div>
      <em>No current offering</em>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { cashOut, selectCandidate } from '../utils/blockchain'
  export default {
    name: 'CurrentUserInfo',
    data () {
      return {
        showCandidates: false
      }
    },
    computed: {
      ...mapGetters(['account', 'currentUserInfo', 'getOfferValue', 'getOfferType']),
      offer () {
        return this.currentUserInfo.offer
      }
    },
    methods: {
      onApply () {
        this.$store.dispatch('addCandidate', this.currentUserInfo.offer.address)
      },
      toggleCandidates () {
        this.showCandidates = !this.showCandidates
      },
      onSelectCandidate (candidate) {
        selectCandidate(this.offer.address, candidate, this.account).then(
          success => {
            if (success) {
              cashOut(this.offer.address, this.account).then(
                data => {
                  console.log('cashed')
                }
              )
              console.log('cash out function not implemented yet')
            }
          }
        )
      },
      onCashOut () {
        cashOut(this.offer.address, this.account).then(
          data => {
            console.log('cashed')
          }
        )
      }
    }
  }
</script>

<style lang="scss">
  .user-info {
    &__box {
      border: 1px solid #fff;
      padding: 2px;
      margin-top: 8px;
      &:first-child {
        margin-top: 0px;
      }
    }
    &__header {
      font-size: 1rem;
      margin: 4px 0;
      font-weight: bold;
    }
    &__offering {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
    &__address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .application {
    margin: auto 0;
  }

  .apply-btn {
    background-color: lightgreen;
    color: black;
    padding: 4px;
    cursor: pointer;
    width: 60px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 2px;
    margin-left: auto;
    &:hover {
      background-color: darken(lightgreen, 10);
    }
  }

  .offering {
    &__pending {
      background-color: lightblue;
      border-radius: 4px;
      color: black;
      padding: 2px;
    }
    &__candidates {
      cursor: pointer;
      background-color: lightblue;
      color: black;
      border-radius: 4px;
      padding: 2px;
      &:hover {
        background-color: darken(lightblue, 10);
      }
    }
  }

  .candidate {
    display: flex;
    justify-content: space-between;
    &__info {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 8px;
      &:last-child {
        margin-top: inherit;
      }
    }
    &__select {
      background-color: lightgreen;
      color: black;
      padding: 2px;
      cursor: pointer;
      border-radius: 4px;
      margin: 4px;
      &:hover {
        background-color: darken(lightgreen, 20);
      }
    }
  }
</style>
