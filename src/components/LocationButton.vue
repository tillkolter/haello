<template>
  <div id="location-btn" @click="getGeolocation" @touchend="getGeolocation">
    <img src="../assets/ic_location_searching_white_48px.svg"/>
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
                lat: parseFloat(position.coords.latitude).toFixed(5),
                lon: parseFloat(position.coords.longitude).toFixed(5)
              }
            )
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  #location-btn {
    cursor: pointer;
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: 16px;
    right: 16px;
    width: 72px;
    height: 72px;
    border-radius: 36px;
    background-color: #de3f6b;
    &:hover {
      background-color: darken(#de3f6b, 10);
    }
  }
</style>