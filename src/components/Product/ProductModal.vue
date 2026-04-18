<template>
  <v-dialog v-model="show" max-width="860px" scrim="rgba(30,15,10,0.65)" :max-height="$vuetify.display.xs ? '92dvh' : undefined">
    <div v-if="product" class="modal-root">

      <!-- ── STEP 1: Product + Order Form ── -->
      <template v-if="step === 1">
        <!-- Close button (mobile) -->
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
              :max-height="$vuetify.display.xs ? '230px' : '100%'"
            />
          </div>

          <!-- Right: Product Details -->
          <div class="modal-detail-col">
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

            <v-form @submit.prevent="goToPayment" v-model="formValid" class="modal-form">
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

            <!-- Inline button — visible on desktop only -->
            <button
              type="submit"
              class="btn-terra modal-order-btn modal-order-btn--desktop"
              :class="{ disabled: !formValid || loading }"
              :disabled="!formValid || loading"
            >
              <span v-if="loading" class="btn-loading">
                <v-progress-circular size="16" width="2" indeterminate color="white" />
                Processing…
              </span>
              <span v-else>Shop Now 🛍</span>
            </button>
            </v-form>
          </div>
        </div>

        <!-- Sticky footer button -->
        <div class="modal-sticky-footer">
          <button
            type="button"
            class="btn-terra modal-order-btn"
            :class="{ disabled: !formValid || loading }"
            :disabled="!formValid || loading"
            @click="goToPayment"
          >
            <span v-if="loading" class="btn-loading">
              <v-progress-circular size="16" width="2" indeterminate color="white" />
              Processing…
            </span>
            <span v-else>Shop Now 🛍</span>
          </button>
        </div>
      </template>

      <!-- ── STEP 2: QR Payment Screen ── -->
      <template v-if="step === 2">
        <div class="payment-screen">
          <!-- Back button -->
          <button class="pay-back-btn" @click="step = 1" aria-label="Go back">
            <v-icon size="18">mdi-arrow-left</v-icon>
            Back
          </button>

          <div class="pay-header">
            <p class="pay-step-label luxury-label">Step 2 of 2 — Payment</p>
            <h2 class="pay-title serif-text">Scan & Pay</h2>
            <p class="pay-subtitle">Scan the QR below using any UPI app to complete your purchase</p>
          </div>

          <!-- Order summary pill -->
          <div class="pay-summary">
            <span class="pay-product-name">{{ product.name }}</span>
            <span class="pay-amount">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</span>
          </div>

          <!-- PhonePe QR -->
          <div class="qr-wrapper">
            <div class="qr-badge">
              <img src="/payment-qr.png" alt="PhonePe QR — A Mohammed Aadil" class="qr-img" />
            </div>
            <p class="qr-name">A Mohammed Aadil</p>
            <div class="qr-upi-logos">
              <span class="upi-chip">PhonePe</span>
              <span class="upi-chip">GPay</span>
              <span class="upi-chip">Paytm</span>
              <span class="upi-chip">Any UPI</span>
            </div>
          </div>

          <!-- Confirm paid button -->
          <div class="pay-actions">
            <button
              class="btn-terra pay-confirm-btn"
              :class="{ disabled: confirmLoading }"
              :disabled="confirmLoading"
              @click="confirmPaid"
            >
              <span v-if="confirmLoading" class="btn-loading">
                <v-progress-circular size="16" width="2" indeterminate color="white" />
                Opening WhatsApp…
              </span>
              <span v-else>✅ I've Paid — Confirm Order</span>
            </button>
            <p class="pay-note">
              After payment, tap above to send your order details on WhatsApp
            </p>
          </div>
        </div>
      </template>

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
const confirmLoading = ref(false)
const step = ref(1) // 1 = form, 2 = QR payment

// ── Validation Rules ──
const nameRules = [
  v => !!v?.trim()            || 'Name is required',
  v => v?.trim().length >= 2  || 'Must be at least 2 characters',
  v => /^[a-zA-Z\s'-]+$/.test(v?.trim()) || 'Letters only'
]

const phoneRules = [
  v => !!v                    || 'Phone number is required',
  v => /^\d+$/.test(v)       || 'Only digits are allowed',
  v => v?.length === 10       || 'Must be exactly 10 digits'
]

const sanitizePhone = () => {
  customerPhone.value = customerPhone.value.replace(/\D/g, '').slice(0, 10)
}

const open = (pProduct) => {
  product.value = pProduct
  customerName.value = ''
  customerPhone.value = ''
  step.value = 1
  show.value = true
}

// Step 1 → save order → show QR
const goToPayment = () => {
  if (!formValid.value) return
  loading.value = true

  const lOrderData = {
    user_name: customerName.value,
    phone: customerPhone.value,
    product_name: product.value.name,
    price: product.value.price
  }

  SupabaseService.createOrder(lOrderData).then(() => {
    loading.value = false
    step.value = 2
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Failed to save order', color: 'error' })
    loading.value = false
  })
}

// Step 2 → open WhatsApp after payment
const confirmPaid = () => {
  confirmLoading.value = true

  const lMessage = `✨ ADAAH JEWELRY ORDER ✨
🛍 Product: ${product.value.name}
💰 Price: ₹${parseFloat(product.value.price).toLocaleString('en-IN')}
💳 Payment: Done via PhonePe/UPI

👤 Customer:
Name: ${customerName.value}
Phone: ${customerPhone.value}

🕒 Date: ${new Date().toLocaleString()}

Thank you for choosing Adaah 💎`

  setTimeout(() => {
    window.open(`https://wa.me/918643839796?text=${encodeURIComponent(lMessage)}`, '_blank')
    show.value = false
    confirmLoading.value = false
    step.value = 1
  }, 800)
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

.modal-category { display: block; margin-bottom: 8px; }

.modal-title {
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 10px;
}

.modal-badge { margin-bottom: 8px; }

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
  top: 12px; right: 12px;
  z-index: 10;
  width: 36px; height: 36px;
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
.modal-close:hover { background: var(--bg-offset); }

.modal-close-desktop {
  width: 36px; height: 36px;
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
.modal-close-desktop:hover { background: var(--border); color: var(--text-primary); }

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

.modal-form { display: flex; flex-direction: column; gap: 0; }

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

/* ═══════════════════════════════════════
   STEP 2 — QR PAYMENT SCREEN
═══════════════════════════════════════ */
.payment-screen {
  padding: 28px 32px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--card);
  min-height: 400px;
  position: relative;
}

.pay-back-btn {
  position: absolute;
  top: 20px; left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}
.pay-back-btn:hover { color: var(--text-primary); background: var(--bg-offset); }

.pay-header { margin-top: 8px; margin-bottom: 20px; }

.pay-step-label { margin-bottom: 6px; }

.pay-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--text-primary);
  margin-bottom: 8px;
}

.pay-subtitle {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 380px;
}

/* ── Order Summary Pill ── */
.pay-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-offset);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 10px 20px;
  width: 100%;
  max-width: 380px;
  margin-bottom: 24px;
  gap: 12px;
}

.pay-product-name {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pay-amount {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--primary-hover);
  flex-shrink: 0;
}

/* ── QR Box ── */
.qr-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.qr-badge {
  background: #fff;
  border-radius: var(--radius-lg);
  border: 2px solid var(--border);
  padding: 12px;
  box-shadow: var(--shadow-md);
}

.qr-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  display: block;
  border-radius: var(--radius-md);
}

.qr-name {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0;
}

.qr-upi-logos {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.upi-chip {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--primary-muted);
  color: var(--primary-hover);
  border: 1px solid rgba(217, 122, 108, 0.2);
}

/* ── Confirm Paid Button ── */
.pay-actions { width: 100%; max-width: 380px; }

.pay-confirm-btn {
  width: 100%;
  padding: 15px 28px !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.95rem;
  font-weight: 600 !important;
  margin-bottom: 12px;
}

.pay-confirm-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.pay-note {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .modal-root {
    display: flex;
    flex-direction: column;
    max-height: 92dvh;
    max-height: 92vh;
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

  .modal-image { height: 230px; max-height: 230px; }

  .modal-detail-col {
    padding: 22px 20px 20px;
    max-height: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
    min-height: 0;
  }

  .modal-order-btn:not(.modal-sticky-footer .modal-order-btn) { display: none; }

  .form-row {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 8px;
  }

  .payment-screen {
    padding: 60px 20px 28px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .qr-img { width: 170px; height: 170px; }
  .modal-order-btn--desktop { display: none; }
}

/* On desktop: hide sticky footer, show inline button */
@media (min-width: 769px) {
  .modal-sticky-footer { display: none; }
  .modal-order-btn--desktop { display: block; }
  .modal-form { margin-bottom: 0; }
}

@media (max-width: 480px) {
  .modal-image-col { height: 200px; }
  .modal-image { height: 200px; max-height: 200px; }
  .modal-detail-col { padding: 18px 16px 16px; }
}
</style>
