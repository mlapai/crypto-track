<template>
  <v-data-table
    :headers="headers"
    :items="cryptos"
    :total-items="totalItems"
    :loading="loading"
    v-bind:pagination.sync="pagination"
    v-bind:rowsPerPageItems="rowsPerPageChoices"
    class="elevation-1"
  >
      <template slot="items" slot-scope="props">
          <td class="text-xs-left">
              <router-link
                      class="no-underline"
                      :to="{ name: 'currency-details', params: { currencyId: props.item.id, currencyObj: props.item }}"
              >
                  {{ props.item.name }}
              </router-link>
          </td>
          <td class="text-xs-left">{{ props.item.symbol }}</td>
          <td class="text-xs-left">$ {{ props.item.quotes.USD.price.toFixed(2) }}</td>
          <td class="text-xs-left"
              v-bind:style="[(props.item.quotes.USD.percent_change_24h < 0) ? {color: 'red'} : {color: 'green'}]">
              {{ props.item.quotes.USD.percent_change_24h }} %
          </td>
          <td class="text-xs-left">
              <v-flex xs5>
                  <input
                          :ref="'inputValue' + props.item.name"
                          type="text"
                          class="header-title input-border"
                          :value="getCurrencyStorageValue(props.item.name).value"
                          @keyup.enter="setCurrencyStorageValue(props.item.name, $event.target.value, props.item.quotes.USD.price)"
                  >
                  <v-btn left small
                         @click="setCurrencyStorageValue(props.item.name, $refs['inputValue' + props.item.name].value, props.item.quotes.USD.price)">
                      Submit
                  </v-btn>
              </v-flex>
          </td>
          <td class="text-xs-left" :ref="'coinValue' + props.item.name">$ {{ calculateUserValue(props.item.name,
            props.item.quotes.USD.price) }}
          </td>
      </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data: () => ({
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Short name', value: 'symbol' },
      { text: '$ Value', value: 'quotes.USD.price' },
      { text: 'last 24h', value: 'quotes.USD.percent_change_24h' },
      { text: 'Amount you own', value: '' },
      { text: '$ value of your coin', value: '' }
    ],
    rowsPerPageChoices: [10, 25],
    loading: false,
    sort: 'rank',
    start: 1,
    totalItems: 50,
    pagination: {},
    cryptos: []
  }),
  watch: {
    pagination: {
      handler () {
        // Calculating starting point on api depending on page and limit
        this.start = (this.pagination.page > 1)
          ? (this.pagination.page * this.pagination.rowsPerPage - this.pagination.rowsPerPage)
          : 1
        this.fetchDataFromApi()
        // Scroll to top if user changes the page
        window.scrollTo(0, 0)
      },
      deep: true
    }
  },
  methods: {
    // Fetch request data
    fetchDataFromApi () {
      this.resolveDataFromApi()
        .then(data => {
          this.cryptos = data.cryptos
        })
        .catch((e) => {
          this.$toastr.error(e)
        })
    },
    // Get amount of currency that user owns from from storage
    // If user does not own this currency create new entry in storage for that currency with value 0
    getCurrencyStorageValue (currName) {
      let storageCurrency = this.$store.state.userCryptos.find((curr) => { return curr.name === currName })
      if (!storageCurrency) {
        let currency = { name: currName, value: 0 }
        this.$store.commit('pushToUserCryptos', currency)
        return currency
      }
      return storageCurrency
    },
    // Change state and localStorage value of given currency and calcualte value of user coin again
    setCurrencyStorageValue (currName, value, currPrice) {
      this.$store.commit('changeCryptoValue', { currName, value })
      this.$refs['coinValue' + currName].innerHTML = '$ ' + (value * currPrice).toFixed(2)
    },
    // Calculate $ value of user coin's
    calculateUserValue (currName, currencyPrice) {
      let storageValue = this.getCurrencyStorageValue(currName)
      return (storageValue.value * currencyPrice.toFixed(2))
    },
    // Resolve api request
    resolveDataFromApi () {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.requestDataFromApi()
          .then((res) => {
            let cryptos = Object.values(res.data.data)
            // Timeout just for demonstration of loader
            setTimeout(() => {
              this.loading = false
              resolve({
                cryptos
              })
            }, 1000)
          })
          .catch(() => {
            // Timeout just for demonstration of loader
            setTimeout(() => {
              this.loading = false
              reject(new Error('Failed to fetch api data.'))
            }, 1000)
          })
      })
    },
    // Requesting data from api
    requestDataFromApi () {
      return axios.get('https://api.coinmarketcap.com/v2/ticker/', {
        params: {
          start: this.start,
          limit: this.pagination.rowsPerPage,
          sort: this.sort
        }
      })
    }
  }
}
</script>

<style>
    .input-border {
        border: 1px solid #ced4da;
    }
</style>
