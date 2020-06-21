export default ({ store, route }) => {
  if (route.meta[0]) {
    store.commit('setPageTitle', route.meta[0].title)
  }
}
