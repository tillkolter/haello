<template>
  <div id="map-box">
    <div id="map"></div>
    <div class="current-location">
      <div>Lat:&nbsp;{{currentLocation.latitude}}, Lon:&nbsp;{{currentLocation.longitude}}</div>
      <div>Hash:&nbsp;{{currentLocation.geohash}} (Precision: {{geohashPrecision}})</div>
    </div>
    <bottom-button-bar></bottom-button-bar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BottomButtonBar from './BottomButtonBar'

  export default {
    name: 'MapBox',
    components: {BottomButtonBar},
    data () {
      return {
        map: undefined,
        userMarkers: {}
      }
    },
    computed: {
      ...mapGetters(['currentLocation', 'geohashPrecision', 'userLocations', 'account']),
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
        zoom: 15,
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
        return new global.mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map)
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
  .current-location {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 18px;
    white-space: pre-wrap;
    background-color: #111101;
    opacity: 0.5;
    color: #fff;
    max-width: 290px;
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