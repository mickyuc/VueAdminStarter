<template>
  <v-form @submit.prevent="$emit('input', form)">
    <v-row>
      <v-col class="d-flex flex-wrap">
        <v-text-field
          v-model="form.username"
          label="Username"
          class="mb-3 mr-3"
          clearable
          hide-details
        />
        <v-text-field
          v-model="form.email"
          label="Email"
          class="mb-3 mr-3"
          clearable
          hide-details
        />
        <v-select
          v-model="form.role"
          :items="roleListItems"
          label="Role"
          class="mb-3 mr-3"
          clearable
          hide-details
        />
        <v-select
          v-model="form.access"
          :items="accessListItems"
          label="Access"
          class="mb-3 mr-3"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-btn type="submit" color="warning" class="mt-sm-3">
          <v-icon>mdi-magnify</v-icon> Search
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { roleListItems, accessListItems } from '~/config.json'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        username: '',
        email: '',
        role: '',
        access: ''
      })
    }
  },
  data: () => ({
    roleListItems,
    accessListItems,
    form: {}
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
  }
}
</script>

<style lang="scss" scoped>
.v-input {
  width: 300px;
}
</style>
