<template>
  <v-list>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :to="item.to"
      router
      exact
    >
      <v-list-item-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        icon: 'mdi-home',
        title: 'Dashboard',
        to: '/'
      },
      {
        icon: 'mdi-account-multiple',
        title: 'Users',
        to: '/users'
      }
    ]
  })
}
</script>
