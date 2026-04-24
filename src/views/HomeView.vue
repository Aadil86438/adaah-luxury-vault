<template>
  <div class="home-page">
    <!-- ── Hero Section ── -->
    <section class="hero-section" aria-label="Hero">
      <!-- Full-width background: the adah brand image -->
      <img src="/src/assets/adah-logo.jpeg" alt="" class="hero-bg-img" aria-hidden="true" />
      <div class="hero-overlay"></div>

      <!-- Centered text on top -->
      <div class="hero-content">
        <div class="hero-tag reveal-on-scroll">✦ New Collection 2026</div>
        <h1 class="hero-title reveal-on-scroll">Crafted to Shine,<br />Designed to Stay.</h1>
        <button class="btn-terra hero-cta reveal-on-scroll" @click="scrollToProducts">
          Shop Now
        </button>
      </div>
    </section>

    <!-- ── Products Section ── -->
    <section id="products-section" class="products-section">
      <div class="products-inner">
        <!-- Section Header -->
        <div class="section-header reveal-on-scroll">
          <span class="section-tag">♡ Our Collection</span>
          <h2 class="section-title serif-text">Best Sellers</h2>
        </div>

        <!-- Category Filter -->
        <CategoryFilter
          :categories="categories"
          class="mb-filter reveal-on-scroll"
          @filter="handleFilter"
        />

        <!-- Product Grid -->
        <ProductGrid
          :products="filteredProducts"
          :loading="loading"
          @view="openModal"
        />

        <!-- Empty State -->
        <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
          <p class="serif-text empty-title">No pieces found.</p>
          <button class="btn-outline" @click="activeCategory = 'All'">View All</button>
        </div>
      </div>
    </section>

    <!-- ── Product Modal ── -->
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

const handleFilter = (pCategory) => { activeCategory.value = pCategory }
const openModal = (pProduct) => { productModal.value.open(pProduct) }
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
  min-height: 92vh;
  min-height: 92dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  padding-top: 100px;
}

/* Full-width background image */
.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  z-index: 0;
}

/* Light warm overlay so text pops without killing the image */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(245, 239, 230, 0.55);
  z-index: 1;
}

/* Text block centered over the bg */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  max-width: 720px;
}

.hero-tag {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--primary-hover);
  margin-bottom: 24px;
  font-weight: 600;
  display: block;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1.1;
  font-weight: 500;
  color: #3D3228;
  margin-bottom: 44px;
  letter-spacing: -0.02em;
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

.mb-filter {
  margin-bottom: 40px;
}

/* ── Empty State ── */
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

/* ── Responsive ── */
@media (max-width: 599px) {
  .hero-section {
    min-height: 80vh;
    min-height: 80dvh;
  }

  .hero-title {
    font-size: clamp(2.4rem, 9vw, 3.2rem);
    margin-bottom: 32px;
  }

  .products-inner {
    padding: 0 16px;
  }

  .products-section {
    padding: 56px 0 72px;
  }
}
</style>
