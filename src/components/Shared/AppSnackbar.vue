<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="bottom right"
    flat
  >
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="closeSnackbar"
        icon="mdi-close"
        density="compact"
      ></v-btn>
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
