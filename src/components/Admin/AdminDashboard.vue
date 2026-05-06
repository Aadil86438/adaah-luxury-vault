<template>
  <div>
    <v-row class="mb-8">
      <v-col v-for="stat in stats" :key="stat.title" cols="6" sm="6" md="3">
        <v-card class="stat-card premium-card" flat color="white" rounded="lg">
          <div class="stat-header">
            <span class="luxury-label stat-title">{{ stat.title }}</span>
            <div class="stat-icon-wrap" :style="{ background: stat.bgColor }">
              <v-icon :color="stat.iconColor" size="18">{{ stat.icon }}</v-icon>
            </div>
          </div>
          <div class="stat-value serif-text">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>
    <h3 class="luxury-label activity-heading">Recent Activity</h3>
    <div class="activity-card premium-card">
      <div v-if="recentItems.length === 0" class="activity-empty"><p>No recent orders yet.</p></div>
      <div v-for="(item, i) in recentItems" :key="i" class="activity-item" :class="{ 'activity-item--last': i === recentItems.length - 1 }">
        <div class="activity-icon-wrap"><v-icon :color="item.color" size="18">{{ item.icon }}</v-icon></div>
        <div class="activity-text">
          <div class="activity-title">{{ item.title }}</div>
          <div class="activity-time">{{ item.time }}</div>
        </div>
        <div class="activity-amount">{{ item.amount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'

const stats = ref([
  { title: 'Total Products', value: 0, icon: 'mdi-package-variant-closed', bgColor: 'rgba(230, 167, 155, 0.15)', iconColor: '#D97A6C' },
  { title: 'Active Products', value: 0, icon: 'mdi-check-circle-outline', bgColor: 'rgba(168, 184, 138, 0.15)', iconColor: '#A8B88A' },
  { title: 'Total Orders', value: 0, icon: 'mdi-cart-outline', bgColor: 'rgba(91, 141, 184, 0.15)', iconColor: '#5B8DB8' },
  { title: 'Revenue (Est.)', value: '₹0', icon: 'mdi-currency-inr', bgColor: 'rgba(212, 160, 66, 0.15)', iconColor: '#D4A042' }
])
const recentItems = ref([])

const fetchStats = () => {
  // Products stats
  SupabaseService.getProducts().then(({ data }) => {
    stats.value[0].value = data?.length || 0
    stats.value[1].value = data?.filter(p => p.is_active).length || 0
  }).catch(() => {})

  // Orders stats — handles both legacy + new format
  SupabaseService.getOrdersWithItems().then(({ data }) => {
    if (!data) return

    stats.value[2].value = data.length

    let lTotalRevenue = 0
    data.forEach(order => {
      const lHasItems = order.order_items && order.order_items.length > 0
      if (lHasItems) {
        // New format: sum from order_items
        lTotalRevenue += order.order_items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0)
      } else {
        // Legacy format: use total_price or price field
        lTotalRevenue += parseFloat(order.total_amount || order.total_price || order.price || 0)
      }
    })
    stats.value[3].value = `₹${lTotalRevenue.toLocaleString('en-IN')}`

    // Recent activity
    recentItems.value = data.slice(0, 5).map(o => {
      const lName = o.customer_name || o.user_name || 'Customer'
      const lHasItems = o.order_items && o.order_items.length > 0
      let lAmount = 0
      if (lHasItems) {
        lAmount = o.order_items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0)
      } else {
        lAmount = parseFloat(o.total_amount || o.total_price || o.price || 0)
      }
      const lItemCount = lHasItems ? o.order_items.reduce((acc, item) => acc + (item.quantity || 1), 0) : (o.quantity || 1)

      return {
        title: `Order from ${lName}${lItemCount > 1 ? ` (${lItemCount} items)` : ''}`,
        time: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: `₹${lAmount.toLocaleString('en-IN')}`,
        icon: 'mdi-account-circle-outline',
        color: 'primary'
      }
    })
  }).catch(() => {})
}

onMounted(() => { fetchStats() })
</script>

<style scoped>
.stat-card { padding: 1.75rem 1.5rem; cursor: default; background: white; }
.stat-card:hover { transform: translateY(-3px) !important; }
.stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.stat-title { color: var(--text-muted); }
.stat-icon-wrap { width: 2.25rem; height: 2.25rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.stat-value { font-size: 2rem; color: var(--text-primary); line-height: 1; }
.activity-heading { margin-bottom: 1.25rem; margin-top: 0.5rem; }
.activity-card { cursor: default; padding: 0; overflow: hidden; background: white; }
.activity-card:hover { transform: none !important; }
.activity-empty { padding: 2.5rem; text-align: center; color: var(--text-muted); font-family: var(--font-sans); font-size: 0.9rem; }
.activity-item { display: flex; align-items: center; gap: 1rem; padding: 1.125rem 1.5rem; border-bottom: 1px solid var(--border); transition: background var(--transition-fast); }
.activity-item:hover { background: var(--primary-muted); }
.activity-item--last { border-bottom: none; }
.activity-icon-wrap { width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--primary-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.activity-text { flex: 1; min-width: 0; }
.activity-title { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-time { font-family: var(--font-sans); font-size: 0.78rem; color: var(--text-muted); margin-top: 0.125rem; }
.activity-amount { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; color: var(--primary-hover); flex-shrink: 0; }

@media (max-width: 639px) {
  .stat-card { padding: 1.25rem 1rem; }
  .stat-value { font-size: 1.6rem; }
  .activity-item { padding: 0.875rem 1rem; gap: 0.75rem; }
}
</style>
