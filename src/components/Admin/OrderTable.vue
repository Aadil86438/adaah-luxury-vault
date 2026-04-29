<template>
  <div class="table-wrap">
    <table class="order-table">
      <thead>
        <tr>
          <th class="luxury-label">Customer</th>
          <th class="luxury-label">Phone</th>
          <th class="luxury-label">Product</th>
          <th class="luxury-label">Price</th>
          <th class="luxury-label">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="table-row">
          <td>
            <div class="customer-cell">
              <div class="customer-avatar">{{ order.user_name.charAt(0).toUpperCase() }}</div>
              <span class="customer-name">{{ order.user_name }}</span>
            </div>
          </td>
          <td class="order-phone">{{ order.phone }}</td>
          <td class="order-product">{{ order.product_name }}</td>
          <td><span class="order-price">₹{{ parseFloat(order.price).toLocaleString('en-IN') }}</span></td>
          <td class="order-date">{{ new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }}</td>
        </tr>
        <tr v-if="orders.length === 0"><td colspan="5" class="table-empty">No orders found.</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'
const orders = ref([])
const fetchOrders = () => { SupabaseService.getOrders().then(({ data }) => { orders.value = data || [] }) }
onMounted(() => fetchOrders())
</script>

<style scoped>
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.order-table { width: 100%; border-collapse: collapse; font-family: var(--font-sans); }
.order-table thead tr { background: var(--bg); }
.order-table th { text-align: left; padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
.table-row { transition: background var(--transition-fast); }
.table-row:hover { background: var(--primary-muted); }
.order-table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 0.88rem; color: var(--text-primary); }
.table-row:last-child td { border-bottom: none; }
.customer-cell { display: flex; align-items: center; gap: 0.625rem; }
.customer-avatar { width: 2rem; height: 2rem; border-radius: 50%; background: var(--primary-muted); color: var(--primary-hover); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; border: 1px solid var(--border); }
.customer-name { font-weight: 500; color: var(--text-primary); }
.order-phone { color: var(--text-secondary); }
.order-product { color: var(--text-primary); max-width: 12.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.order-price { font-weight: 600; color: var(--primary-hover); }
.order-date { color: var(--text-muted); white-space: nowrap; }
.table-empty { padding: 3.75rem !important; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
</style>
