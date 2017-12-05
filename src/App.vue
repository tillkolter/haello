<template>
  <div id="app">
    <map-box></map-box>
    <div class="latlon">
      <form @submit.prevent="onSubmit">
        <input type="text" placeholder="latitude" v-model="latitude"/>
        <input type="text" placeholder="longitude" v-model="longitude"/>
        <input type="submit">
      </form>
    </div>
  </div>
</template>

<script>
  import MapBox from './components/MapBox'

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
