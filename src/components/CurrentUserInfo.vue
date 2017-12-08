<template>
  <div class="user-info" v-if="currentUserInfo">
    <div class="user-info__header">
      <template v-if="currentUserInfo.address === account">
        <span>Your Info</span>
      </template>
      <template v-else>
        <span>User Info</span>
      </template>
    </div>
    <div class="user-info__basic">
      <strong>Basics</strong>
      <div class="user-info__address">
        <div>Address: {{currentUserInfo.address}}</div>
        <div>Location: {{currentUserInfo.latitude.toFixed(5)}}, {{currentUserInfo.longitude.toFixed(5)}}</div>

      </div>
    </div>
    <template v-if="currentUserInfo.offer">
      <div class="user-info__offering">
        <strong>Offering</strong>
        <div>
          Type: {{getOfferType(currentUserInfo.offer)}}

        </div>
        <div>
          Value: {{getOfferValue(currentUserInfo.offer)}} Ether

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
  export default {
    name: 'CurrentUserInfo',
    computed: {
      ...mapGetters(['account', 'currentUserInfo', 'getOfferValue', 'getOfferType'])
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
    }
    &__address {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
