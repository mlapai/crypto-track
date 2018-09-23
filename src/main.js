// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.config.productionTip = false

window.toastr = require('toastr')

Vue.use(Vuetify)
Vue.use(VueToastr2)
Vue.use(Vuex)

let state = {
  userCryptos: []
}

const vuexLocalStorage = new VuexPersist({
  key: 'crypto-track',
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: state,
  plugins: [vuexLocalStorage.plugin],
  mutations: {
    pushToUserCryptos (state, payload) {
      // mutate state
      state.userCryptos.push(payload)
    },
    changeCryptoValue (state, { currName, value }) {
      let storageCurrency = state.userCryptos.find((curr) => { return curr.name === currName })
      storageCurrency.value = value
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
