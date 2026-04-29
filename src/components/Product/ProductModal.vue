<template>
  <v-dialog v-model="show" max-width="860px" scrim="rgba(30,15,10,0.65)">
    <v-card v-if="product" class="modal-root" rounded="xl" color="white">
      <v-row no-gutters class="modal-grid-row">
        <!-- Image Column -->
        <v-col cols="12" md="5" class="modal-image-col d-flex">
          <v-img :src="product.image_url || 'https://placehold.co/600x600/FAF7F2/D97A6C?text=Adah'" cover position="center 30%" class="modal-image flex-grow-1" />
        </v-col>

        <!-- Detail Column -->
        <v-col cols="12" md="7" class="modal-detail-col">
          <div class="modal-header">
            <div>
              <span class="luxury-label modal-category">{{ product.category }}</span>
              <h2 class="modal-title serif-text">{{ product.name }}</h2>
              <div class="trending-badge modal-badge">Now Trending</div>
              <p class="modal-price">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</p>
            </div>
            <v-btn icon flat class="modal-close-desktop" @click="show = false" aria-label="Close">
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </div>
          <p class="modal-desc">{{ product.description }}</p>
          <div class="modal-divider" />
          <p class="modal-order-label">📦 Quick Order via WhatsApp</p>
          <v-form @submit.prevent="placeOrder" v-model="formValid" class="modal-form">
            <v-text-field v-model="customerName" label="Your Name" variant="outlined" density="comfortable" :rules="nameRules" class="mb-2" maxlength="50" autocomplete="name" />
            <v-text-field v-model="customerPhone" label="WhatsApp Number" variant="outlined" density="comfortable" :rules="phoneRules" class="mb-4" type="tel" inputmode="numeric" maxlength="10" prefix="+91" autocomplete="tel" @input="sanitizePhone" />
            
            <button type="submit" class="btn-terra modal-order-btn modal-order-btn--desktop" :class="{ disabled: !formValid || loading }" :disabled="!formValid || loading">
              <span v-if="loading" class="btn-loading"><v-progress-circular size="16" width="2" indeterminate color="white" /> Opening WhatsApp…</span>
              <span v-else>Shop Now 🛍</span>
            </button>
          </v-form>
        </v-col>
      </v-row>
      <div class="modal-sticky-footer">
        <button type="button" class="btn-terra modal-order-btn" :class="{ disabled: !formValid || loading }" :disabled="!formValid || loading" @click="placeOrder">
          <span v-if="loading" class="btn-loading"><v-progress-circular size="16" width="2" indeterminate color="white" /> Opening WhatsApp…</span>
          <span v-else>Shop Now 🛍</span>
        </button>
      </div>
    </v-card>
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
  show.value = true
}

const placeOrder = () => {
  if (!formValid.value) return
  loading.value = true
  const lOrderData = { user_name: customerName.value, phone: customerPhone.value, product_name: product.value.name, price: product.value.price }
  SupabaseService.createOrder(lOrderData).then(() => {
    const lMessage = `✨ ADAH JEWELRY ORDER ✨\n🛍 Product: ${product.value.name}\n💰 Price: ₹${parseFloat(product.value.price).toLocaleString('en-IN')}\n\n👤 Customer:\nName: ${customerName.value}\nPhone: +91${customerPhone.value}\n\n🕒 Date: ${new Date().toLocaleString()}\n\nThank you for choosing Adah 💎`
    window.open(`https://wa.me/918643839796?text=${encodeURIComponent(lMessage)}`, '_blank')
    show.value = false
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Failed to place order', color: 'error' })
  }).finally(() => { loading.value = false })
}

defineExpose({ open })
</script>

<style scoped>
.modal-root { background: white; border-radius: var(--radius-xl); overflow: hidden; position: relative; width: 100%; }
.modal-grid-row { min-height: 0; }
.modal-image-col { overflow: hidden; background: var(--bg-offset); }
.modal-image { width: 100%; object-position: center center; }
.modal-detail-col { padding: 2.5rem 2.75rem; background: white; display: flex; flex-direction: column; overflow-y: auto; max-height: 80vh; color: var(--text-primary); }
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
.modal-category { display: block; margin-bottom: 0.5rem; }
.modal-title { font-size: clamp(1.6rem, 3.5vw, 2.2rem); color: var(--text-primary); line-height: 1.1; margin-bottom: 0.625rem; }
.modal-badge { margin-bottom: 0.5rem; }
.modal-price { font-family: var(--font-sans); font-size: 1.45rem; font-weight: 700; color: var(--primary-hover); margin-top: 0.375rem; }
.modal-close-desktop { background: var(--bg-offset) !important; color: var(--text-secondary) !important; border: 1px solid var(--border) !important; flex-shrink: 0; }
.modal-close-desktop:hover { background: var(--border) !important; color: var(--text-primary) !important; }
.modal-desc { font-family: var(--font-sans); font-size: 0.93rem; line-height: 1.75; color: var(--text-secondary); margin-bottom: 1.5rem; }
.modal-divider { height: 1px; background: var(--border); margin-bottom: 1.5rem; }
.modal-order-label { font-family: var(--font-sans); font-size: 0.88rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem; }
.modal-form { display: flex; flex-direction: column; gap: 0; }
.modal-order-btn { width: 100%; text-align: center; padding: 0.875rem 1.75rem !important; border-radius: var(--radius-md) !important; font-size: 0.95rem; }
.modal-order-btn.disabled { opacity: 0.6; cursor: not-allowed; pointer-events: none; }
.btn-loading { display: flex; align-items: center; gap: 0.625rem; justify-content: center; }
.modal-sticky-footer { padding: 1rem 1.25rem; background: white; border-top: 1px solid var(--border); flex-shrink: 0; }

@media (max-width: 1024px) {
  .modal-root { display: flex; flex-direction: column; max-height: 92dvh; max-height: 92vh; overflow: hidden; }
  .modal-image-col { height: clamp(10rem, 28vw, 13.75rem); flex-shrink: 0; }
  .modal-detail-col { flex: 1; min-height: 0; padding: 1.25rem; overflow-y: auto; -webkit-overflow-scrolling: touch; max-height: none; }
  .modal-order-btn:not(.modal-sticky-footer .modal-order-btn) { display: none; }
}
@media (min-width: 1025px) {
  .modal-sticky-footer { display: none; }
  .modal-order-btn--desktop { display: block; }
}
</style>
