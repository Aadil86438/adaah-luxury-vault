<template>
  <footer class="footer-root">
    <div class="footer-inner">
      <div class="footer-grid">

        <!-- Brand Column -->
        <div class="footer-brand-col">
          <div class="footer-logo serif-text">Adaah</div>
          <p class="footer-tagline">
            Fine jewelry, handcrafted for the modern soul. Every piece tells a story of passion and heritage.
          </p>
          <div class="footer-social">
            <a
              href="https://www.youtube.com/@tasneem4646-l2g"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="YouTube"
            >
              <v-icon size="17">mdi-youtube</v-icon>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="Instagram"
            >
              <v-icon size="17">mdi-instagram</v-icon>
            </a>
            <a
              href="https://wa.me/918643839796"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="WhatsApp"
            >
              <v-icon size="17">mdi-whatsapp</v-icon>
            </a>
          </div>
        </div>

        <!-- Spacer -->
        <div class="footer-spacer" />

        <!-- Discover Column -->
        <div class="footer-link-col">
          <h4 class="footer-heading luxury-label">Discover</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link">New Arrivals</a></li>
            <li><a href="/" class="footer-link">Best Sellers</a></li>
            <li><a href="/" class="footer-link">Collections</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer-link-col">
          <h4 class="footer-heading luxury-label">Contact</h4>
          <ul class="footer-links">
            <li class="footer-link-static">hello@adaah.com</li>
            <li class="footer-link-static">+91 86438 39796</li>
            <li class="footer-link-static">Mon–Sat, 10 AM – 7 PM</li>
          </ul>
        </div>

      </div>

      <div class="footer-divider" />

      <div class="footer-copy">
        © {{ new Date().getFullYear() }} Adaah Jewelry. Crafted with love. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.footer-root {
  background: var(--bg-offset);
  border-top: 1px solid var(--border);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 32px 40px;
}

/* ── Grid ── */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr auto 160px 200px;
  gap: 40px;
  align-items: start;
}

.footer-spacer {
  width: 48px;
}

/* ── Brand ── */
.footer-logo {
  font-size: 2.2rem;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.footer-tagline {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 300px;
  margin-bottom: 24px;
}

/* ── Social Buttons ── */
.footer-social {
  display: flex;
  gap: 10px;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-muted);
  color: var(--primary-hover);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: background var(--transition-base), transform var(--transition-fast), color var(--transition-base);
}

.social-btn:hover {
  background: var(--primary-hover);
  color: #fff;
  transform: translateY(-2px);
  border-color: var(--primary-hover);
}

/* ── Link Columns ── */
.footer-heading {
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--primary-hover);
}

.footer-link-static {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* ── Bottom Bar ── */
.footer-divider {
  height: 1px;
  background: var(--border);
  margin: 48px 0 24px;
}

.footer-copy {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.02em;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px 24px;
  }

  .footer-spacer {
    display: none;
  }

  .footer-brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    padding: 56px 20px 32px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-tagline {
    max-width: 100%;
  }
}
</style>
