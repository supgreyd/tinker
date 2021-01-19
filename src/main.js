import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import { store } from '../store/index'

Vue.use(VueKonva)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
