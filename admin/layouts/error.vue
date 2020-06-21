<template>
  <div class="text-center">
    <h1 v-if="error.statusCode === 404">
      {{ error.message || '404 Not Found' }}
    </h1>
    <h1 v-else>
      {{ error.message || 'An error occurred' }}
    </h1>

    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    return {
      title: this.error.statusCode || 500
    }
  }
}
</script>
