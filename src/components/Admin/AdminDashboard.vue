<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.title">
        <v-card class="premium-card pa-6 border" flat>
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-caption luxury-text opacity-70">{{ stat.title }}</div>
            <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
          </div>
          <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <h3 class="luxury-text mt-12 mb-6">Recent Activity</h3>
    <v-card class="premium-card border" flat>
      <v-list class="pa-0">
        <v-list-item v-for="(item, i) in recentItems" :key="i" class="pa-4 border-b">
          <template v-slot:prepend>
            <v-icon :color="item.color" class="mr-4">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.time }}</v-list-item-subtitle>
          <template v-slot:append>
            <div class="text-subtitle-2 font-weight-bold">{{ item.amount }}</div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'

const stats = ref([
  { title: 'Total Products', value: 0, icon: 'mdi-package-variant', color: 'primary' },
  { title: 'Active Products', value: 0, icon: 'mdi-check-circle', color: 'success' },
  { title: 'Total Orders', value: 0, icon: 'mdi-cart', color: 'info' },
  { title: 'Revenue (Est.)', value: '₹0', icon: 'mdi-currency-inr', color: 'secondary' }
])

const recentItems = ref([])

const fetchStats = () => {
  SupabaseService.getProducts().then(({ data }) => {
    stats.value[0].value = data?.length || 0
    stats.value[1].value = data?.filter(p => p.is_active).length || 0
  })

  SupabaseService.getOrders().then(({ data }) => {
    stats.value[2].value = data?.length || 0
    const lRevenue = data?.reduce((acc, curr) => acc + parseFloat(curr.price), 0) || 0
    stats.value[3].value = `₹${lRevenue.toLocaleString()}`

    recentItems.value = data?.slice(0, 5).map(o => ({
      title: `Order from ${o.user_name}`,
      subtitle: o.product_name,
      time: new Date(o.created_at).toLocaleDateString(),
      amount: `₹${parseFloat(o.price).toLocaleString()}`,
      icon: 'mdi-account-circle',
      color: 'primary'
    })) || []
  })
}

onMounted(() => {
  fetchStats()
})
</script>
