/**
 * Cart Vuex Module
 * ─────────────────────────────────────────────
 * Manages cart state with localStorage persistence.
 * Key: 'adaahCart'
 *
 * Each cart item shape:
 *   { id, name, price, image_url, category, quantity }
 */

const STORAGE_KEY = 'adaahCart'

/** Read persisted cart from localStorage (safe) */
const loadCart = () => {
  try {
    const lRaw = localStorage.getItem(STORAGE_KEY)
    if (!lRaw) return []
    const lParsed = JSON.parse(lRaw)
    return Array.isArray(lParsed) ? lParsed : []
  } catch {
    return []
  }
}

/** Write cart to localStorage (safe) */
const saveCart = (pItems) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pItems))
  } catch {
    // storage full or blocked — silently degrade
  }
}

export default {
  namespaced: true,

  state: {
    items: [],
    drawerOpen: false,
    checkoutLoading: false,
    checkoutLock: false
  },

  mutations: {
    SET_ITEMS(state, pItems) {
      state.items = pItems
      saveCart(pItems)
    },
    ADD_ITEM(state, pItem) {
      const lExisting = state.items.find(i => i.id === pItem.id)
      if (lExisting) {
        // Merge: increase quantity (cap at 99)
        lExisting.quantity = Math.min(lExisting.quantity + (pItem.quantity || 1), 99)
      } else {
        state.items.push({
          id: pItem.id,
          name: pItem.name,
          price: parseFloat(pItem.price),
          image_url: pItem.image_url || '',
          category: pItem.category || '',
          quantity: pItem.quantity || 1
        })
      }
      saveCart(state.items)
    },
    REMOVE_ITEM(state, pProductId) {
      state.items = state.items.filter(i => i.id !== pProductId)
      saveCart(state.items)
    },
    UPDATE_QUANTITY(state, { productId, quantity }) {
      const lItem = state.items.find(i => i.id === productId)
      if (lItem) {
        lItem.quantity = Math.max(1, Math.min(quantity, 99))
        saveCart(state.items)
      }
    },
    CLEAR_CART(state) {
      state.items = []
      saveCart([])
    },
    SET_DRAWER(state, pOpen) {
      state.drawerOpen = pOpen
    },
    SET_CHECKOUT_LOADING(state, pLoading) {
      state.checkoutLoading = pLoading
    },
    SET_CHECKOUT_LOCK(state, pLocked) {
      state.checkoutLock = pLocked
    }
  },

  actions: {
    /** Hydrate cart from localStorage on app init */
    initialize({ commit }) {
      const lItems = loadCart()
      commit('SET_ITEMS', lItems)
    },

    addItem({ commit, dispatch }, pProduct) {
      commit('ADD_ITEM', pProduct)
      dispatch('snackbar/show', {
        text: `${pProduct.name} added to cart`,
        color: 'success'
      }, { root: true })
    },

    removeItem({ commit }, pProductId) {
      commit('REMOVE_ITEM', pProductId)
    },

    updateQuantity({ commit }, pPayload) {
      commit('UPDATE_QUANTITY', pPayload)
    },

    clearCart({ commit }) {
      commit('CLEAR_CART')
    },

    openDrawer({ commit }) {
      commit('SET_DRAWER', true)
    },

    closeDrawer({ commit }) {
      commit('SET_DRAWER', false)
    },

    toggleDrawer({ commit, state }) {
      commit('SET_DRAWER', !state.drawerOpen)
    }
  },

  getters: {
    cartItems: (state) => state.items,
    cartCount: (state) => state.items.reduce((acc, i) => acc + i.quantity, 0),
    cartTotal: (state) => state.items.reduce((acc, i) => acc + (i.price * i.quantity), 0),
    isCartEmpty: (state) => state.items.length === 0
  }
}
