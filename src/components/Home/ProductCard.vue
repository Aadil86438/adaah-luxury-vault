<template>
  <article class="premium-card product-card" @click="$emit('view', product)" role="button" :aria-label="`View ${product.name}`">
    <!-- Image -->
    <div class="card-image-wrap">
      <v-img
        :src="product.image_url || 'https://placehold.co/400x400/FAF7F2/D97A6C?text=Adaah'"
        :aspect-ratio="1"
        cover
        class="card-image"
      >
        <template v-slot:placeholder>
          <div class="card-loader">
            <v-progress-circular indeterminate color="primary" size="24" width="2" />
          </div>
        </template>

        <div v-if="!product.is_active" class="sold-out-badge">Sold Out</div>
      </v-img>
    </div>

    <!-- Info -->
    <div class="card-info">
      <div class="luxury-label card-category">{{ product.category }}</div>
      <h3 class="card-name serif-text">{{ product.name }}</h3>
      <div class="card-footer">
        <span class="card-price">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</span>
        <span class="trending-badge card-trending">Now Trending</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ product: Object })
defineEmits(['view'])
</script>

<style scoped>
.product-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ── Image ── */
.card-image-wrap {
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--card);
  flex-shrink: 0;
}

.card-image {
  transition: transform 0.58s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .card-image {
  transform: scale(1.06);
}

/* ── Sold Out Badge ── */
.sold-out-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(250, 247, 242, 0.93);
  color: var(--primary-hover);
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
}

/* ── Info Section ── */
.card-info {
  padding: 16px 16px 20px;
  background: var(--card);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-category {
  margin-bottom: 2px;
}

.card-name {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  gap: 8px;
}

.card-price {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-hover);
}

.card-trending {
  font-size: 0.7rem;
}

/* ── Mobile ── */
@media (max-width: 599px) {
  .card-name {
    font-size: 1rem;
  }

  .card-price {
    font-size: 0.9rem;
  }

  .card-info {
    padding: 12px 12px 16px;
  }

  .card-trending {
    display: none;
  }
}
</style>
