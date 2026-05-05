<template>
  <v-container fluid class="pa-0">
    <v-container style="max-width: 1280px; margin: 0 auto;" class="px-4 py-8 admin-container">
      <!-- Page Header -->
      <div class="admin-header">
        <div>
          <h1 class="serif-text admin-title">Admin Control</h1>
          <p class="admin-subtitle">Manage your jewelry collection and orders</p>
        </div>
        <button class="btn-terra admin-add-btn" @click="openProductForm()">
          <v-icon size="18" class="mr-1">mdi-plus</v-icon>
          Add Product
        </button>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="admin-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <v-icon size="16" class="mr-2">{{ tab.icon }}</v-icon>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="admin-content">
        <AdminDashboard v-if="activeTab === 'dashboard'" />

        <div v-if="activeTab === 'products'" class="admin-table-card premium-card">
          <ProductTable @edit="openProductForm" />
        </div>

        <div v-if="activeTab === 'orders'" class="admin-table-card premium-card">
          <OrderTable />
        </div>
      </div>
    </v-container>

    <ProductForm ref="productForm" @saved="refreshData" />
    <ConfirmDialog ref="confirmDialog" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import AdminDashboard from '../components/Admin/AdminDashboard.vue'
import ProductTable from '../components/Admin/ProductTable.vue'
import OrderTable from '../components/Admin/OrderTable.vue'
import ProductForm from '../components/Admin/ProductForm.vue'
import ConfirmDialog from '../components/Shared/ConfirmDialog.vue'

const activeTab = ref('dashboard')
const productForm = ref(null)

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard-outline' },
  { value: 'products',  label: 'Products',  icon: 'mdi-package-variant-closed' },
  { value: 'orders',    label: 'Orders',    icon: 'mdi-cart-outline' },
]

const openProductForm = (pProduct = null) => {
  productForm.value.open(pProduct)
}

const refreshData = () => {
  // Handled via component-level fetch refresh
}
</script>

<style scoped>
.admin-container {
  padding-top: clamp(2rem, 5vw, 4rem);
  padding-bottom: 5rem;
}

/* ── Header ── */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.admin-title {
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  padding: 0.75rem 1.5rem !important;
  font-size: 0.9rem;
  border-radius: var(--radius-md) !important;
}

/* ── Tabs ── */
.admin-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2.25rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin-tab {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  bottom: -1px;
  white-space: nowrap;
}

.admin-tab:hover {
  color: var(--text-primary);
  background: var(--primary-muted);
}

.admin-tab.active {
  color: var(--primary-hover);
  border-bottom-color: var(--primary-hover);
  background: var(--primary-muted);
}

/* ── Content ── */
.admin-table-card {
  overflow: hidden;
  cursor: default;
}

.admin-table-card:hover {
  transform: none !important;
  box-shadow: var(--shadow-card) !important;
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.75rem;
  }

  .admin-tab {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
}
</style>
