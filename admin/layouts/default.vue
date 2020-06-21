<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <sidebar-list />
      <v-spacer />
      <version-info />
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <account-menu v-if="$auth.loggedIn" />
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <h2 class="headline mb-3">
          {{ pageTitle }}
        </h2>
        <nuxt />

        <message-handler />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    SidebarList: () => import('~/components/SidebarList'),
    VersionInfo: () => import('~/components/VersionInfo'),
    AccountMenu: () => import('~/components/AccountMenu'),
    MessageHandler: () => import('~/components/MessageHandler')
  },
  data: () => ({
    title: process.env.title,
    drawer: true
  }),
  computed: {
    ...mapState(['pageTitle'])
  },
  head () {
    return {
      title: this.pageTitle
    }
  }
}
</script>

<style lang="scss">
.v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}
</style>
