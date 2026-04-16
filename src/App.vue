<template>
  <v-app :theme="darkMode ? 'adaahDarkTheme' : 'adaahLightTheme'">
    <AppNavbar />
    
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <AppFooter />
    <AppSnackbar />
    <LoaderOverlay :loading="authLoading" />
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppNavbar from './components/Shared/AppNavbar.vue'
import AppFooter from './components/Shared/AppFooter.vue'
import AppSnackbar from './components/Shared/AppSnackbar.vue'
import LoaderOverlay from './components/Shared/LoaderOverlay.vue'

const store = useStore()
const darkMode = computed(() => store.state.theme.darkMode)
const authLoading = computed(() => store.state.auth.loading)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
