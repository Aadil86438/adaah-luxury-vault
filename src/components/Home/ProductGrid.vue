<template>
  <v-row v-if="loading">
    <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3">
      <v-skeleton-loader type="card" class="rounded-lg"></v-skeleton-loader>
    </v-col>
  </v-row>

  <v-row v-else-if="products.length > 0">
    <v-col
      v-for="product in products"
      :key="product.id"
      cols="6"
      sm="4"
      md="3"
    >
      <ProductCard :product="product" @view="$emit('view', $event)" />
    </v-col>
  </v-row>

  <div v-else class="text-center py-12 w-100">
    <v-icon size="64" class="opacity-20 mb-4">mdi-package-variant</v-icon>
    <p class="text-h6 opacity-50">No products found.</p>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: Array,
  loading: Boolean
})

defineEmits(['view'])
</script>
