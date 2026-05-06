<template>
  <!-- ── Product Order Modal ── -->
  <v-dialog v-model="show" max-width="860" scrim="rgba(30,15,10,0.65)">
    <v-card v-if="product" class="modal-root" rounded="xl" color="white">
      <v-row no-gutters>
        <!-- Image Column -->
        <v-col cols="12" md="5" class="modal-image-col">
          <v-img
            :src="product.image_url || 'https://placehold.co/600x600/FAF7F2/D97A6C?text=Adah'"
            class="modal-image"
            contain
            :aspect-ratio="4/5"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height" style="background: #FAF7F2;">
                <v-progress-circular indeterminate color="primary" size="32" width="2" />
              </div>
            </template>
          </v-img>
          <!-- View Full Image Button -->
          <v-btn
            variant="text"
            size="small"
            class="view-full-btn"
            @click.stop="showFullImage = true"
          >
            <v-icon size="16" class="mr-1">mdi-magnify-plus-outline</v-icon>
            View Full Image
          </v-btn>
        </v-col>

        <!-- Detail Column -->
        <v-col cols="12" md="7" class="modal-detail-col pa-4 pa-md-6">
          <div class="modal-header">
            <div>
              <span class="luxury-label modal-category">{{ product.category }}</span>
              <h2 class="modal-title serif-text">{{ product.name }}</h2>
              <div class="trending-badge modal-badge">Now Trending</div>
              <p class="modal-price">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</p>
            </div>
            <v-btn icon flat class="modal-close-btn" @click="show = false" aria-label="Close">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </div>

          <p class="modal-desc">{{ product.description }}</p>
          <v-divider class="mb-4" />
          <p class="modal-order-label">📦 Quick Order via WhatsApp</p>

          <!-- Quantity Selector -->
          <div class="qty-row">
            <span class="qty-label">Quantity</span>
            <div class="qty-control">
              <button type="button" class="qty-btn" :disabled="quantity <= 1" @click="quantity--" aria-label="Decrease quantity">−</button>
              <span class="qty-value">{{ quantity }}</span>
              <button type="button" class="qty-btn" :disabled="quantity >= 10" @click="quantity++" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="qty-total">
            Total: <strong>₹ {{ totalPrice.toLocaleString('en-IN') }}</strong>
          </div>

          <v-form @submit.prevent="placeOrder" v-model="formValid" class="modal-form">
            <v-text-field
              v-model="customerName"
              label="Your Name"
              variant="outlined"
              density="comfortable"
              :rules="nameRules"
              class="mb-2"
              maxlength="50"
              autocomplete="name"
            />
            <v-text-field
              v-model="customerPhone"
              label="WhatsApp Number"
              variant="outlined"
              density="comfortable"
              :rules="phoneRules"
              class="mb-4"
              type="tel"
              inputmode="numeric"
              maxlength="10"
              prefix="+91"
              autocomplete="tel"
              @input="sanitizePhone"
            />
            <!-- Desktop Buttons -->
            <div class="modal-btn-group d-none d-md-flex">
              <button
                type="submit"
                class="btn-terra modal-order-btn"
                :class="{ disabled: !formValid || loading }"
                :disabled="!formValid || loading"
              >
                <span v-if="loading" class="btn-loading">
                  <v-progress-circular size="16" width="2" indeterminate color="white" /> Opening WhatsApp…
                </span>
                <span v-else>Shop Now 🛍</span>
              </button>
              <button
                type="button"
                class="btn-outline modal-cart-btn"
                @click="addToCart"
              >
                <v-icon size="18" class="mr-1">mdi-cart-plus</v-icon>
                Add to Cart
              </button>
            </div>
          </v-form>
        </v-col>
      </v-row>

      <!-- Mobile Sticky Footer -->
      <div class="modal-sticky-footer d-md-none">
        <div class="modal-btn-group-mobile">
          <button
            type="button"
            class="btn-terra modal-order-btn"
            :class="{ disabled: !formValid || loading }"
            :disabled="!formValid || loading"
            @click="placeOrder"
          >
            <span v-if="loading" class="btn-loading">
              <v-progress-circular size="16" width="2" indeterminate color="white" /> Opening WhatsApp…
            </span>
            <span v-else>Shop Now 🛍</span>
          </button>
          <button
            type="button"
            class="btn-outline modal-cart-btn"
            @click="addToCart"
          >
            <v-icon size="18" class="mr-1">mdi-cart-plus</v-icon>
            Add to Cart
          </button>
        </div>
      </div>
    </v-card>
  </v-dialog>

  <!-- ── Full Image Viewer Dialog ── -->
  <v-dialog v-model="showFullImage" max-width="900" scrim="rgba(0,0,0,0.85)">
    <v-card color="transparent" flat class="full-image-card">
      <v-btn
        icon
        variant="flat"
        color="white"
        class="full-image-close"
        @click="showFullImage = false"
        aria-label="Close full image"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-img
        v-if="product"
        :src="product.image_url || 'https://placehold.co/600x600/FAF7F2/D97A6C?text=Adah'"
        contain
        max-height="80vh"
        class="full-image-view"
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { SupabaseService } from '../../services/SupabaseService'

const store = useStore()
const show = ref(false)
const showFullImage = ref(false)
const product = ref(null)
const customerName = ref('')
const customerPhone = ref('')
const formValid = ref(false)
const loading = ref(false)
const quantity = ref(1)

const totalPrice = computed(() => {
  if (!product.value) return 0
  return parseFloat(product.value.price) * quantity.value
})

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
const sanitizePhone = () => { customerPhone.value = customerPhone.value.replace(/\D/g, '').slice(0, 10) }

const open = (pProduct) => {
  product.value = pProduct
  customerName.value = ''
  customerPhone.value = ''
  quantity.value = 1
  showFullImage.value = false
  show.value = true
}

const placeOrder = () => {
  if (!formValid.value) return
  loading.value = true
  const lOrderData = { user_name: customerName.value, phone: customerPhone.value, product_name: product.value.name, price: product.value.price, quantity: quantity.value, total_price: totalPrice.value }
  SupabaseService.createOrder(lOrderData).then(() => {
    const lDate = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    const lUnitPrice = parseFloat(product.value.price).toLocaleString('en-IN')
    const lTotal = totalPrice.value.toLocaleString('en-IN')
    const lQtyLine = quantity.value > 1 ? `\n📊 Quantity: ${quantity.value} × ₹${lUnitPrice}` : ''
    const lMessage = `✨ ADAH JEWELRY — ORDER CONFIRMED ✨\n\n📦 Product: ${product.value.name}${lQtyLine}\n💰 Total: ₹${lTotal}\n\n👤 Customer: ${customerName.value}\n📞 Contact: +91 ${customerPhone.value.replace(/(\d{5})(\d{5})/, '$1 $2')}\n📅 Order Date: ${lDate}\n\nThank you for choosing Adah 💎\nYour order will be processed soon!`
    window.open(`https://wa.me/918643839796?text=${encodeURIComponent(lMessage)}`, '_blank')
    show.value = false
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Failed to place order', color: 'error' })
  }).finally(() => { loading.value = false })
}

const addToCart = () => {
  if (!product.value) return
  store.dispatch('cart/addItem', {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image_url: product.value.image_url,
    category: product.value.category,
    quantity: quantity.value
  })
  show.value = false
}

defineExpose({ open })
</script>

<style scoped>
/* ── Modal Root ── */
.modal-root {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  width: 100%;
}

/* ── Image Column ── */
.modal-image-col {
  overflow: hidden;
  background: #FAF7F2;
  position: relative;
}

.modal-image {
  width: 100%;
  background: #FAF7F2;
}

/* View Full Image Button */
.view-full-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border) !important;
  color: var(--text-primary) !important;
  font-family: var(--font-sans) !important;
  font-size: 0.72rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.06em !important;
  text-transform: none !important;
  border-radius: var(--radius-pill) !important;
  z-index: 2;
  transition: all var(--transition-base) !important;
}

.view-full-btn:hover {
  background: rgba(255, 255, 255, 1) !important;
  color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
}

/* ── Detail Column ── */
.modal-detail-col {
  background: white;
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  overflow-y: auto;
  max-height: 80vh;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* ── Header ── */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.modal-category { display: block; margin-bottom: 0.5rem; }
.modal-title { font-size: clamp(1.6rem, 3.5vw, 2.2rem); color: var(--text-primary); line-height: 1.1; margin-bottom: 0.625rem; }
.modal-badge { margin-bottom: 0.5rem; }
.modal-price { font-family: var(--font-sans); font-size: 1.45rem; font-weight: 700; color: var(--primary-hover); margin-top: 0.375rem; }

.modal-close-btn {
  background: var(--bg-offset) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border) !important;
  flex-shrink: 0;
}
.modal-close-btn:hover {
  background: var(--border) !important;
  color: var(--text-primary) !important;
}

/* ── Description ── */
.modal-desc {
  font-family: var(--font-sans);
  font-size: 0.93rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* ── Quantity Selector ── */
.qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.qty-label {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: background var(--transition-fast), color var(--transition-fast);
  user-select: none;
  line-height: 1;
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-muted);
  color: var(--primary-hover);
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty-value {
  width: 2.5rem;
  text-align: center;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  border-left: 1.5px solid var(--border);
  border-right: 1.5px solid var(--border);
  line-height: 2.25rem;
  background: white;
}

.qty-total {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-align: right;
}

.qty-total strong {
  color: var(--primary-hover);
  font-size: 1.1rem;
}

/* ── Order Form ── */
.modal-order-label {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.modal-order-btn {
  flex: 1;
  text-align: center;
  padding: 0.875rem 1.75rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.modal-btn-group {
  display: flex;
  gap: 0.625rem;
  width: 100%;
}

.modal-btn-group-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.modal-cart-btn {
  flex: 1;
  text-align: center;
  padding: 0.75rem 1rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.modal-order-btn.disabled { opacity: 0.6; cursor: not-allowed; pointer-events: none; }
.btn-loading { display: flex; align-items: center; gap: 0.625rem; justify-content: center; }

/* ── Mobile Sticky Footer ── */
.modal-sticky-footer {
  padding: 1rem 1.25rem;
  background: white;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

/* ── Full Image Viewer ── */
.full-image-card {
  position: relative;
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible;
}

.full-image-close {
  position: absolute;
  top: -3rem;
  right: 0;
  z-index: 10;
  opacity: 0.9;
}
.full-image-close:hover { opacity: 1; }

.full-image-view {
  border-radius: var(--radius-lg);
  background: #FAF7F2;
}

/* ── Mobile: Stack Layout ── */
@media (max-width: 959px) {
  .modal-root {
    display: flex;
    flex-direction: column;
    max-height: 92dvh;
    max-height: 92vh;
    overflow: hidden;
  }

  .modal-root > .v-row {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .modal-image-col {
    max-height: clamp(10rem, 30vw, 14rem);
    flex-shrink: 0;
  }

  .modal-detail-col {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    max-height: none;
  }
}
</style>
