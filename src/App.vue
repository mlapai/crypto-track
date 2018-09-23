<template>
    <v-app id="app">
        <v-toolbar
                class="teal"
                dark
                app
                clipped-left
                fixed
        >
            <v-toolbar-title>
                <router-link class="home-redirect no-underline" :to="{ name: 'Home' }">
                    CryptoTrack
                </router-link>
            </v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
  })
}
</script>

<style>
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }
    .no-underline {
        text-decoration: none;
    }
    .home-redirect {
        color: #FFFFFF;
    }
    .home-redirect:hover {
        color: #000000;
    }
</style>
