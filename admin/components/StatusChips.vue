<template>
  <v-chip :color="color" small>
    {{ status || 'n/a' }}
  </v-chip>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'n/a'
    }
  },
  computed: {
    color () {
      if (/sudo|w/.test(this.status)) {
        return 'red'
      } else if (/staff|r/.test(this.status)) {
        return 'info'
      }

      return 'dark'
    }
  }
}
</script>
