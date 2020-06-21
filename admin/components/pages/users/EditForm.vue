<template>
  <v-form @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>
        {{ isNew ? 'Create new user' : 'Edit user' }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.username"
          :readonly="!isNew"
          :clearable="isNew"
          :error-messages="validationError('username')"
          label="Username"
        />
        <v-text-field
          v-model="form.email"
          :readonly="!isNew"
          :clearable="isNew"
          :error-messages="validationError('email')"
          type="email"
          label="Email"
        />
        <v-select
          v-model="form.role"
          :items="roleListItems"
          :error-messages="validationError('role')"
          label="Role"
          clearable
        />
        <v-select
          v-model="form.access"
          :items="accessListItems"
          :error-messages="validationError('access')"
          label="Access"
          clearable
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          color="primary"
        >
          Save
        </v-btn>
        <v-btn
          type="button"
          color="secondary"
          @click="onClose"
        >
          Cancel
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import formsMixin from '~/mixins/forms'
import { roleListItems, accessListItems } from '~/config.json'

export default {
  mixins: [formsMixin],
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    roleListItems,
    accessListItems
  }),
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
      this.validationErrors = []
      this.$emit('close')
    },
    onSubmit () {
      this.validationErrors = []

      if (this.form.access === undefined) {
        this.form.access = ''
      }

      let method = 'put'
      let url = `users/${this.form._id}`

      if (this.isNew) {
        method = 'post'
        url = 'users'
      }

      this.$axios[method](url, {
        username: this.form.username,
        email: this.form.email,
        role: this.form.role,
        access: this.form.access
      })
        .then(() => {
          this.$emit('reload')
          this.onClose()
        })
        .catch((err) => {
          this.validationErrors = err.errors
        })
    }
  }
}
</script>
