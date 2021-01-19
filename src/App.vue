<template>
  <div id="app">
    <v-stage :config="configKonva">
        <Swing />
    </v-stage>
  </div>
</template>

<script>

  import Swing from './components/Swing'

  const windowWidth = window.innerWidth,
        windowHeight = window.innerHeight

export default {
  name: 'App',

  data() {
    return {
      configKonva: {
        width: windowWidth,
        height: windowHeight
      }
    }
  },

  components: {
    Swing
  }

}
</script>

<style>

</style>
