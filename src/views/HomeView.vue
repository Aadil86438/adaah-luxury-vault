<template>
  <v-container fluid class="pa-0">
    <!-- ── Hero Section ── -->
    <section class="hero-section" aria-label="Hero">
      <!-- Background Image specifically for Hero -->
      <img src="../assets/golden-leaves-bg.png" class="hero-bg" alt="" aria-hidden="true" />
      <div class="hero-overlay"></div>

      <!-- Tag + Headline at top-centre -->
      <div class="hero-content">
        <div class="hero-tag reveal-on-scroll">✦ New Collection 2026</div>
        <h1 class="hero-title reveal-on-scroll">Crafted to Shine,<br />Designed to Stay.</h1>
      </div>

      <!-- Shop Now pinned to the bottom of the hero -->
      <div class="hero-bottom">
        <button class="btn-terra hero-cta reveal-on-scroll" @click="scrollToProducts">
          Shop Now
        </button>
      </div>
    </section>

    <v-container style="max-width: 1280px; margin: 0 auto;" class="px-4 py-8">
      <!-- ── Products Section ── -->
      <section id="products-section" class="products-section">
        <div class="section-header reveal-on-scroll">
          <span class="section-tag">♡ Our Collection</span>
          <h2 class="section-title serif-text">Best Sellers</h2>
        </div>

        <CategoryFilter
          :categories="categories"
          class="mb-filter reveal-on-scroll"
          @filter="handleFilter"
        />

        <ProductGrid
          :products="filteredProducts"
          :loading="loading"
          @view="openModal"
        />

        <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
          <p class="serif-text empty-title">No pieces found.</p>
          <button class="btn-outline" @click="activeCategory = 'All'">View All</button>
        </div>
      </section>
    </v-container>

    <ProductModal ref="productModal" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SupabaseService } from '../services/SupabaseService'
import CategoryFilter from '../components/Home/CategoryFilter.vue'
import ProductGrid from '../components/Home/ProductGrid.vue'
import ProductModal from '../components/Product/ProductModal.vue'

const products = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const productModal = ref(null)

const categories = computed(() =>
  ['All', ...new Set(products.value.map(p => p.category).filter(Boolean))]
)
const filteredProducts = computed(() =>
  activeCategory.value === 'All'
    ? products.value
    : products.value.filter(p => p.category === activeCategory.value)
)

const fetchProducts = () => {
  loading.value = true
  SupabaseService.getActiveProducts()
    .then(({ data }) => { products.value = data || [] })
    .catch(() => {})
    .finally(() => { loading.value = false })
}

const handleFilter = (c) => { activeCategory.value = c }
const openModal = (p) => { productModal.value.open(p) }
const scrollToProducts = () => {
  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  fetchProducts()
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active') }),
    { threshold: 0.08 }
  )
  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el))
})
</script>

<style scoped>
/* ── Hero ── */
.hero-section {
  position: relative;
  width: 100%;
  max-width: 100%;           /* prevent horizontal overflow */
  min-height: 80vh;          /* required: 80vh desktop */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

/* Full-bleed background */
.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  display: block;
}

/* Overlay: strong at top so text reads, fades in the middle so logo shows */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.75); /* required: white overlay */
  pointer-events: none;
}

/* Tag + Headline at the top */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(5rem, 12vw, 5.625rem) var(--space-5) 0;
  max-width: 40rem;
  width: 100%;
  box-sizing: border-box;
}

.hero-tag {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--primary-hover);
  margin-bottom: 1.125rem;
  font-weight: 600;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.6rem, 5vw, 4.4rem);
  line-height: 1.1;
  font-weight: 500;
  color: #3D3228;
  letter-spacing: -0.02em;
}

/* Shop Now pinned at the bottom */
.hero-bottom {
  position: relative;
  z-index: 2;
  padding: 0 var(--space-5) 3.25rem;
  display: flex;
  justify-content: center;
}

.hero-cta {
  font-size: 0.95rem;
  padding: 0.875rem 2.75rem !important;
  border-radius: var(--radius-md) !important;
  min-width: 12.5rem;
}

/* ── Products Section ── */
.products-section {
  background: transparent;
}

.section-header {
  margin-bottom: var(--space-6);
  text-align: center;
}

.section-tag {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary-hover);
  font-weight: 500;
  display: block;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text-primary);
}

.mb-filter { margin-bottom: 2.5rem; }

.empty-state {
  text-align: center;
  padding: 5rem 0;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  opacity: 0.5;
  margin-bottom: 1.25rem;
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .hero-section {
    min-height: 60vh; /* required: 60vh mobile */
  }

  .hero-content {
    padding-top: 5rem;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }

  .hero-title {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }

  .hero-bottom {
    padding-bottom: 2.5rem;
  }
}
</style>
