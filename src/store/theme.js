export default {
  namespaced: true,
  state: {
    darkMode: localStorage.getItem('adaahDarkMode') === 'true'
  },
  mutations: {
    TOGGLE_THEME(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('adaahDarkMode', state.darkMode)
    }
  },
  actions: {
    toggleTheme({ commit }) {
      commit('TOGGLE_THEME')
    }
  }
}
