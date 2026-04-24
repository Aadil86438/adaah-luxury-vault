<template>
  <div class="home-page">
    <!-- ── Hero Section ── -->
    <section class="hero-section" aria-label="Hero">
      <!-- Full-cover background image -->
      <img src="/src/assets/adah-logo.jpeg" alt="" class="hero-bg" aria-hidden="true" />
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

    <!-- ── Products Section ── -->
    <section id="products-section" class="products-section">
      <div class="products-inner">
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
      </div>
    </section>

    <ProductModal ref="productModal" />
  </div>
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
  min-height: 100vh;
  min-height: 100dvh;
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
  background: linear-gradient(
    to bottom,
    rgba(245, 239, 230, 0.82) 0%,
    rgba(245, 239, 230, 0.40) 28%,
    rgba(245, 239, 230, 0.12) 55%,
    rgba(245, 239, 230, 0.75) 100%
  );
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
  padding: 90px 24px 0;
  max-width: 640px;
  width: 100%;
}

.hero-tag {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--primary-hover);
  margin-bottom: 18px;
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
  padding: 0 24px 52px;
  display: flex;
  justify-content: center;
}

.hero-cta {
  font-size: 0.95rem;
  padding: 14px 44px !important;
  border-radius: var(--radius-md) !important;
  min-width: 200px;
}

/* ── Products Section ── */
.products-section {
  background: var(--bg);
  padding: var(--space-9) 0 var(--space-10);
}

.products-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  margin-bottom: 32px;
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
  margin-bottom: 12px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text-primary);
}

.mb-filter { margin-bottom: 40px; }

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  opacity: 0.5;
  margin-bottom: 20px;
}

/* ── Mobile ── */
@media (max-width: 599px) {
  .hero-content {
    padding-top: 72px;
  }

  .hero-title {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }

  .hero-bottom {
    padding-bottom: 40px;
  }

  .products-inner { padding: 0 16px; }
  .products-section { padding: 56px 0 72px; }
}
</style>
