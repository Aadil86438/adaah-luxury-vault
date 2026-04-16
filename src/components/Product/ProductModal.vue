<template>
  <v-dialog v-model="show" max-width="900px" scrim="#000">
    <v-card v-if="product" class="premium-card overflow-hidden" flat>
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-img :src="product.image_url" height="100%" cover></v-img>
        </v-col>
        <v-col cols="12" md="6" class="pa-8 d-flex flex-column">
          <div class="d-flex justify-space-between align-start mb-4">
            <div>
              <div class="text-caption luxury-text color-primary">{{ product.category }}</div>
              <h2 class="text-h4 font-weight-bold">{{ product.name }}</h2>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="show = false"></v-btn>
          </div>

          <div class="text-h5 color-secondary mb-6 font-weight-bold">
            ₹ {{ parseFloat(product.price).toLocaleString() }}
          </div>

          <p class="text-body-1 opacity-70 mb-8 flex-grow-1">
            {{ product.description }}
          </p>

          <v-divider class="mb-8"></v-divider>

          <h4 class="luxury-text mb-4">Order via WhatsApp</h4>
          <v-form @submit.prevent="handleOrder" v-model="formValid">
            <v-row>
              <v-col cols="12" sm="6" class="py-1">
                <v-text-field
                  v-model="customerName"
                  label="Your Name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-1">
                <v-text-field
                  v-model="customerPhone"
                  label="Phone Number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Phone is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              color="primary"
              variant="flat"
              block
              size="large"
              class="rounded-pill mt-4 luxury-text"
              :disabled="!formValid || loading"
              :loading="loading"
              type="submit"
            >
              Order Now 💎
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { SupabaseService } from '../../services/SupabaseService'

const store = useStore()
const show = ref(false)
const product = ref(null)
const customerName = ref('')
const customerPhone = ref('')
const formValid = ref(false)
const loading = ref(false)

const open = (pProduct) => {
  product.value = pProduct
  show.value = true
}

const handleOrder = () => {
  if (!formValid.value) return

  loading.value = true

  const lOrderData = {
    user_name: customerName.value,
    phone: customerPhone.value,
    product_name: product.value.name,
    price: product.value.price
  }

  SupabaseService.createOrder(lOrderData).then(() => {
    store.dispatch('snackbar/show', { text: 'Order summary saved. Redirecting to WhatsApp...', color: 'success' })
    
    const lMessage = `✨ ADAAH JEWELRY ORDER ✨
🛍 Product: ${product.value.name}
💰 Price: ₹${parseFloat(product.value.price).toLocaleString()}

👤 Customer:
Name: ${customerName.value}
Phone: ${customerPhone.value}

🕒 Date: ${new Date().toLocaleString()}

Thank you for choosing Adaah 💎`

    const lEncodedMessage = encodeURIComponent(lMessage)
    const lWhatsappUrl = `https://wa.me/918643839796?text=${lEncodedMessage}`

    setTimeout(() => {
      window.open(lWhatsappUrl, '_blank')
      show.value = false
      loading.value = false
      customerName.value = ''
      customerPhone.value = ''
    }, 1500)
  }).catch((pError) => {
    store.dispatch('snackbar/show', { text: pError.message || 'Failed to save order', color: 'error' })
    loading.value = false
  })
}

defineExpose({ open })
</script>
