<template>
  <div>
    <!-- Toolbar -->
    <div class="table-toolbar">
      <div class="toolbar-search">
        <v-icon size="18" class="search-icon">mdi-magnify</v-icon>
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search products…"
        />
      </div>
      <select v-model="categoryFilter" class="category-select">
        <option value="All">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="product-table">
        <thead>
          <tr>
            <th class="luxury-label">Image</th>
            <th class="luxury-label">Name</th>
            <th class="luxury-label">Price</th>
            <th class="luxury-label">Category</th>
            <th class="luxury-label">Status</th>
            <th class="luxury-label">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
            <td>
              <div class="product-thumb">
                <img :src="product.image_url" :alt="product.name" class="thumb-img" />
              </div>
            </td>
            <td>
              <span class="product-name">{{ product.name }}</span>
            </td>
            <td>
              <span class="product-price">₹{{ parseFloat(product.price).toLocaleString('en-IN') }}</span>
            </td>
            <td>
              <span class="category-chip">{{ product.category }}</span>
            </td>
            <td>
              <v-switch
                :model-value="product.is_active"
                @change="toggleStatus(product)"
                color="success"
                hide-details
                density="compact"
              />
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit-btn" @click="$emit('edit', product)" title="Edit">
                  <v-icon size="16">mdi-pencil-outline</v-icon>
                </button>
                <button class="action-btn delete-btn" @click="confirmDelete(product)" title="Delete">
                  <v-icon size="16">mdi-trash-can-outline</v-icon>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="table-empty">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>

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

const categories = computed(() => [...new Set(products.value.map(p => p.category))])

const filteredProducts = computed(() =>
  products.value.filter(p => {
    const lMatchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const lMatchCat = categoryFilter.value === 'All' || p.category === categoryFilter.value
    return lMatchSearch && lMatchCat
  })
)

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

onMounted(() => fetchProducts())
defineEmits(['edit'])
</script>

<style scoped>
/* ── Toolbar ── */
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--card);
  flex-wrap: wrap;
}

.toolbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: var(--text-primary);
  width: 100%;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.category-select {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--text-primary);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 9px 32px 9px 12px;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%237A6F65' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
}

/* ── Table ── */
.table-wrap {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
}

.product-table thead tr {
  background: var(--bg);
}

.product-table th {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.table-row {
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--primary-muted);
}

.product-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  color: var(--text-primary);
}

.table-row:last-child td {
  border-bottom: none;
}

/* ── Cells ── */
.product-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-offset);
  border: 1px solid var(--border);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.product-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-hover);
}

.category-chip {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--primary-muted);
  color: var(--primary-hover);
  border: 1px solid var(--border);
  white-space: nowrap;
}

/* ── Action Buttons ── */
.action-btns {
  display: flex;
  gap: 6px;
  align-items: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
}

.edit-btn:hover {
  background: var(--primary-muted);
  border-color: var(--primary);
  color: var(--primary-hover);
}

.delete-btn:hover {
  background: rgba(192, 57, 43, 0.08);
  border-color: rgba(192, 57, 43, 0.3);
  color: #C0392B;
}

/* ── Empty ── */
.table-empty {
  padding: 60px !important;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
