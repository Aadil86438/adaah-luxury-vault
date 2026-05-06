<template>
  <v-card
    flat
    class="product-card premium-card"
    @click="$emit('view', product)"
    role="button"
    :aria-label="`View ${product.name}`"
    width="100%"
    color="white"
    rounded="lg"
  >
    <div class="card-image-wrap">
      <v-img :src="product.image_url || 'https://placehold.co/400x400/FAF7F2/D97A6C?text=Adaah'" :aspect-ratio="1" cover class="card-image">
        <template v-slot:placeholder>
          <div class="card-loader"><v-progress-circular indeterminate color="primary" size="24" width="2" /></div>
        </template>
        <div v-if="!product.is_active" class="sold-out-badge">Sold Out</div>
      </v-img>
      <!-- Add to Cart button overlay -->
      <button
        class="card-add-cart-btn"
        @click.stop="addToCart"
        :aria-label="`Add ${product.name} to cart`"
        title="Add to Cart"
      >
        <v-icon size="18">mdi-cart-plus</v-icon>
      </button>
    </div>
    <v-card-text class="card-info">
      <div class="luxury-label card-category">{{ product.category }}</div>
      <h3 class="card-name serif-text">{{ product.name }}</h3>
      <div class="card-footer">
        <span class="card-price">₹ {{ parseFloat(product.price).toLocaleString('en-IN') }}</span>
        <span class="trending-badge card-trending">Now Trending</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({ product: Object })
defineEmits(['view'])

const store = useStore()

const addToCart = () => {
  store.dispatch('cart/addItem', {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image_url: props.product.image_url,
    category: props.product.category,
    quantity: 1
  })
}
</script>

<style scoped>
.product-card { cursor: pointer; height: 100%; display: flex; flex-direction: column; transition: transform 0.3s ease, box-shadow 0.3s ease !important; }
.card-image-wrap { overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0; background: var(--card); flex-shrink: 0; position: relative; }
.card-image { transition: transform 0.58s cubic-bezier(0.4, 0, 0.2, 1); }
.product-card:hover .card-image { transform: scale(1.06); }
.sold-out-badge { position: absolute; top: 0.625rem; left: 0.625rem; background: rgba(250, 247, 242, 0.93); color: var(--primary-hover); font-family: var(--font-sans); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: var(--radius-pill); border: 1px solid var(--border); }
.card-info { padding: 1rem 1rem 1.25rem; background: white; border-radius: 0 0 var(--radius-lg) var(--radius-lg); flex: 1; display: flex; flex-direction: column; gap: 0.375rem; color: var(--text-primary); }
.card-category { margin-bottom: 0.125rem; }
.card-name { font-size: 1.15rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
.card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem; gap: 0.5rem; }
.card-price { font-family: var(--font-sans); font-size: 1rem; font-weight: 600; color: var(--primary-hover); }
.card-trending { font-size: 0.7rem; }

/* ── Add to Cart Button ── */
.card-add-cart-btn {
  position: absolute;
  bottom: 0.625rem;
  right: 0.625rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-add-cart-btn:hover {
  background: var(--primary-hover);
  color: #fff;
  border-color: var(--primary-hover);
  transform: scale(1.1);
  box-shadow: 0 4px 14px rgba(217, 122, 108, 0.35);
}

.card-add-cart-btn:active {
  transform: scale(0.92);
}

@media (max-width: 639px) {
  .card-name { font-size: 1rem; }
  .card-price { font-size: 0.9rem; }
  .card-info { padding: 0.75rem 0.75rem 1rem; }
  .card-trending { display: none; }
  .card-add-cart-btn { width: 2rem; height: 2rem; bottom: 0.5rem; right: 0.5rem; }
}
</style>
