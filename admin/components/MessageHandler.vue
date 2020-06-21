<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="0"
    multi-line
  >
    <v-icon class="mr-3">
      mdi-alert
    </v-icon>
    {{ errorMessage || successMessage }}
    <v-btn
      color="light"
      text
      @click="resetMessages"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    snackbar: false
  }),
  computed: {
    ...mapState(['errorMessage', 'successMessage']),
    color () {
      if (this.errorMessage) {
        return 'red'
      } else {
        return 'info'
      }
    }
  },
  watch: {
    errorMessage (val) {
      this.snackbar = !!val
    },
    successMessage (val) {
      this.snackbar = !!val
    }
  },
  methods: {
    ...mapActions(['resetMessages'])
  }
}
</script>
