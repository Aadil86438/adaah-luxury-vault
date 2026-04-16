<template>
  <v-card class="premium-card h-100 border overflow-hidden" flat @click="$emit('view', product)">
    <div class="position-relative overflow-hidden">
      <v-img
        :src="product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'"
        height="280"
        cover
        class="product-image"
      >
        <template v-slot:placeholder>
          <v-skeleton-loader type="image" class="h-100"></v-skeleton-loader>
        </template>
        
        <div v-if="!product.is_active" class="out-of-stock-overlay d-flex align-center justify-center">
          <v-chip color="error" variant="flat" class="luxury-text">Out of Stock</v-chip>
        </div>

        <div class="view-details-overlay d-flex align-center justify-center">
          <v-btn color="white" variant="flat" class="rounded-pill px-6 luxury-text">View Details</v-btn>
        </div>
      </v-img>
    </div>

    <v-card-text class="pt-4">
      <div class="text-caption opacity-60 luxury-text mb-1">{{ product.category }}</div>
      <h3 class="text-subtitle-1 font-weight-bold mb-1 truncate">{{ product.name }}</h3>
      <div class="text-h6 color-primary">₹ {{ parseFloat(product.price).toLocaleString() }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  product: Object
})

defineEmits(['view'])
</script>

<style scoped>
.product-image {
  transition: transform 0.6s ease;
}

.premium-card:hover .product-image {
  transform: scale(1.1);
}

.view-details-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.premium-card:hover .view-details-overlay {
  opacity: 1;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.4);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
