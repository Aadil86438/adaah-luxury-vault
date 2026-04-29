<template>
  <v-container fluid class="pa-0">
    <v-container style="max-width: 1280px;" class="px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="detail-skeleton">
        <v-skeleton-loader type="article, image, article"></v-skeleton-loader>
      </div>

      <!-- Product -->
      <v-card v-else-if="product" class="detail-card premium-card" flat color="white" rounded="lg">
        <v-row no-gutters>
          <v-col cols="12" md="6" class="detail-image-col">
            <v-img
              :src="product.image_url"
              cover
              :aspect-ratio="4/5"
              class="detail-image"
            ></v-img>
          </v-col>
          <v-col cols="12" md="6" class="detail-info-col">
            <div class="text-caption luxury-text" style="color: var(--primary-hover); margin-bottom: 0.5rem;">{{ product.category }}</div>
            <h1 class="detail-name serif-text">{{ product.name }}</h1>

            <div class="detail-price">
              ₹ {{ parseFloat(product.price).toLocaleString() }}
            </div>

            <p class="detail-desc">
              {{ product.description }}
            </p>

            <v-btn
              color="primary"
              variant="flat"
              block
              size="large"
              class="rounded-pill luxury-text"
              @click="openOrderModal"
            >
              Order via WhatsApp 💎
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <ProductModal ref="productModal" />
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../services/SupabaseService'
import ProductModal from '../components/Product/ProductModal.vue'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const productModal = ref(null)

const fetchProduct = () => {
  loading.value = true
  supabase
    .from('products')
    .select('*')
    .eq('id', route.params.id)
    .single()
    .then(({ data, error }) => {
      if (error || !data) {
        router.push('/')
      } else {
        product.value = data
      }
      loading.value = false
    })
}

const openOrderModal = () => {
  productModal.value.open(product.value)
}

onMounted(() => {
  fetchProduct()
})
</script>

.detail-skeleton {
  max-width: 50rem;
  margin: 0 auto;
}

.detail-card {
  overflow: hidden;
  cursor: default;
}

.detail-card:hover {
  transform: none !important;
}

.detail-image-col {
  overflow: hidden;
  background: var(--bg-offset);
}

.detail-info-col {
  padding: clamp(1.5rem, 5vw, 2.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-name {
  font-size: clamp(1.6rem, 3.5vw, 2rem);
  margin-bottom: 1rem;
}

.detail-price {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-hover);
  margin-bottom: 2rem;
}

.detail-desc {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 2;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}
