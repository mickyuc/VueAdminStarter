<template>
  <v-container>
    <h4 class="body-2">
      {{ title }} v <b>{{ version }}</b>
    </h4>
    <h4 class="caption">
      {{ upTime | timestamp }}
    </h4>
    <h4 class="overline">
      Copyright &copy; 2019 - {{ new Date().getFullYear() }}
    </h4>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    title: process.env.title,
    version: process.env.version,
    upTime: process.env.upTime
  })
}
</script>
