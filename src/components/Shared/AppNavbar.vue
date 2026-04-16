<template>
  <v-app-bar flat border class="glass-effect">
    <v-container class="d-flex align-center py-0">
      <v-app-bar-title class="luxury-text font-weight-bold" style="cursor: pointer" @click="$router.push('/')">
        ADAAH
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center">
        <v-btn variant="text" to="/" class="mx-1">Home</v-btn>
        <v-btn v-if="!isAuthenticated" variant="text" to="/login" class="mx-1">Admin</v-btn>
        <v-btn v-if="isAuthenticated && isAdmin" variant="text" to="/admin" class="mx-1">Dashboard</v-btn>
      </div>

      <ThemeToggle />

      <template v-if="isAuthenticated">
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-2">
              <v-avatar color="primary" size="32">
                <span class="text-white text-caption">{{ userEmail.charAt(0).toUpperCase() }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list border class="mt-2">
            <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout"></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const userEmail = computed(() => store.getters['auth/userEmail'] || '')

const handleLogout = () => {
  store.dispatch('auth/logout').then(() => {
    router.push('/login')
  })
}
</script>
