<template>
  <!-- Loading Skeletons -->
  <div v-if="loading" class="product-grid">
    <div v-for="n in 8" :key="n" class="grid-item">
      <div class="skeleton-card premium-card">
        <div class="skeleton-img skeleton-pulse" />
        <div class="skeleton-body">
          <div class="skeleton-line short skeleton-pulse" />
          <div class="skeleton-line skeleton-pulse" />
          <div class="skeleton-line medium skeleton-pulse" />
        </div>
      </div>
    </div>
  </div>

  <!-- Product Grid -->
  <div v-else-if="products.length > 0" class="product-grid">
    <div v-for="product in products" :key="product.id" class="grid-item">
      <ProductCard :product="product" @view="$emit('view', $event)" />
    </div>
  </div>

  <!-- Empty State -->
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
/* ── Grid Layout ── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

/* ── Custom Skeleton ── */
.skeleton-card {
  cursor: default;
}

.skeleton-card:hover {
  transform: none !important;
  box-shadow: var(--shadow-card) !important;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  background: var(--border);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.skeleton-body {
  padding: 16px;
  background: var(--card);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  background: var(--border);
  border-radius: var(--radius-sm);
  width: 100%;
}

.skeleton-line.short {
  width: 45%;
  height: 10px;
}

.skeleton-line.medium {
  width: 65%;
}

.skeleton-pulse {
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ── Empty State ── */
.empty-grid {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  color: var(--border);
  display: block;
  margin: 0 auto 20px;
}

.empty-label {
  font-size: 1.4rem;
  color: var(--text-muted);
  opacity: 0.65;
}

/* ── Responsive Grid ── */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 399px) {
  .product-grid {
    gap: 12px;
  }
}
</style>
