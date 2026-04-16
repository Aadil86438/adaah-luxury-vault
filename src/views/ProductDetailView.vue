<template>
  <v-container class="py-12">
    <v-row v-if="loading" justify="center">
      <v-col cols="12" md="8">
        <v-skeleton-loader type="article, image, article"></v-skeleton-loader>
      </v-col>
    </v-row>
    
    <v-row v-else-if="product" justify="center">
      <v-col cols="12" md="10">
        <v-card class="premium-card overflow-hidden" flat border>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-img :src="product.image_url" cover height="500"></v-img>
            </v-col>
            <v-col cols="12" md="6" class="pa-10">
              <div class="text-caption luxury-text color-primary mb-2">{{ product.category }}</div>
              <h1 class="text-h3 font-weight-bold mb-4">{{ product.name }}</h1>
              
              <div class="text-h4 color-secondary mb-8 font-weight-bold">
                ₹ {{ parseFloat(product.price).toLocaleString() }}
              </div>

              <p class="text-body-1 opacity-70 mb-10 lineHeight-2">
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
      </v-col>
    </v-row>

    <ProductModal ref="productModal" />
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

<style scoped>
.lineHeight-2 {
  line-height: 2;
}
</style>
