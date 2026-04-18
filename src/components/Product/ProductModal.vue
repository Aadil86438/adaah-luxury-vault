<template>
  <v-dialog v-model="show" max-width="860px" scrim="rgba(30,15,10,0.65)" :max-height="$vuetify.display.xs ? '92dvh' : undefined">
    <div v-if="product" class="modal-root">
      <!-- Close button (mobile absolute) -->
      <button class="modal-close d-md-none" @click="show = false" aria-label="Close">
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <div class="modal-grid">
        <!-- Left: Product Image -->
        <div class="modal-image-col">
          <v-img
            :src="product.image_url || 'https://placehold.co/600x600/FAF7F2/D97A6C?text=Adaah'"
            cover
            height="100%"
            class="modal-image"
            :max-height="$vuetify.display.xs ? '280px' : '100%'"
          />
        </div>

        <!-- Right: Product Details -->
        <div class="modal-detail-col">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <span class="luxury-label modal-category">{{ product.category }}</span>
              <h2 class="modal-title serif-text">{{ product.name }}</h2>
              <div class="trending-badge modal-badge">Now Trending</div>
              <p class="modal-price">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</p>
            </div>
            <button class="modal-close-desktop d-none d-md-flex" @click="show = false" aria-label="Close">
              <v-icon size="20">mdi-close</v-icon>
            </button>
          </div>

          <p class="modal-desc">{{ product.description }}</p>

          <div class="modal-divider" />

          <p class="modal-order-label">📦 Quick Order via WhatsApp</p>

          <v-form @submit.prevent="handleOrder" v-model="formValid" class="modal-form">
            <div class="form-row">
              <v-text-field
                v-model="customerName"
                label="Your Name"
                variant="outlined"
                density="comfortable"
                :rules="nameRules"
                hide-details="auto"
                class="form-field"
                maxlength="50"
                autocomplete="name"
              />
              <v-text-field
                v-model="customerPhone"
                label="WhatsApp Number"
                variant="outlined"
                density="comfortable"
                :rules="phoneRules"
                hide-details="auto"
                class="form-field"
                type="tel"
                inputmode="numeric"
                maxlength="10"
                prefix="+91"
                autocomplete="tel"
                @input="sanitizePhone"
              />
            </div>
          </v-form>
        </div>
      </div>

      <!-- ── Sticky Order Button (always visible on mobile) ── -->
      <div class="modal-sticky-footer">
        <button
          type="button"
          class="btn-terra modal-order-btn"
          :class="{ disabled: !formValid || loading }"
          :disabled="!formValid || loading"
          @click="handleOrder"
        >
          <span v-if="loading" class="btn-loading">
            <v-progress-circular size="16" width="2" indeterminate color="white" />
            Processing…
          </span>
          <span v-else>Shop Now 🛍</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { SupabaseService } from '../../services/SupabaseService'

const store = useStore()
const show = ref(false)
const product = ref(null)
const customerName = ref('')
const customerPhone = ref('')
const formValid = ref(false)
const loading = ref(false)

// ── Validation Rules ──
const nameRules = [
  v => !!v?.trim()            || 'Name is required',
  v => v?.trim().length >= 2  || 'Name must be at least 2 characters',
  v => /^[a-zA-Z\s'-]+$/.test(v?.trim()) || 'Name must contain letters only'
]

const phoneRules = [
  v => !!v                    || 'Phone number is required',
  v => /^\d+$/.test(v)       || 'Only digits are allowed',
  v => v?.length === 10       || 'Must be exactly 10 digits'
]

// Strip any non-digit characters as user types
const sanitizePhone = () => {
  customerPhone.value = customerPhone.value.replace(/\D/g, '').slice(0, 10)
}

const open = (pProduct) => {
  product.value = pProduct
  customerName.value = ''
  customerPhone.value = ''
  show.value = true
}

const handleOrder = () => {
  if (!formValid.value) return
  loading.value = true

  const lOrderData = {
    user_name: customerName.value,
    phone: customerPhone.value,
    product_name: product.value.name,
    price: product.value.price
  }

  SupabaseService.createOrder(lOrderData).then(() => {
    store.dispatch('snackbar/show', { text: 'Order saved! Redirecting to WhatsApp...', color: 'success' })

    const lMessage = `✨ ADAAH JEWELRY ORDER ✨
🛍 Product: ${product.value.name}
💰 Price: ₹${parseFloat(product.value.price).toLocaleString('en-IN')}

👤 Customer:
Name: ${customerName.value}
Phone: ${customerPhone.value}

🕒 Date: ${new Date().toLocaleString()}

Thank you for choosing Adaah 💎`

    setTimeout(() => {
      window.open(`https://wa.me/918643839796?text=${encodeURIComponent(lMessage)}`, '_blank')
      show.value = false
      loading.value = false
    }, 1500)
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Failed to save order', color: 'error' })
    loading.value = false
  })
}

defineExpose({ open })
</script>

<style scoped>
/* ── Modal Root ── */
.modal-root {
  background: var(--card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
}

/* ── Grid ── */
.modal-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  min-height: 480px;
}

/* ── Image Column ── */
.modal-image-col {
  overflow: hidden;
  background: var(--bg-offset);
}

.modal-image {
  height: 100%;
}

/* ── Detail Column ── */
.modal-detail-col {
  padding: 40px 44px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 80vh;
}

/* ── Header ── */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-category {
  display: block;
  margin-bottom: 8px;
}

.modal-title {
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 10px;
}

.modal-badge {
  margin-bottom: 8px;
}

.modal-price {
  font-family: var(--font-sans);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--primary-hover);
  margin-top: 6px;
}

/* ── Close Buttons ── */
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--card);
  color: var(--text-primary);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-offset);
}

.modal-close-desktop {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-offset);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--transition-fast);
}

.modal-close-desktop:hover {
  background: var(--border);
  color: var(--text-primary);
}

/* ── Description ── */
.modal-desc {
  font-family: var(--font-sans);
  font-size: 0.93rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* ── Divider ── */
.modal-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 24px;
}

/* ── Order Form ── */
.modal-order-label {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-order-btn {
  width: 100%;
  text-align: center;
  padding: 14px 28px !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.95rem;
}

.modal-order-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

/* ── Sticky Footer Button ── */
.modal-sticky-footer {
  padding: 16px 20px;
  background: var(--card);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .modal-root {
    display: flex;
    flex-direction: column;
    max-height: 92dvh;
    max-height: 92vh; /* fallback */
  }

  .modal-grid {
    grid-template-columns: 1fr;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .modal-image-col {
    height: 230px;
    flex-shrink: 0;
  }

  .modal-image {
    height: 230px;
    max-height: 230px;
  }

  .modal-detail-col {
    padding: 22px 20px 20px;
    max-height: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
    min-height: 0;
  }

  /* Hide the non-sticky button area padding on mobile */
  .modal-order-btn:not(.modal-sticky-footer .modal-order-btn) {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 8px;
  }
}

/* On desktop, hide the sticky footer — button is inline */
@media (min-width: 769px) {
  .modal-sticky-footer {
    display: none;
  }

  /* Restore inline button */
  .modal-detail-col .modal-order-btn {
    display: block;
  }

  /* Re-add bottom form margin on desktop */
  .modal-form {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .modal-image-col {
    height: 200px;
  }

  .modal-image {
    height: 200px;
    max-height: 200px;
  }

  .modal-detail-col {
    padding: 18px 16px 16px;
  }
}
</style>
