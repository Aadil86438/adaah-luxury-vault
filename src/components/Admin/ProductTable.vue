<template>
  <div>
    <v-toolbar density="comfortable" class="bg-surface px-4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search Products"
        variant="solo-filled"
        flat
        hide-details
        density="compact"
        class="max-width-300"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-select
        v-model="categoryFilter"
        :items="['All', ...categories]"
        label="Filter Category"
        variant="solo-filled"
        flat
        hide-details
        density="compact"
        class="max-width-200 ml-4"
      ></v-select>
    </v-toolbar>

    <v-table>
      <thead class="bg-surface opacity-80">
        <tr>
          <th class="luxury-text">Image</th>
          <th class="luxury-text">Name</th>
          <th class="luxury-text">Price</th>
          <th class="luxury-text">Category</th>
          <th class="luxury-text">Status</th>
          <th class="luxury-text">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td class="py-2">
            <v-avatar rounded size="50">
              <v-img :src="product.image_url" cover></v-img>
            </v-avatar>
          </td>
          <td class="font-weight-bold">{{ product.name }}</td>
          <td>₹{{ parseFloat(product.price).toLocaleString() }}</td>
          <td>
            <v-chip size="small" variant="tonal" color="primary">{{ product.category }}</v-chip>
          </td>
          <td>
            <v-switch
              :model-value="product.is_active"
              @change="toggleStatus(product)"
              color="success"
              hide-details
              density="compact"
            ></v-switch>
          </td>
          <td>
            <v-btn icon="mdi-pencil" variant="text" size="small" @click="$emit('edit', product)"></v-btn>
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmDelete(product)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <ConfirmDialog ref="deleteDialog" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'
import { useStore } from 'vuex'
import ConfirmDialog from '../Shared/ConfirmDialog.vue'

const store = useStore()
const products = ref([])
const search = ref('')
const categoryFilter = ref('All')
const deleteDialog = ref(null)

const categories = computed(() => {
  return [...new Set(products.value.map(p => p.category))]
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const lMatchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const lMatchCat = categoryFilter.value === 'All' || p.category === categoryFilter.value
    return lMatchSearch && lMatchCat
  })
})

const fetchProducts = () => {
  SupabaseService.getProducts().then(({ data }) => {
    products.value = data || []
  })
}

const toggleStatus = (pProduct) => {
  const lNewStatus = !pProduct.is_active
  SupabaseService.updateProduct(pProduct.id, { is_active: lNewStatus }).then(() => {
    pProduct.is_active = lNewStatus
    store.dispatch('snackbar/show', { text: `Product ${lNewStatus ? 'activated' : 'deactivated'}`, color: 'success' })
  })
}

const confirmDelete = (pProduct) => {
  deleteDialog.value.open('Delete Product', `Are you sure you want to delete "${pProduct.name}"?`).then((pConfirmed) => {
    if (pConfirmed) {
      SupabaseService.deleteProduct(pProduct.id).then(() => {
        products.value = products.value.filter(p => p.id !== pProduct.id)
        store.dispatch('snackbar/show', { text: 'Product deleted', color: 'success' })
      })
    }
  })
}

onMounted(() => {
  fetchProducts()
})

defineEmits(['edit'])
</script>

<style scoped>
.max-width-300 { max-width: 300px; }
.max-width-200 { max-width: 200px; }
</style>
