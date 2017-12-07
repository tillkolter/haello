<template>
  <div id="app">
    <!--<button @click="getUsers">Get Users</button>-->
    <!--<button @click="deleteLocation">Delete location</button>-->
    <!--<button @click="getSpendingOffer">Get spending offer</button>-->
    <map-box></map-box>
    <div class="latlon">
      Fake your location (development helper)
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
      ...mapGetters(['currentLocation', 'account'])
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
      },
      getSpendingOffer () {
        if (this.account) {
          this.$store.dispatch('getUserSpendingOfferAddress', this.account)
        }
      }
    },
    mounted () {
      this.$store.dispatch('getIdentity')
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
    margin-top: 60px;
  }
</style>
