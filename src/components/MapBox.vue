<template>
  <div id="map-box">
    <div id="map"></div>
    <current-user-info v-if="currentUserInfo" class="top-info" ></current-user-info>
    <bottom-button-bar></bottom-button-bar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BottomButtonBar from './BottomButtonBar'
  import CurrentUserInfo from './CurrentUserInfo'

  export default {
    name: 'MapBox',
    components: {CurrentUserInfo, BottomButtonBar},
    data () {
      return {
        map: undefined,
        userMarkers: {}
      }
    },
    computed: {
      ...mapGetters(['currentLocation', 'userLocations', 'account', 'currentUserInfo']),
      geojson () {
        return [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [this.currentLocation.latitude, this.currentLocation.longitude]
            }
          }
        ]
      }
    },
    mounted () {
      let mapboxgl = global.mapboxgl
      mapboxgl.accessToken = 'pk.eyJ1IjoidGtvbHRlciIsImEiOiJjamF0a2QyNDQ2NXVvMnFsbzViNjZxNHliIn0.ySWL6yovTC5oOLBRrLz1GQ'
      let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [this.currentLocation.latitude, this.currentLocation.longitude],
        zoom: 13,
        minZoom: 7
      })
      map.addControl(new mapboxgl.NavigationControl())
      this.map = map
    },
    methods: {
      createMarker ({latitude, longitude}, account) {
        let el = document.createElement('div')
        if (account && account !== this.account) {
          el.className = 'marker foreign'
        } else {
          el.className = 'marker'
        }
        el.addEventListener('click', this.markerClickFunction(account))
        el.addEventListener('touchend', this.markerClickFunction(account))
        return new global.mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map)
      },
      markerClickFunction (account) {
        let vm = this
        return (e) => {
          vm.$store.commit('SET_CURRENT_USER', account)
        }
      }
    },
    watch: {
      currentLocation (value) {
        if (value) {
          this.createMarker(value)

          this.map.easeTo({
            center: [
              value.longitude,
              value.latitude
            ]
          })
        }
      },
      userLocations (locations) {
        for (let address in locations) {
          let location = locations[address]
          if (!this.userMarkers[address]) {
            this.userMarkers[address] = this.createMarker(location, address)
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #map {
    width: 100%;
    height: 500px;
    &-box {
      position: relative;
    }
  }
  .top-info {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 0.9rem;
    background-color: rgba(17, 17, 1, 0.5);
    color: #fff;
    max-width: 280px;
    min-width: 270px;
    padding: 8px;
  }
  .marker {
    mask-image: url('../assets/ic_accessibility_white_48px.svg');
    mask-size: 32px;
    background-color: #de3f6b;
    background-size: cover;
    width: 32px;
    height: 32px;
    cursor: pointer;
    &.foreign {
      background-color: #2e561e;
      &:hover {
        background-color: lighten(#2e561e, 10)
      }
    }
    &:hover {
      background-color: lighten(#de3f6b, 10)
    }
  }
</style>