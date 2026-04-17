<template>
  <button
    class="theme-toggle-btn"
    :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <transition name="icon-swap" mode="out-in">
      <v-icon v-if="darkMode" key="sun" class="toggle-icon">mdi-weather-sunny</v-icon>
      <v-icon v-else key="moon" class="toggle-icon">mdi-weather-night</v-icon>
    </transition>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const darkMode = computed(() => store.state.theme.darkMode)

const toggleTheme = () => {
  store.dispatch('theme/toggleTheme')
}
</script>

<style scoped>
.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--primary-muted);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-fast);
  padding: 0;
}

.theme-toggle-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  transform: rotate(12deg);
}

.toggle-icon {
  color: inherit;
  font-size: 18px !important;
}

/* ── Icon swap transition ── */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(0.7);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.7);
}
</style>
