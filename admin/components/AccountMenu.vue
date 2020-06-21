<template>
  <v-menu bottom offset-y>
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        <v-icon>
          mdi-account-circle
        </v-icon>
        <span>
          {{ $auth.user.username }}
        </span>
      </v-btn>
    </template>

    <v-list>
      <v-list-item link @click.prevent="logout">
        <v-list-item-title>
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
