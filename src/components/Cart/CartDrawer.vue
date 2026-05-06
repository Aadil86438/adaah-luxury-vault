<template>
  <!-- ── Cart Drawer ── -->
  <v-navigation-drawer
    :model-value="drawerOpen"
    @update:model-value="onDrawerUpdate"
    temporary
    location="right"
    :width="drawerWidth"
    class="cart-drawer"
  >
    <div class="cart-drawer-content">
      <!-- Header -->
      <div class="cart-drawer-header">
        <h2 class="serif-text cart-drawer-title">Your Cart</h2>
        <v-btn icon flat size="small" class="cart-close-btn" @click="closeDrawer" aria-label="Close cart">
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Empty State -->
      <div v-if="isCartEmpty" class="cart-empty">
        <v-icon size="64" class="cart-empty-icon">mdi-cart-outline</v-icon>
        <p class="serif-text cart-empty-title">Your cart is empty</p>
        <p class="cart-empty-subtitle">Discover our beautiful collection</p>
        <button class="btn-terra cart-empty-btn" @click="goShopping">Shop Now</button>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-items-list">
        <transition-group name="cart-item" tag="div">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="cart-item-image">
              <img
                :src="item.image_url || 'https://placehold.co/80x80/FAF7F2/D97A6C?text=Ad'"
                :alt="item.name"
                class="cart-item-img"
              />
            </div>
            <div class="cart-item-details">
              <p class="cart-item-name">{{ item.name }}</p>
              <p class="cart-item-category luxury-label">{{ item.category }}</p>
              <p class="cart-item-price">₹{{ item.price.toLocaleString('en-IN') }}</p>
              <div class="cart-item-qty-row">
                <div class="cart-qty-control">
                  <button
                    type="button"
                    class="cart-qty-btn"
                    :disabled="item.quantity <= 1"
                    @click="updateQty(item.id, item.quantity - 1)"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span class="cart-qty-value">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="cart-qty-btn"
                    :disabled="item.quantity >= 99"
                    @click="updateQty(item.id, item.quantity + 1)"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <span class="cart-item-subtotal">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</span>
              </div>
            </div>
            <button class="cart-item-remove" @click="removeItem(item.id)" aria-label="Remove item">
              <v-icon size="16">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </transition-group>
      </div>

      <!-- Footer (only when items exist) -->
      <div v-if="!isCartEmpty" class="cart-drawer-footer">
        <div class="cart-total-row">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value serif-text">₹{{ cartTotal.toLocaleString('en-IN') }}</span>
        </div>
        <button
          class="btn-terra cart-checkout-btn"
          @click="proceedToCheckout"
        >
          Proceed to Checkout
          <v-icon size="18" class="ml-1">mdi-arrow-right</v-icon>
        </button>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const emit = defineEmits(['checkout'])

const store = useStore()
const router = useRouter()

const drawerOpen = computed(() => store.state.cart.drawerOpen)
const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const isCartEmpty = computed(() => store.getters['cart/isCartEmpty'])

const drawerWidth = computed(() => {
  return window.innerWidth < 640 ? window.innerWidth : 400
})

const onDrawerUpdate = (pVal) => {
  if (!pVal) store.dispatch('cart/closeDrawer')
}

const closeDrawer = () => {
  store.dispatch('cart/closeDrawer')
}

const updateQty = (pId, pQty) => {
  store.dispatch('cart/updateQuantity', { productId: pId, quantity: pQty })
}

const removeItem = (pId) => {
  store.dispatch('cart/removeItem', pId)
  store.dispatch('snackbar/show', { text: 'Item removed from cart', color: 'info' })
}

const goShopping = () => {
  closeDrawer()
  router.push('/')
}

const proceedToCheckout = () => {
  closeDrawer()
  emit('checkout')
}
</script>

<style scoped>
/* ── Drawer Root ── */
.cart-drawer {
  background: var(--card) !important;
  border-left: 1px solid var(--border) !important;
  z-index: 1010 !important;
}

.cart-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Header ── */
.cart-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cart-drawer-title {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.cart-close-btn {
  background: var(--bg-offset) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border) !important;
}
.cart-close-btn:hover {
  background: var(--border) !important;
  color: var(--text-primary) !important;
}

/* ── Empty State ── */
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.cart-empty-icon {
  color: var(--border);
  margin-bottom: 1.25rem;
}

.cart-empty-title {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.cart-empty-subtitle {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.cart-empty-btn {
  padding: 0.75rem 2rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.88rem;
}

/* ── Items List ── */
.cart-items-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.75rem 0;
}

.cart-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  position: relative;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition-fast);
}

.cart-item:hover {
  background: var(--primary-muted);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #FAF7F2;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.cart-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.125rem;
}

.cart-item-category {
  margin-bottom: 0.25rem;
}

.cart-item-price {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: var(--primary-hover);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cart-item-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.cart-qty-control {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.cart-qty-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: background var(--transition-fast), color var(--transition-fast);
  user-select: none;
  line-height: 1;
}

.cart-qty-btn:hover:not(:disabled) {
  background: var(--primary-muted);
  color: var(--primary-hover);
}

.cart-qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cart-qty-value {
  width: 2rem;
  text-align: center;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  border-left: 1.5px solid var(--border);
  border-right: 1.5px solid var(--border);
  line-height: 1.75rem;
  background: white;
}

.cart-item-subtotal {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cart-item-remove {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.cart-item-remove:hover {
  color: #C0392B;
  background: rgba(192, 57, 43, 0.08);
}

/* ── Footer ── */
.cart-drawer-footer {
  flex-shrink: 0;
  padding: 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--card);
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.cart-total-label {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.cart-total-value {
  font-size: 1.5rem;
  color: var(--primary-hover);
}

.cart-checkout-btn {
  width: 100%;
  text-align: center;
  padding: 0.875rem 1.75rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Item Transition ── */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ── Dark Mode ── */
html.dark-mode .cart-qty-value {
  background: var(--bg-offset);
}
</style>
