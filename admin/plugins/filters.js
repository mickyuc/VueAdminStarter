import Vue from 'vue'

Vue.filter('timestamp', (date) => {
  return date ? new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }) : 'n/a'
})
