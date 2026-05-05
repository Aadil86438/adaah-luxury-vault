<template>
  <footer class="footer-root">
    <v-container style="max-width: 1280px; margin: 0 auto;" class="px-4 py-8">
      <v-row>
        <!-- Brand Column -->
        <v-col cols="12" md="6" class="footer-brand-col">
          <div class="footer-logo serif-text">Adah</div>
          <p class="footer-tagline">
            Jewellery for people who actually live in it.  
            Shower, gym, sleep, repeat — it still shines.  
            Anti-tarnish, skin-safe, and designed for your everyday.
          </p>
          <div class="footer-social">
            <a
              href="https://www.instagram.com/label.adah?igsh=MWgwdDA3YTg4dGoweA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="Instagram"
            >
              <v-icon size="17">mdi-instagram</v-icon>
            </a>
          </div>
        </v-col>

        <!-- Discover Column -->
        <v-col cols="6" md="3" class="footer-link-col">
          <h4 class="footer-heading luxury-label">Discover</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link">New Arrivals</a></li>
            <li><a href="/" class="footer-link">Collections</a></li>
          </ul>
        </v-col>

        <!-- Contact Column -->
        <v-col cols="6" md="3" class="footer-link-col">
          <h4 class="footer-heading luxury-label">Contact</h4>
          <ul class="footer-links">
            <li class="footer-link-static">hello@adaah.com</li>
          </ul>
        </v-col>
      </v-row>

      <div class="footer-divider" />

      <div class="footer-copy">
        © {{ new Date().getFullYear() }} Adah Jewelry. Crafted with love. All rights reserved.
      </div>
    </v-container>
  </footer>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.footer-root {
  background: var(--bg-offset);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-top: 1px solid var(--border);
}

/* ── Brand ── */
.footer-logo {
  font-size: 2.2rem;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.footer-tagline {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 18.75rem;
  margin-bottom: 1.5rem;
}

/* ── Social Buttons ── */
.footer-social {
  display: flex;
  gap: 0.625rem;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
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
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  margin: 2rem 0 1.5rem;
}

.footer-copy {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.02em;
}

/* ── Responsive ── */
@media (max-width: 639px) {
  .footer-tagline {
    max-width: 100%;
  }
}
</style>
