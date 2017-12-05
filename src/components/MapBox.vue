<template>
  <div id="map-box">
    <div id="map"></div>
    <div class="current-location">
      <div>Lat:&nbsp;{{currentLocation.latitude}}, Lon:&nbsp;{{currentLocation.longitude}}</div>
      <div>Hash:&nbsp;{{currentLocation.geohash}} (Precision: {{geohashPrecision}})</div>
    </div>
    <location-button></location-button>
  </div>
</template>

<script>
  import LocationButton from './LocationButton'
  import { mapGetters } from 'vuex'

  export default {
    name: 'MapBox',
    components: {LocationButton},
    data () {
      return {
        map: undefined
      }
    },
    computed: {
      ...mapGetters(['currentLocation', 'geohashPrecision']),
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
    watch: {
      currentLocation (value) {
        if (value) {
          let el = document.createElement('div')
          el.className = 'marker'
          new global.mapboxgl.Marker(el).setLngLat([this.currentLocation.longitude, this.currentLocation.latitude]).addTo(this.map)

          this.map.easeTo({
            center: [
              value.longitude,
              value.latitude
            ]
          })
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
  }
</style>