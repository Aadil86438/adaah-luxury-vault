<template>
  <v-container class="py-12">
    <div class="d-flex justify-space-between align-center mb-10">
      <div>
        <h1 class="luxury-text mb-2">Admin Control</h1>
        <p class="text-body-2 opacity-70">Manage your jewelry collection and orders</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" class="rounded-pill px-6" @click="openProductForm()">
        Add New Product
      </v-btn>
    </div>

    <!-- Admin Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-8">
      <v-tab value="dashboard" class="luxury-text">Dashboard</v-tab>
      <v-tab value="products" class="luxury-text">Products</v-tab>
      <v-tab value="orders" class="luxury-text">Orders</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item value="dashboard">
        <AdminDashboard />
      </v-window-item>
      
      <v-window-item value="products">
        <v-card class="premium-card border" flat>
          <ProductTable @edit="openProductForm" />
        </v-card>
      </v-window-item>

      <v-window-item value="orders">
        <v-card class="premium-card border" flat>
          <OrderTable />
        </v-card>
      </v-window-item>
    </v-window>

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

const openProductForm = (pProduct = null) => {
  productForm.value.open(pProduct)
}

const refreshData = () => {
  // Logic to refresh table will be handled via events or shared state
}
</script>
