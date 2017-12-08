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
    <div class="user-info__basic">
      <strong>Basics</strong>
      <div class="user-info__address">
        <div>Address: {{currentUserInfo.address}}</div>
        <div v-if="currentUserInfo.latitude">Location: {{currentUserInfo.latitude.toFixed(5)}}, {{currentUserInfo.longitude.toFixed(5)}}</div>
      </div>
    </div>
    <template v-if="currentUserInfo.offer">
      <div class="user-info__offering">
        <div>
          <strong>Offering</strong>
          <div>Type: {{getOfferType(offer)}}</div>
          <div>Value: {{getOfferValue(offer)}} Ether</div>
        </div>
        <template v-if="currentUserInfo.address !== account">
          <template v-if="!offer.applied">
            <div  @click="onApply" @touchend="onApply" class="apply-btn">
              Apply
            </div>
          </template>
          <template v-else>
            <div class="offering__pending">Applied</div>
          </template>
        </template>
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
  export default {
    name: 'CurrentUserInfo',
    computed: {
      ...mapGetters(['account', 'currentUserInfo', 'getOfferValue', 'getOfferType']),
      offer () {
        return this.currentUserInfo.offer
      }
    },
    methods: {
      onApply () {
        this.$store.dispatch('addCandidate', this.currentUserInfo.offer.address)
      }
    }
  }
</script>

<style lang="scss">
  .user-info {
    &__header {
      font-size: 1rem;
      margin: 4px 0;
      font-weight: bold;
    }
    &__basic {
      border: 1px solid #fff;
      padding: 2px;
    }
    &__offering {
      margin-top: 8px;
      border: 1px solid #fff;
      padding: 2px;
      display: flex;
      justify-content: space-between;
    }
    &__address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .apply-btn {
    height: 32px;
    line-height: 32px;
    margin: auto 0;
    background-color: lightgreen;
    color: black;
    padding: 4px;
    cursor: pointer;
    &:hover {
      background-color: darken(lightgreen, 10);
    }
  }
  .offering {
    &__pending {
      margin: auto 0;
      background-color: lightblue;
      border-radius: 4px;
      color: black;
      padding: 2px;
    }
  }
</style>
