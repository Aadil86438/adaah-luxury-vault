<template>
  <v-btn icon @click="toggleTheme" class="mx-1">
    <v-icon :color="darkMode ? 'white' : 'primary'">
      {{ darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
    </v-icon>
  </v-btn>
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
