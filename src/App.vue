<template>
  <div id="app">
    <v-stage :config="configKonva">
        <Swing />
    </v-stage>
  </div>
</template>

<script>

  import Swing from './components/Swing'

export default {
  name: 'App',

  data() {
    return {
      configKonva: {
        width: 1000,
        height: 1000
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
