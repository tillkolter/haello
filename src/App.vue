<template>
  <div id="app">
    <button @click="getUsers">Get Users</button>
    <button @click="deleteLocation">Delete location</button>
    <map-box></map-box>
    <div class="latlon">
      Fake your location (debug helper)
      <form @submit.prevent="onSubmit">
        <input type="number" placeholder="latitude" v-model="latitude" step="0.0000001" required/>
        <input type="number" placeholder="longitude" v-model="longitude" step="0.0000001" required/>
        <input type="submit">
      </form>
    </div>
  </div>
</template>

<script>
  import MapBox from './components/MapBox'
  import { mapGetters } from 'vuex'
  import { deleteLocation } from './utils/blockchain'

  export default {
    name: 'app',
    components: {MapBox},
    data () {
      return {
        latitude: '',
        longitude: '',
        geohash: '',
        currentGeohash: '',
        currentLat: '',
        currentLon: ''
      }
    },
    computed: {
      ...mapGetters(['currentLocation'])
    },
    methods: {
      onSubmit () {
        this.$store.dispatch(
          'setLocation',
          {
            lat: parseFloat(this.latitude).toFixed(5),
            lon: parseFloat(this.longitude).toFixed(5)
          })
      },
      getUsers () {
        this.$store.dispatch(
          'getUsers',
          this.currentLocation.geohash
        )
      },
      deleteLocation () {
        deleteLocation()
      }
    }
  }
</script>

<style>
  body {
    background-color: white;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
