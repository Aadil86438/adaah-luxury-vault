<template>
  <div class="home-page">
    <!-- ── Hero Section ── -->
    <section class="hero-section" aria-label="Hero">
      <div class="hero-content">
        <div class="hero-tag reveal-on-scroll">✦ New Collection 2026</div>
        <h1 class="hero-title reveal-on-scroll">Adored by You,<br />Crafted to Shine,<br />Designed to Stay.</h1>
        <button class="btn-terra hero-cta reveal-on-scroll" @click="scrollToProducts">
          Shop Now
        </button>
      </div>

      <!-- Right: Adah logo image -->
      <div class="hero-logo-col">
        <img src="/src/assets/adah-logo.jpeg" alt="Adah — Everyday Elegance" class="hero-logo-img reveal-on-scroll" />
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
  background-color: #F5EFE6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 0;
}

/* ── Left: Text Content ── */
.hero-content {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 0 48px 0 max(48px, calc((100vw - 1200px) / 2 + 48px));
  max-width: 580px;
}

.hero-tag {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--primary-hover);
  margin-bottom: 22px;
  font-weight: 600;
  display: block;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 4.5vw, 4.8rem);
  line-height: 1.08;
  font-weight: 500;
  color: #3D3228;
  margin-bottom: 44px;
  letter-spacing: -0.02em;
}

.hero-cta {
  font-size: 0.95rem;
  padding: 14px 36px !important;
  border-radius: var(--radius-md) !important;
  min-width: 200px;
}

/* ── Right: Logo Image ── */
.hero-logo-col {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 48px 40px 0;
  max-width: 560px;
}

.hero-logo-img {
  width: 100%;
  max-width: 480px;
  height: auto;
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(74, 63, 53, 0.12);
  object-fit: contain;
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

/* ── Responsive: Tablet ── */
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    min-height: auto;
    padding: 80px 24px 60px;
    gap: 40px;
  }

  .hero-content {
    padding: 0;
    max-width: 100%;
    flex: none;
  }

  .hero-logo-col {
    padding: 0;
    max-width: 340px;
    flex: none;
    width: 100%;
  }

  .hero-logo-img {
    max-width: 300px;
  }
}

/* ── Responsive ── */
@media (max-width: 599px) {
  .hero-section {
    padding: 64px 20px 48px;
    gap: 32px;
  }

  .hero-logo-img {
    max-width: 240px;
    box-shadow: 0 12px 36px rgba(74, 63, 53, 0.10);
  }

  .products-inner {
    padding: 0 16px;
  }

  .products-section {
    padding: 56px 0 72px;
  }
}
</style>
