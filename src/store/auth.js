import { SupabaseService } from '../services/SupabaseService'

export default {
  namespaced: true,
  state: {
    user: null,
    profile: null,
    loading: false
  },
  mutations: {
    SET_USER(state, pUser) {
      state.user = pUser
    },
    SET_PROFILE(state, pProfile) {
      state.profile = pProfile
    },
    SET_LOADING(state, pLoading) {
      state.loading = pLoading
    }
  },
  actions: {
    initialize({ commit, dispatch }) {
      commit('SET_LOADING', true)
      SupabaseService.getSession().then(({ data }) => {
        if (data.session) {
          commit('SET_USER', data.session.user)
          dispatch('fetchProfile', data.session.user.id)
        } else {
          commit('SET_LOADING', false)
        }
      })
    },
    fetchProfile({ commit }, pUserId) {
      SupabaseService.getUserProfile(pUserId).then(({ data, error }) => {
        if (data) commit('SET_PROFILE', data)
        commit('SET_LOADING', false)
      }).catch(() => {
        commit('SET_LOADING', false)
      })
    },
    login({ commit, dispatch }, { email, password }) {
      return SupabaseService.signIn(email, password).then(({ data, error }) => {
        if (error) {
          console.error('Supabase Auth Error:', error)
          throw error
        }
        commit('SET_USER', data.user)
        return dispatch('fetchProfile', data.user.id)
      })
    },
    register({ commit, dispatch }, { email, password }) {
      return SupabaseService.signUp(email, password).then(({ data, error }) => {
        if (error) throw error
        return SupabaseService.createUserProfile(data.user.id, email).then(() => {
          commit('SET_USER', data.user)
          return dispatch('fetchProfile', data.user.id)
        })
      })
    },
    logout({ commit }) {
      return SupabaseService.signOut().then(() => {
        commit('SET_USER', null)
        commit('SET_PROFILE', null)
      })
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.profile?.role === 'admin',
    userEmail: (state) => state.user?.email
  }
}
