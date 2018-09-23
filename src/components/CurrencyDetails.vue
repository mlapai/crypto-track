<template>
    <v-layout row>
        <v-flex xs12 sm4 offset-sm4>
            <v-card>
                <v-toolbar color="teal" dark>
                    <v-toolbar-title>{{ currency.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <router-link class="no-underline" :to="{ name: 'Home' }">
                        <v-btn>Back to Home</v-btn>
                    </router-link>
                </v-toolbar>
                <v-list two-line>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ currency.rank }}</v-list-tile-title>
                            <v-list-tile-sub-title>Rank</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ currency.symbol }}</v-list-tile-title>
                            <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider inset></v-divider>

                    <v-list-tile>

                        <v-list-tile-content>
                            <v-list-tile-title>$ {{ formatNumber(currency.quotes.USD.market_cap, 2) }}</v-list-tile-title>
                            <v-list-tile-sub-title>Market Cap</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>$ {{ formatNumber(currency.quotes.USD.price, 2) }}</v-list-tile-title>
                            <v-list-tile-sub-title>Price</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider inset></v-divider>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>$ {{ formatNumber(currency.quotes.USD.volume_24h, 2) }}</v-list-tile-title>
                            <v-list-tile-sub-title>Volume (24h)</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ formatNumber(currency.circulating_supply, 0) }} {{ currency.symbol }}</v-list-tile-title>
                            <v-list-tile-sub-title>Circulating Supply</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ formatNumber(currency.total_supply, 0) }} {{ currency.symbol }}</v-list-tile-title>
                            <v-list-tile-sub-title>Total Supply</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ formatNumber(currency.max_supply, 0) }} {{ currency.symbol }}</v-list-tile-title>
                            <v-list-tile-sub-title>Max Supply</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ currency.quotes.USD.percent_change_1h }} %</v-list-tile-title>
                            <v-list-tile-sub-title>Change 1h</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ currency.quotes.USD.percent_change_24h }} %</v-list-tile-title>
                            <v-list-tile-sub-title>Change 24h</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ currency.quotes.USD.percent_change_7d }} %</v-list-tile-title>
                            <v-list-tile-sub-title>Change 7d</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
export default {
  name: 'currency-details',
  data: () => ({
    currency: null
  }),
  mounted () {
    // If user is coming from home page, we already injected this object through route, no need for api request
    if (typeof this.$route.params.currencyObj !== 'undefined') {
      this.currency = this.$route.params.currencyObj
    } else {
      this.getDataFromApi()
    }
  },
  watch: {
    // Request data from api if route currencyId changes
    '$route': 'getDataFromApi'
  },
  methods: {
    formatNumber (value, numberOfDecimals) {
      let val = (value / 1).toFixed(numberOfDecimals).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getDataFromApi () {
      axios.get('https://api.coinmarketcap.com/v2/ticker/' + this.$route.params.currencyId + '/')
        .then(res => {
          this.currency = res.data.data
        })
    }
  }
}
</script>
