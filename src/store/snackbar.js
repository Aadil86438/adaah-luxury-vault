export default {
  namespaced: true,
  state: {
    show: false,
    text: '',
    color: 'success',
    timeout: 4000
  },
  mutations: {
    SHOW_SNACKBAR(state, { text, color, timeout }) {
      state.text = text
      state.color = color || 'success'
      state.timeout = timeout || 4000
      state.show = true
    },
    HIDE_SNACKBAR(state) {
      state.show = false
    }
  },
  actions: {
    show({ commit }, pPayload) {
      if (typeof pPayload === 'string') {
        commit('SHOW_SNACKBAR', { text: pPayload })
      } else {
        commit('SHOW_SNACKBAR', pPayload)
      }
    },
    hide({ commit }) {
      commit('HIDE_SNACKBAR')
    }
  }
}
