<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="bg-surface py-16 mb-8 text-center border-b">
      <v-container>
        <h1 class="text-h2 font-weight-bold luxury-text mb-4">Elegance in Every Detail</h1>
        <p class="text-h6 opacity-70 mb-8 max-width-600 mx-auto">
          Explore our curated collection of premium jewelry, handcrafted to bring out your inner brilliance.
        </p>
        <CategoryFilter @filter="handleFilter" :categories="categories" />
      </v-container>
    </v-container>

    <!-- Product Grid -->
    <v-container class="pb-16">
      <ProductGrid 
        :products="filteredProducts" 
        :loading="loading" 
        @view="openModal" 
      />

      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
        <v-btn variant="text" color="primary" @click="activeCategory = 'All'">Reset View</v-btn>
      </div>
    </v-container>

    <!-- Product Modal -->
    <ProductModal ref="productModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SupabaseService } from '../services/SupabaseService'
import CategoryFilter from '../components/Home/CategoryFilter.vue'
import ProductGrid from '../components/Home/ProductGrid.vue'
import ProductModal from '../components/Product/ProductModal.vue'

const products = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const productModal = ref(null)

const categories = computed(() => {
  const lCats = ['All', ...new Set(products.value.map(p => p.category))]
  return lCats
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

const fetchProducts = () => {
  loading.value = true
  SupabaseService.getActiveProducts().then(({ data }) => {
    products.value = data || []
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const handleFilter = (pCategory) => {
  activeCategory.value = pCategory
}

const openModal = (pProduct) => {
  productModal.value.open(pProduct)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
</style>
