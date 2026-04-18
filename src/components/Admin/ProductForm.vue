<template>
  <v-dialog v-model="show" max-width="600px" persistent :max-height="$vuetify.display.xs ? '94dvh' : undefined">
    <div class="form-card" :style="$vuetify.display.xs ? 'display:flex;flex-direction:column;max-height:94dvh;max-height:94vh' : ''">
      <div class="form-header">
        <h2 class="form-title serif-text">
          {{ editingProduct ? 'Edit Product' : 'New Product' }}
        </h2>
        <button class="form-close-btn" @click="show = false" :disabled="loading">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <div class="form-body form-body--scroll">
        <v-form ref="form" v-model="formValid">
          <div class="form-field-group">
            <v-text-field
              v-model="product.name"
              label="Product Name"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Name is required']"
              required
            />
          </div>

          <div class="form-row">
            <v-text-field
              v-model="product.price"
              label="Price (₹)"
              variant="outlined"
              density="comfortable"
              type="tel"
              inputmode="numeric"
              :rules="priceRules"
              @input="sanitizePrice"
              required
            />
            <v-text-field
              v-model="product.category"
              label="Category"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Category is required']"
              required
            />
          </div>

          <div class="form-field-group">
            <v-textarea
              v-model="product.description"
              label="Description"
              variant="outlined"
              density="comfortable"
              rows="3"
              :rules="[v => !!v || 'Description is required']"
              required
            />
          </div>

          <div class="form-field-group">
            <v-file-input
              v-model="imageFile"
              label="Product Image"
              prepend-icon="mdi-image-outline"
              variant="outlined"
              density="comfortable"
              accept="image/*"
              :loading="uploading"
              @change="handleImageChange"
            />
          </div>

          <div v-if="product.image_url" class="image-preview">
            <p class="preview-label luxury-label">Image Preview</p>
            <img :src="product.image_url" alt="Product preview" class="preview-img" />
          </div>
        </v-form>
      </div>

      <div class="form-footer">
        <button class="form-btn form-cancel" @click="show = false" :disabled="loading">
          Cancel
        </button>
        <button
          class="btn-terra form-btn form-submit"
          :disabled="!formValid || loading || uploading"
          :class="{ disabled: !formValid || loading || uploading }"
          @click="saveProduct"
        >
          <span v-if="loading" class="btn-loading">
            <v-progress-circular size="14" width="2" indeterminate color="white" />
            Saving…
          </span>
          <span v-else>{{ editingProduct ? 'Update Product' : 'Create Product' }}</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'
import { useStore } from 'vuex'

const store = useStore()
const show = ref(false)
const loading = ref(false)
const uploading = ref(false)
const formValid = ref(false)
const editingProduct = ref(null)
const imageFile = ref(null)

// ── Validation Rules ──
const priceRules = [
  v => !!v                        || 'Price is required',
  v => /^\d+$/.test(v)           || 'Only numbers allowed',
  v => parseInt(v) > 0           || 'Price must be greater than 0',
  v => parseInt(v) <= 999999     || 'Price seems too high'
]

const sanitizePrice = () => {
  product.price = product.price.toString().replace(/\D/g, '')
}

const product = reactive({
  name: '',
  price: '',
  category: '',
  description: '',
  image_url: '',
  is_active: true
})

const open = (pProduct = null) => {
  if (pProduct) {
    editingProduct.value = pProduct
    Object.assign(product, pProduct)
  } else {
    editingProduct.value = null
    resetForm()
  }
  show.value = true
}

const resetForm = () => {
  product.name = ''
  product.price = ''
  product.category = ''
  product.description = ''
  product.image_url = ''
  product.is_active = true
  imageFile.value = null
}

const handleImageChange = (pEvent) => {
  const lFile = pEvent.target.files[0]
  if (!lFile) return

  uploading.value = true
  SupabaseService.uploadProductImage(lFile).then(({ data, error }) => {
    if (error) throw error
    return SupabaseService.getPublicUrl(data.path)
  }).then(({ data }) => {
    product.image_url = data.publicUrl
    uploading.value = false
    store.dispatch('snackbar/show', { text: 'Image uploaded successfully', color: 'success' })
  }).catch((pError) => {
    uploading.value = false
    store.dispatch('snackbar/show', { text: pError.message || 'Image upload failed', color: 'error' })
  })
}

const saveProduct = () => {
  if (!product.image_url) {
    store.dispatch('snackbar/show', { text: 'Please upload an image', color: 'warning' })
    return
  }

  loading.value = true
  const lOperation = editingProduct.value
    ? SupabaseService.updateProduct(editingProduct.value.id, product)
    : SupabaseService.createProduct(product)

  lOperation.then(({ error }) => {
    if (error) throw error
    store.dispatch('snackbar/show', { text: `Product ${editingProduct.value ? 'updated' : 'created'} successfully`, color: 'success' })
    show.value = false
    emit('saved')
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Operation failed', color: 'error' })
  }).finally(() => {
    loading.value = false
  })
}

const emit = defineEmits(['saved'])
defineExpose({ open })
</script>

<style scoped>
.form-card {
  background: var(--card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* ── Mobile: make card fill available height with sticky footer ── */
@media (max-width: 599px) {
  .form-card {
    display: flex;
    flex-direction: column;
    max-height: 94dvh;
    max-height: 94vh; /* fallback for older browsers */
    border-radius: var(--radius-lg);
  }
}

/* ── Header ── */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px 0;
}

.form-title {
  font-size: 1.6rem;
  color: var(--text-primary);
}

.form-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-offset);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.form-close-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

/* ── Body ── */
.form-body {
  padding: 24px 32px;
}

/* Scrollable body on mobile */
@media (max-width: 599px) {
  .form-body--scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px 20px 12px;
  }

  .form-header {
    padding: 22px 20px 0;
    flex-shrink: 0;
  }

  .form-footer {
    flex-shrink: 0;
    padding: 14px 20px 20px;
    border-top: 1px solid var(--border);
    background: var(--card);
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.form-field-group {
  margin-bottom: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 4px;
}

/* ── Image Preview ── */
.image-preview {
  margin-top: 12px;
}

.preview-label {
  margin-bottom: 8px;
}

.preview-img {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg);
}

/* ── Footer ── */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 32px 28px;
}

.form-btn {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.form-cancel {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.form-cancel:hover:not(:disabled) {
  background: var(--bg-offset);
  color: var(--text-primary);
}

.form-submit {
  border: none;
  padding: 10px 28px !important;
  border-radius: var(--radius-md) !important;
}

.form-submit.disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
