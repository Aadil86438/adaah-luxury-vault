<template>
  <v-dialog v-model="show" max-width="600px" persistent>
    <v-card class="form-card" rounded="xl" color="white">
      <div class="form-header">
        <h2 class="form-title serif-text">{{ editingProduct ? 'Edit Product' : 'New Product' }}</h2>
        <v-btn icon flat class="form-close-btn" @click="show = false" :disabled="loading">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
      <v-card-text class="form-body">
        <v-form ref="form" v-model="formValid">
          <v-text-field v-model="product.name" label="Product Name" variant="outlined" density="comfortable" :rules="[v => !!v || 'Name is required']" required class="mb-4" />
          
          <v-row dense class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field v-model="product.price" label="Price (₹)" variant="outlined" density="comfortable" type="tel" inputmode="numeric" :rules="priceRules" @input="sanitizePrice" required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="product.category" label="Category" variant="outlined" density="comfortable" :rules="[v => !!v || 'Category is required']" required />
            </v-col>
          </v-row>

          <v-textarea v-model="product.description" label="Description" variant="outlined" density="comfortable" rows="3" :rules="[v => !!v || 'Description is required']" required class="mb-4" />
          
          <v-file-input v-model="imageFile" label="Product Image" prepend-icon="mdi-image-outline" variant="outlined" density="comfortable" accept="image/*" :loading="uploading" @change="handleImageChange" class="mb-4" />
          
          <div v-if="product.image_url" class="image-preview">
            <p class="preview-label luxury-label">Image Preview</p>
            <img :src="product.image_url" alt="Product preview" class="preview-img" />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="form-footer">
        <button class="form-btn form-cancel" @click="show = false" :disabled="loading">Cancel</button>
        <button class="btn-terra form-btn form-submit" :disabled="!formValid || loading || uploading" :class="{ disabled: !formValid || loading || uploading }" @click="saveProduct">
          <span v-if="loading" class="btn-loading"><v-progress-circular size="14" width="2" indeterminate color="white" /> Saving…</span>
          <span v-else>{{ editingProduct ? 'Update Product' : 'Create Product' }}</span>
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'
import { useStore } from 'vuex'

const store = useStore()
const show = ref(false)
const loading = ref(false)
const uploading = ref(false)
const formValid = ref(false)
const editingProduct = ref(null)
const imageFile = ref(null)

const priceRules = [
  v => !!v || 'Price is required',
  v => /^\d+$/.test(v) || 'Only numbers allowed',
  v => parseInt(v) > 0 || 'Price must be greater than 0',
  v => parseInt(v) <= 999999 || 'Price seems too high'
]
const sanitizePrice = () => { product.price = product.price.toString().replace(/\D/g, '') }

const product = reactive({ name: '', price: '', category: '', description: '', image_url: '', is_active: true })

const open = (pProduct = null) => {
  if (pProduct) { editingProduct.value = pProduct; Object.assign(product, pProduct) }
  else { editingProduct.value = null; resetForm() }
  show.value = true
}

const resetForm = () => { product.name = ''; product.price = ''; product.category = ''; product.description = ''; product.image_url = ''; product.is_active = true; imageFile.value = null }

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
  if (!product.image_url) { store.dispatch('snackbar/show', { text: 'Please upload an image', color: 'warning' }); return }
  loading.value = true
  const lOperation = editingProduct.value ? SupabaseService.updateProduct(editingProduct.value.id, product) : SupabaseService.createProduct(product)
  lOperation.then(({ error }) => {
    if (error) throw error
    store.dispatch('snackbar/show', { text: `Product ${editingProduct.value ? 'updated' : 'created'} successfully`, color: 'success' })
    show.value = false
    emit('saved')
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Operation failed', color: 'error' })
  }).finally(() => { loading.value = false })
}

const emit = defineEmits(['saved'])
const form = ref(null)
defineExpose({ open })
</script>

<style scoped>
.form-card { background: white; border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; max-height: 94vh; color: var(--text-primary); }
.form-header { display: flex; justify-content: space-between; align-items: center; padding: 1.75rem 2rem 0.5rem; flex-shrink: 0; }
.form-title { font-size: 1.6rem; color: var(--text-primary); }
.form-close-btn { background: var(--bg-offset) !important; color: var(--text-secondary) !important; border: 1px solid var(--border) !important; }
.form-close-btn:hover { background: var(--border) !important; color: var(--text-primary) !important; }
.form-body { padding: 1.5rem 2rem; flex: 1; min-height: 0; overflow-y: auto; }
.image-preview { margin-top: 0.75rem; }
.preview-label { margin-bottom: 0.5rem; }
.preview-img { width: 100%; max-height: 10rem; object-fit: contain; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg); }
.form-footer { display: flex; justify-content: flex-end; gap: 0.625rem; padding: 1rem 2rem 1.75rem; flex-shrink: 0; }
.form-btn { font-family: var(--font-sans); font-size: 0.88rem; font-weight: 500; padding: 0.625rem 1.5rem; border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-base); }
.form-cancel { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.form-cancel:hover:not(:disabled) { background: var(--bg-offset); color: var(--text-primary); }
.form-submit { border: none; padding: 0.625rem 1.75rem !important; border-radius: var(--radius-md) !important; }
.form-submit.disabled { opacity: 0.55; cursor: not-allowed; pointer-events: none; }
.btn-loading { display: flex; align-items: center; gap: 0.5rem; }

@media (max-width: 639px) {
  .form-header { padding: 1.375rem 1.25rem 0.25rem; }
  .form-body { padding: 1.25rem 1.25rem; }
  .form-footer { padding: 0.875rem 1.25rem 1.25rem; }
}
</style>

