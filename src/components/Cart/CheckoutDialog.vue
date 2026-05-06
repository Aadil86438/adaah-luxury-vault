<template>
  <!-- ── Checkout Dialog ── -->
  <v-dialog v-model="show" max-width="600" scrim="rgba(30,15,10,0.65)" persistent>
    <v-card class="checkout-root" rounded="xl" color="white">
      <!-- Header -->
      <div class="checkout-header">
        <div>
          <h2 class="serif-text checkout-title">Checkout</h2>
          <p class="checkout-subtitle">Complete your order</p>
        </div>
        <v-btn icon flat size="small" class="checkout-close-btn" @click="close" :disabled="loading" aria-label="Close checkout">
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider />

      <!-- Scrollable Body -->
      <div class="checkout-body">
        <!-- Order Summary -->
        <div class="checkout-summary">
          <p class="checkout-section-label luxury-label">Order Summary</p>
          <div v-for="item in cartItems" :key="item.id" class="checkout-item">
            <div class="checkout-item-left">
              <span class="checkout-item-name">{{ item.name }}</span>
              <span class="checkout-item-meta">× {{ item.quantity }}</span>
            </div>
            <span class="checkout-item-subtotal">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</span>
          </div>
          <v-divider class="my-3" />
          <div class="checkout-total-row">
            <span class="checkout-total-label">Grand Total</span>
            <span class="checkout-total-value serif-text">₹{{ cartTotal.toLocaleString('en-IN') }}</span>
          </div>
        </div>

        <!-- Customer Form -->
        <div class="checkout-form-section">
          <p class="checkout-section-label luxury-label">Your Details</p>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="placeOrder" class="checkout-form">
            <v-text-field
              v-model="customerName"
              label="Your Name"
              variant="outlined"
              density="comfortable"
              :rules="nameRules"
              class="mb-2"
              maxlength="50"
              autocomplete="name"
              :disabled="loading"
            />
            <v-text-field
              v-model="customerPhone"
              label="WhatsApp Number"
              variant="outlined"
              density="comfortable"
              :rules="phoneRules"
              type="tel"
              inputmode="numeric"
              maxlength="10"
              prefix="+91"
              autocomplete="tel"
              @input="sanitizePhone"
              :disabled="loading"
            />
          </v-form>
        </div>
      </div>

      <!-- Footer -->
      <div class="checkout-footer">
        <button
          type="button"
          class="btn-terra checkout-submit-btn"
          :class="{ disabled: !formValid || loading }"
          :disabled="!formValid || loading"
          @click="placeOrder"
        >
          <span v-if="loading" class="checkout-btn-loading">
            <v-progress-circular size="16" width="2" indeterminate color="white" />
            Placing Order…
          </span>
          <span v-else>
            <v-icon size="18" class="mr-1">mdi-whatsapp</v-icon>
            Place Order & Open WhatsApp
          </span>
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { SupabaseService } from '../../services/SupabaseService'

const store = useStore()

const show = ref(false)
const formRef = ref(null)
const customerName = ref('')
const customerPhone = ref('')
const formValid = ref(false)
const loading = ref(false)
const checkoutLock = ref(false)

const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])

// ── Validation Rules ──
const nameRules = [
  v => !!v?.trim() || 'Name is required',
  v => v?.trim().length >= 2 || 'Must be at least 2 characters',
  v => /^[a-zA-Z\s'-]+$/.test(v?.trim()) || 'Letters only'
]
const phoneRules = [
  v => !!v || 'Phone number is required',
  v => /^\d+$/.test(v) || 'Only digits are allowed',
  v => v?.length === 10 || 'Must be exactly 10 digits'
]
const sanitizePhone = () => {
  customerPhone.value = customerPhone.value.replace(/\D/g, '').slice(0, 10)
}

// ── Open / Close ──
const open = () => {
  if (store.getters['cart/isCartEmpty']) {
    store.dispatch('snackbar/show', { text: 'Your cart is empty', color: 'warning' })
    return
  }
  customerName.value = ''
  customerPhone.value = ''
  formValid.value = false
  loading.value = false
  checkoutLock.value = false
  show.value = true
}

const close = () => {
  if (!loading.value) {
    show.value = false
  }
}

// ── Place Order ──
const placeOrder = async () => {
  // Guard: validate form
  if (!formValid.value) return

  // Guard: prevent double-click
  if (checkoutLock.value || loading.value) return
  checkoutLock.value = true
  loading.value = true

  try {
    // Guard: cart must not be empty
    const lItems = store.getters['cart/cartItems']
    if (!lItems || lItems.length === 0) {
      store.dispatch('snackbar/show', { text: 'Cart is empty. Cannot place order.', color: 'error' })
      return
    }

    const lTotal = store.getters['cart/cartTotal']

    // Create order + order_items in Supabase
    const lResult = await SupabaseService.createOrderWithItems(
      {
        customer_name: customerName.value.trim(),
        phone: customerPhone.value,
        total_amount: lTotal
      },
      lItems
    )

    // Generate WhatsApp message
    const lDate = new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    })

    let lItemLines = ''
    lItems.forEach((item, index) => {
      const lSubtotal = (item.price * item.quantity).toLocaleString('en-IN')
      lItemLines += `\n${index + 1}. ${item.name}`
      lItemLines += `\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${lSubtotal}`
    })

    const lMessage = `✨ ADAH JEWELRY — ORDER CONFIRMED ✨\n\n📦 ORDER ITEMS:${lItemLines}\n\n💰 Grand Total: ₹${lTotal.toLocaleString('en-IN')}\n\n👤 Customer: ${customerName.value.trim()}\n📞 Contact: +91 ${customerPhone.value.replace(/(\d{5})(\d{5})/, '$1 $2')}\n📅 Order Date: ${lDate}\n\nThank you for choosing Adah 💎\nYour order will be processed soon!`

    // Open WhatsApp
    window.open(`https://wa.me/918643839796?text=${encodeURIComponent(lMessage)}`, '_blank')

    // Clear cart ONLY after successful DB write
    store.dispatch('cart/clearCart')

    store.dispatch('snackbar/show', { text: 'Order placed successfully!', color: 'success' })
    show.value = false
  } catch (pError) {
    console.error('Checkout error:', pError)
    store.dispatch('snackbar/show', {
      text: pError?.message || 'Failed to place order. Please try again.',
      color: 'error'
    })
    // Do NOT clear cart on error
  } finally {
    loading.value = false
    checkoutLock.value = false
  }
}

defineExpose({ open })
</script>

<style scoped>
/* ── Root ── */
.checkout-root {
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-height: 90dvh;
}

/* ── Header ── */
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
  flex-shrink: 0;
}

.checkout-title {
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.checkout-subtitle {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.checkout-close-btn {
  background: var(--bg-offset) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border) !important;
  flex-shrink: 0;
}
.checkout-close-btn:hover {
  background: var(--border) !important;
  color: var(--text-primary) !important;
}

/* ── Body ── */
.checkout-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1.25rem 1.5rem;
}

.checkout-section-label {
  margin-bottom: 0.875rem;
}

/* ── Summary ── */
.checkout-summary {
  margin-bottom: 1.5rem;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.75rem;
}

.checkout-item-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.checkout-item-name {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checkout-item-meta {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.checkout-item-subtotal {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  flex-shrink: 0;
}

.checkout-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.checkout-total-label {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.checkout-total-value {
  font-size: 1.5rem;
  color: var(--primary-hover);
}

/* ── Form ── */
.checkout-form-section {
  margin-top: 0.5rem;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 100%;
}

/* ── Footer ── */
.checkout-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--card);
}

.checkout-submit-btn {
  width: 100%;
  text-align: center;
  padding: 0.875rem 1.75rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.checkout-submit-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.checkout-btn-loading {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  justify-content: center;
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .checkout-header {
    padding: 1.25rem 1rem 0.75rem;
  }
  .checkout-body {
    padding: 1rem;
  }
  .checkout-footer {
    padding: 0.875rem 1rem 1.25rem;
  }
}
</style>
