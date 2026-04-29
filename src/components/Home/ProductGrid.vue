<template>
  <div v-if="loading">
    <v-row dense>
      <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3">
        <div class="skeleton-card premium-card">
          <div class="skeleton-img skeleton-pulse" />
          <div class="skeleton-body">
            <div class="skeleton-line short skeleton-pulse" />
            <div class="skeleton-line skeleton-pulse" />
            <div class="skeleton-line medium skeleton-pulse" />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else-if="products.length > 0">
    <v-row dense>
      <v-col v-for="product in products" :key="product.id" cols="6" sm="4" md="3">
        <ProductCard :product="product" @view="$emit('view', $event)" />
      </v-col>
    </v-row>
  </div>
  <div v-else class="empty-grid">
    <v-icon size="56" class="empty-icon">mdi-diamond-stone</v-icon>
    <p class="serif-text empty-label">No pieces found.</p>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
defineProps({ products: Array, loading: Boolean })
defineEmits(['view'])
</script>

<style scoped>
.skeleton-card { cursor: default; }
.skeleton-card:hover { transform: none !important; box-shadow: var(--shadow-card) !important; }
.skeleton-img { width: 100%; aspect-ratio: 1; background: var(--border); border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
.skeleton-body { padding: 1rem; background: var(--card); border-radius: 0 0 var(--radius-lg) var(--radius-lg); display: flex; flex-direction: column; gap: 0.625rem; }
.skeleton-line { height: 0.875rem; background: var(--border); border-radius: var(--radius-sm); width: 100%; }
.skeleton-line.short { width: 45%; height: 0.625rem; }
.skeleton-line.medium { width: 65%; }
.skeleton-pulse { animation: skeleton-shimmer 1.6s ease-in-out infinite; }
@keyframes skeleton-shimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.empty-grid { text-align: center; padding: 5rem 0; }
.empty-icon { color: var(--border); display: block; margin: 0 auto 1.25rem; }
.empty-label { font-size: 1.4rem; color: var(--text-muted); opacity: 0.65; }
</style>
