<template>
  <div class="category-scroll-wrap">
    <div class="category-list" role="list">
      <button v-for="cat in categories" :key="cat" class="cat-btn" :class="{ active: activeCategory === cat }" role="listitem" :aria-pressed="activeCategory === cat" @click="selectCategory(cat)">
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ categories: Array })
const emit = defineEmits(['filter'])
const activeCategory = ref('All')
const selectCategory = (pCat) => { activeCategory.value = pCat; emit('filter', pCat) }
</script>

<style scoped>
.category-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.category-scroll-wrap::-webkit-scrollbar { display: none; }
.category-list { display: flex; gap: 0.625rem; justify-content: center; flex-wrap: wrap; padding-bottom: 0.25rem; }
.cat-btn { font-family: var(--font-sans); font-size: 0.78rem; font-weight: 500; letter-spacing: 0.11em; text-transform: uppercase; padding: 0.5625rem 1.375rem; border-radius: var(--radius-pill); border: 1.5px solid var(--border); background: transparent; color: var(--text-secondary); cursor: pointer; white-space: nowrap; transition: all var(--transition-base); outline: none; }
.cat-btn:hover { border-color: var(--primary-hover); color: var(--primary-hover); background: var(--primary-muted); }
.cat-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.cat-btn.active { background: var(--primary-hover); border-color: var(--primary-hover); color: #fff; box-shadow: 0 4px 16px rgba(217, 122, 108, 0.28); }

@media (max-width: 639px) {
  .category-list { justify-content: flex-start; flex-wrap: nowrap; padding: 0.25rem 0.125rem 0.75rem; }
}
</style>
