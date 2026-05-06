<template>
  <div class="table-wrap">
    <table class="order-table">
      <thead>
        <tr>
          <th class="luxury-label"></th>
          <th class="luxury-label">Customer</th>
          <th class="luxury-label">Phone</th>
          <th class="luxury-label">Items</th>
          <th class="luxury-label">Total</th>
          <th class="luxury-label">Date</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orders" :key="order.id">
          <tr class="table-row" @click="toggleExpand(order.id)">
            <td class="expand-cell">
              <v-icon v-if="hasItems(order)" size="16" class="expand-icon" :class="{ rotated: expanded[order.id] }">mdi-chevron-right</v-icon>
            </td>
            <td>
              <div class="customer-cell">
                <div class="customer-avatar">{{ getCustomerName(order).charAt(0).toUpperCase() }}</div>
                <span class="customer-name">{{ getCustomerName(order) }}</span>
              </div>
            </td>
            <td class="order-phone">{{ order.phone }}</td>
            <td>
              <span v-if="hasItems(order)" class="items-badge">
                {{ order.order_items.length }} {{ order.order_items.length === 1 ? 'item' : 'items' }}
              </span>
              <span v-else class="order-product">{{ order.product_name || '—' }}</span>
            </td>
            <td><span class="order-price">₹{{ getOrderTotal(order).toLocaleString('en-IN') }}</span></td>
            <td class="order-date">{{ new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }}</td>
          </tr>
          <!-- Expanded items row -->
          <tr v-if="hasItems(order) && expanded[order.id]" class="items-expand-row">
            <td colspan="6">
              <div class="items-expand-content">
                <div v-for="item in order.order_items" :key="item.id" class="expand-item">
                  <span class="expand-item-name">{{ item.product_name }}</span>
                  <span class="expand-item-qty">× {{ item.quantity }}</span>
                  <span class="expand-item-price">₹{{ parseFloat(item.price).toLocaleString('en-IN') }}</span>
                  <span class="expand-item-subtotal">₹{{ parseFloat(item.subtotal).toLocaleString('en-IN') }}</span>
                </div>
              </div>
            </td>
          </tr>
        </template>
        <tr v-if="orders.length === 0"><td colspan="6" class="table-empty">No orders found.</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { SupabaseService } from '../../services/SupabaseService'

const orders = ref([])
const expanded = reactive({})

const fetchOrders = () => {
  SupabaseService.getOrdersWithItems()
    .then(({ data }) => { orders.value = data || [] })
    .catch(() => {})
}

const hasItems = (order) => order.order_items && order.order_items.length > 0

const getCustomerName = (order) => order.customer_name || order.user_name || 'Customer'

const getOrderTotal = (order) => {
  if (hasItems(order)) {
    return order.order_items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0)
  }
  return parseFloat(order.total_amount || order.total_price || order.price || 0)
}

const toggleExpand = (orderId) => {
  expanded[orderId] = !expanded[orderId]
}

onMounted(() => fetchOrders())
</script>

<style scoped>
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.order-table { width: 100%; border-collapse: collapse; font-family: var(--font-sans); }
.order-table thead tr { background: var(--bg); }
.order-table th { text-align: left; padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
.table-row { transition: background var(--transition-fast); cursor: pointer; }
.table-row:hover { background: var(--primary-muted); }
.order-table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 0.88rem; color: var(--text-primary); }
.table-row:last-child td { border-bottom: none; }

.expand-cell { width: 2rem; padding-right: 0 !important; }
.expand-icon { color: var(--text-muted); transition: transform var(--transition-fast); cursor: pointer; }
.expand-icon.rotated { transform: rotate(90deg); }

.customer-cell { display: flex; align-items: center; gap: 0.625rem; }
.customer-avatar { width: 2rem; height: 2rem; border-radius: 50%; background: var(--primary-muted); color: var(--primary-hover); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; border: 1px solid var(--border); }
.customer-name { font-weight: 500; color: var(--text-primary); }
.order-phone { color: var(--text-secondary); }
.order-product { color: var(--text-primary); max-width: 12.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.order-price { font-weight: 600; color: var(--primary-hover); }
.order-date { color: var(--text-muted); white-space: nowrap; }

.items-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-pill);
  background: var(--primary-muted);
  color: var(--primary-hover);
  border: 1px solid var(--border);
}

/* ── Expanded Items ── */
.items-expand-row td {
  padding: 0 !important;
  border-bottom: 1px solid var(--border);
}

.items-expand-content {
  background: var(--bg);
  padding: 0.75rem 1.5rem 0.75rem 3.5rem;
}

.expand-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.375rem 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.expand-item-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  font-weight: 500;
}

.expand-item-qty {
  color: var(--text-muted);
  flex-shrink: 0;
}

.expand-item-price {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.expand-item-subtotal {
  font-weight: 600;
  color: var(--primary-hover);
  flex-shrink: 0;
  min-width: 4.5rem;
  text-align: right;
}

.table-empty { padding: 3.75rem !important; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
</style>
