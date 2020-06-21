export default {
  computed: {
    canWrite () {
      return this.$auth.loggedIn && this.$auth.user.access === 'w'
    },
    canRead () {
      return this.$auth.loggedIn && /w|r/.test(this.$auth.user.access)
    },
    canDelete () {
      return this.$auth.loggedIn && this.$auth.user.role === 'sudo' && this.$auth.user.access === 'w'
    }
  }
}
