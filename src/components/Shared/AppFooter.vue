<template>
  <footer class="footer-root">
    <div class="footer-inner r-container">
      <div class="footer-grid">

        <!-- Brand Column -->
        <div class="footer-brand-col">
          <div class="footer-logo serif-text">Adah</div>
          <p class="footer-tagline">
            Jewellery for people who actually live in it.  
Shower, gym, sleep, repeat — it still shines.  
Anti-tarnish, skin-safe, and designed for your everyday.
          </p>
          <div class="footer-social">
            <!-- <a
              href="https://www.youtube.com/@tasneem4646-l2g"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="YouTube"
            >
              <v-icon size="17">mdi-youtube</v-icon>
            </a> -->
            <a
              href="https://www.instagram.com/label.adah?igsh=MWgwdDA3YTg4dGoweA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="Instagram"
            >
              <v-icon size="17">mdi-instagram</v-icon>
            </a>
            <!-- <a
              href="https://wa.me/918643839796"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="WhatsApp"
            >
              <v-icon size="17">mdi-whatsapp</v-icon>
            </a> -->
          </div>
        </div>

        <!-- Discover Column -->
        <div class="footer-link-col">
          <h4 class="footer-heading luxury-label">Discover</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link">New Arrivals</a></li>
            <!-- <li><a href="/" class="footer-link">Best Sellers</a></li> -->
            <li><a href="/" class="footer-link">Collections</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer-link-col">
          <h4 class="footer-heading luxury-label">Contact</h4>
          <ul class="footer-links">
            <li class="footer-link-static">hello@adaah.com</li>
            <!-- <li class="footer-link-static">+91 86438 39796</li> -->
            <!-- <li class="footer-link-static">Mon–Sat, 10 AM – 7 PM</li> -->
          </ul>
        </div>

      </div>

      <div class="footer-divider" />

      <div class="footer-copy">
        © {{ new Date().getFullYear() }} Adah Jewelry. Crafted with love. All rights reserved.
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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-top: 1px solid var(--border);
}

.footer-inner {
  padding-top: 4.5rem;
  padding-bottom: 2.5rem;
}

/* ── Grid ── */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 2.5rem 4rem;
  align-items: start;
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
  margin: 3rem 0 1.5rem;
}

.footer-copy {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.02em;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 1.5rem;
  }

  .footer-brand-col {
    grid-column: 1 / -1;
  }
}

@media (max-width: 639px) {
  .footer-inner {
    padding-top: 3.5rem;
    padding-bottom: 2rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-tagline {
    max-width: 100%;
  }
}
</style>
