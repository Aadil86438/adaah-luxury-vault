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
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppNavbar from './components/Shared/AppNavbar.vue'
import AppFooter from './components/Shared/AppFooter.vue'
import AppSnackbar from './components/Shared/AppSnackbar.vue'
import LoaderOverlay from './components/Shared/LoaderOverlay.vue'

const store = useStore()
const darkMode = computed(() => store.state.theme.darkMode)
const authLoading = computed(() => store.state.auth.loading)

// ── CSS Variable Bridge ──────────────────────────────────────
// Syncs Vuex theme state → html.dark-mode class
// This makes CSS custom properties respond to theme changes.
const applyThemeClass = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

onMounted(() => applyThemeClass(darkMode.value))
watch(darkMode, (isDark) => applyThemeClass(isDark))
</script>

<style>
/* ── Page Transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Ensure v-main uses design-system bg ── */
.v-main {
  background: var(--bg) !important;
}

/* ── v-application root reset ── */
.v-application {
  font-family: var(--font-sans, 'DM Sans', sans-serif) !important;
  background: var(--bg) !important;
}
</style>
