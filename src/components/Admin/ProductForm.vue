<template>
  <v-dialog v-model="show" max-width="600px" persistent>
    <v-card class="premium-card">
      <v-card-title class="luxury-text pt-6 px-6">
        {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-form ref="form" v-model="formValid">
          <v-text-field
            v-model="product.name"
            label="Product Name"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Name is required']"
            required
          ></v-text-field>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="product.price"
                label="Price (₹)"
                type="number"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Price is required']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="product.category"
                label="Category"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Category is required']"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-textarea
            v-model="product.description"
            label="Description"
            variant="outlined"
            density="comfortable"
            rows="3"
            :rules="[v => !!v || 'Description is required']"
            required
          ></v-textarea>

          <v-file-input
            v-model="imageFile"
            label="Product Image"
            prepend-icon="mdi-camera"
            variant="outlined"
            density="comfortable"
            accept="image/*"
            @change="handleImageChange"
            :loading="uploading"
          ></v-file-input>

          <div v-if="product.image_url" class="mt-4">
            <p class="text-caption mb-2">Image Preview:</p>
            <v-img :src="product.image_url" height="150" contain class="border rounded"></v-img>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="show = false" :disabled="loading">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-pill px-8"
          :loading="loading"
          :disabled="!formValid || loading || uploading"
          @click="saveProduct"
        >
          {{ editingProduct ? 'Update' : 'Create' }}
        </v-btn>
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
