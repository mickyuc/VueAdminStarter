<template>
  <v-form @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>
        Delete a User
      </v-card-title>

      <v-card-text>
        Are you sure you want to delete the selected user?
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          color="red"
        >
          Yes
        </v-btn>
        <v-btn
          type="button"
          color="secondary"
          @click="onClose"
        >
          No
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value: {
      handler (val) {
        this.form = { ...val }
      },
      deep: true
    }
  },
  mounted () {
    this.form = { ...this.value }
  },
  methods: {
    onClose () {
      // reset validation errors
      this.$emit('close')
    },
    onSubmit () {
      this.$axios.delete(`users/${this.form._id}`)
        .then(() => {
          this.$emit('reload')
          this.onClose()
        })
    }
  }
}
</script>
