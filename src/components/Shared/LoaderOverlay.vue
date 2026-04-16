<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
    scrim="#000"
    opacity="0.7"
  >
    <div class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
        width="6"
      ></v-progress-circular>
      <p class="text-white luxury-text mt-4">Loading Adaah...</p>
    </div>
  </v-overlay>
</template>

<script setup>
defineProps({
  loading: Boolean
})
</script>
