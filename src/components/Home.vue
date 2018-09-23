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
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.symbol }}</td>
          <td class="text-xs-left">{{ props.item.quotes.USD.price.toFixed(2) }}</td>
          <td class="text-xs-left"
              v-bind:style="[(props.item.quotes.USD.percent_change_24h < 0) ? {color: 'red'} : {color: 'green'}]">
              {{ props.item.quotes.USD.percent_change_24h }} %
          </td>
          <td class="text-xs-left"></td>
          <td class="text-xs-left"></td>
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
