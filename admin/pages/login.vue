<template>
  <v-form ref="form" @submit.prevent="onSubmit">
    <v-card max-width="400">
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" dense>
          Invalid credentials
        </v-alert>

        <v-text-field
          v-model="form.username"
          :rules="[() => !!form.username || 'Username is required.']"
          prepend-inner-icon="mdi-account"
          validate-on-blur
          label="Username"
          autocomplete="off"
        />

        <v-text-field
          v-model="form.password"
          :rules="[() => !!form.password || 'Password is required.']"
          prepend-inner-icon="mdi-lock"
          validate-on-blur
          label="Password"
          type="password"
          autocomplete="off"
        />

        <!-- <v-checkbox
          v-model="rememberMe"
          color="primary"
          label="Remember me"
          hide-details
        /> -->
      </v-card-text>

      <v-card-actions class="pb-5">
        <v-spacer />

        <v-btn type="submit" color="primary">
          Login
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  auth: 'guest',
  layout: 'auth',
  data: () => ({
    form: {
      username: '',
      password: ''
    },
    rememberMe: true,
    error: false
  }),
  methods: {
    onSubmit () {
      this.error = false

      if (this.$refs.form.validate()) {
        this.$auth.loginWith('local', {
          data: this.form
        }).catch(() => {
          this.error = true
        })
      }
    }
  },
  head: () => ({
    title: 'Login'
  })
}
</script>
