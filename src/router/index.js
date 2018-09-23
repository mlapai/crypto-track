import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CurrencyDetails from '@/components/CurrencyDetails'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/currency/:currencyId',
      name: 'currency-details',
      component: CurrencyDetails
    }
  ]
})
