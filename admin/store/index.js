export const state = () => ({
  pageTitle: '',
  breadcrumbItems: [],
  errorMessage: '',
  successMessage: ''
})

export const mutations = {
  setPageTitle (state, title) {
    state.pageTitle = title
  },
  setBreadcrumbItems (state, items) {
    state.breadcrumbItems = items
  },
  setErrorMessage (state, message) {
    state.errorMessage = message
  },
  setSuccessMessage (state, message) {
    state.successMessage = message
  }
}

export const actions = {
  resetMessages ({ commit }) {
    commit('setErrorMessage', '')
    commit('setSuccessMessage', '')
  }
}
