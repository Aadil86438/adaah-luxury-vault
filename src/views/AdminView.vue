<template>
  <div class="admin-page">
    <div class="admin-inner">
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
    </div>

    <ProductForm ref="productForm" @saved="refreshData" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
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
.admin-page {
  min-height: 100vh;
  background: var(--bg);
}

.admin-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 56px 32px 80px;
}

/* ── Header ── */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 16px;
  flex-wrap: wrap;
}

.admin-title {
  font-size: 2.4rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.admin-subtitle {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  padding: 12px 24px !important;
  font-size: 0.9rem;
  border-radius: var(--radius-md) !important;
}

/* ── Tabs ── */
.admin-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 36px;
}

.admin-tab {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
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
.admin-content {
  min-height: 400px;
}

.admin-table-card {
  overflow: hidden;
  cursor: default;
}

.admin-table-card:hover {
  transform: none !important;
  box-shadow: var(--shadow-card) !important;
}

/* ── Mobile ── */
@media (max-width: 599px) {
  .admin-inner {
    padding: 32px 16px 60px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }

  .admin-tabs {
    overflow-x: auto;
  }

  .admin-tab {
    padding: 10px 14px;
    white-space: nowrap;
    font-size: 0.8rem;
  }
}
</style>
