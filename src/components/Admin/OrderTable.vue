<template>
  <v-table>
    <thead class="bg-surface opacity-80">
      <tr>
        <th class="luxury-text">Customer</th>
        <th class="luxury-text">Phone</th>
        <th class="luxury-text">Product</th>
        <th class="luxury-text">Price</th>
        <th class="luxury-text">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td class="font-weight-bold">{{ order.user_name }}</td>
        <td>{{ order.phone }}</td>
        <td>{{ order.product_name }}</td>
        <td>₹{{ parseFloat(order.price).toLocaleString() }}</td>
        <td>{{ new Date(order.created_at).toLocaleString() }}</td>
      </tr>
      <tr v-if="orders.length === 0">
        <td colspan="5" class="text-center py-8 opacity-50">No orders found.</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'

const orders = ref([])

const fetchOrders = () => {
  SupabaseService.getOrders().then(({ data }) => {
    orders.value = data || []
  })
}

onMounted(() => {
  fetchOrders()
})
</script>
