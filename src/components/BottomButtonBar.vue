<template>
  <div id="bottom-button-bar">
    <spender-button></spender-button>
    <location-button></location-button>
  </div>
</template>

<script>
  import LocationButton from './BottomButtonBar/LocationButton'
  import SpenderButton from './BottomButtonBar/SpenderButton'
  export default {
    name: 'BottomButtonBar',
    components: {SpenderButton, LocationButton}
  }
</script>

<style lang="scss">
  #bottom-button-bar {
    position: absolute;
    bottom: 16px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    .inner {

    }
  }
  .btn {
    min-width: 72px;
    width: 72px;
    height: 72px;
    border-radius: 36px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    img {
      max-width: 48px;
      max-height: 48px;
      margin: auto 0;
    }
  }
</style>
