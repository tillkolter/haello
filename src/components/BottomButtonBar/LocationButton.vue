<template>
  <div class="btn" id="location-btn" @click="getGeolocation" @touchend.stop.prevent="getGeolocation">
    <img src="../../assets/ic_location_searching_white_48px.svg"/>
  </div>
</template>

<script>
  export default {
    name: 'LocationButton',
    methods: {
      getGeolocation () {
        let vm = this
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            vm.$store.dispatch(
              'setLocation',
              {
                latitude: parseFloat(position.coords.latitude).toFixed(5),
                longitude: parseFloat(position.coords.longitude).toFixed(5)
              }
            ).then((geohash) => {
              vm.$store.dispatch('getUsers', geohash)
            })
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  #location-btn {
    margin-right: 16px;
    z-index: 2;
    background-color: #de3f6b;
    &:hover {
      background-color: darken(#de3f6b, 10);
    }
  }
</style>