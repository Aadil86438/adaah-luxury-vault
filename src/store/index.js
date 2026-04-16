import { createStore } from 'vuex'
import auth from './auth'
import theme from './theme'
import snackbar from './snackbar'

export default createStore({
  modules: {
    auth,
    theme,
    snackbar
  }
})
