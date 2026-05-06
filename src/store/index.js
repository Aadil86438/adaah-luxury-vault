import { createStore } from 'vuex'
import auth from './auth'
import theme from './theme'
import snackbar from './snackbar'
import cart from './cart'

export default createStore({
  modules: {
    auth,
    theme,
    snackbar,
    cart
  }
})
