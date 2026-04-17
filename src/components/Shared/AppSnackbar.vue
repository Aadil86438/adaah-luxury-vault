<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="bottom right"
    rounded="lg"
    elevation="4"
  >
    <span class="snackbar-text">{{ snackbar.text }}</span>
    <template v-slot:actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        density="compact"
        @click="closeSnackbar"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const snackbar = computed(() => store.state.snackbar)

const closeSnackbar = () => {
  store.dispatch('snackbar/hide')
}
</script>

<style scoped>
.snackbar-text {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
