<template>
  <div class="d-flex justify-center flex-wrap gap-2 pt-4">
    <v-btn
      v-for="cat in categories"
      :key="cat"
      variant="tonal"
      class="rounded-pill px-6"
      :color="activeCategory === cat ? 'primary' : ''"
      @click="selectCategory(cat)"
    >
      {{ cat }}
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: Array
})

const emit = defineEmits(['filter'])
const activeCategory = ref('All')

const selectCategory = (pCat) => {
  activeCategory.value = pCat
  emit('filter', pCat)
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
