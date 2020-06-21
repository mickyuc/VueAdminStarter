export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
  })

  $axios.onResponse((res) => {
    if (/^\/auth\/user.*/.test(res.config.url)) {
      return res
    }

    if (res.data.message) {
      store.commit('setSuccessMessage', res.data.message)
    }

    return res.data
  })

  $axios.onError((err) => {
    if (err.response.status !== 422) {
      store.commit('setErrorMessage', (err.response.data && err.response.data.message) || err.response.statusText)
    }

    return Promise.reject(err.response.data)
  })
}
