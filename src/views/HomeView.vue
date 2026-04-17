<template>
  <div class="home-page">
    <!-- ── Cinematic Hero Section ── -->
    <section class="hero-section" aria-label="Hero">
      <div class="hero-overlay" />
      <div class="hero-content">
        <div class="hero-tag reveal-on-scroll">✦ New Collection 2026</div>
        <h1 class="hero-title reveal-on-scroll">Adored by You,<br />Handcrafted by Us.</h1>
        <p class="hero-subtitle reveal-on-scroll">
          Fine jewelry that tells a story of passion, heritage, and timeless beauty.
        </p>
        <button class="btn-terra hero-cta reveal-on-scroll" @click="scrollToProducts">
          Discover Collection
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
  min-height: 88vh;
  min-height: 88dvh;
  background-image: url('/src/assets/luxury-hero.png');
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(20, 10, 5, 0.70) 0%,
    rgba(20, 10, 5, 0.38) 55%,
    rgba(20, 10, 5, 0.10) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
}

.hero-tag {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 22px;
  font-weight: 500;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  line-height: 1.06;
  font-weight: 500;
  color: #fff;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-family: var(--font-sans);
  font-size: clamp(0.95rem, 2.2vw, 1.15rem);
  opacity: 0.88;
  max-width: 460px;
  line-height: 1.75;
  margin-bottom: 44px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-cta {
  font-size: 0.95rem;
  padding: 14px 36px !important;
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
    min-height: 75vh;
    background-position: center;
  }

  .hero-content {
    padding: 0 20px;
  }

  .products-inner {
    padding: 0 16px;
  }

  .products-section {
    padding: 56px 0 72px;
  }
}
</style>
