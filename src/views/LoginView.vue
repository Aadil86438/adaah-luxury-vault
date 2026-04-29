<template>
  <v-container fluid class="pa-0 fill-height login-page">
    <v-container style="max-width: 1280px;" class="px-4 py-4 fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="5" xl="4">
          <div class="login-card">
            <!-- Brand Mark -->
            <div class="login-brand">
              <span class="login-logo serif-text">Adaah</span>
              <span class="login-tagline luxury-label">Admin Portal</span>
            </div>

            <!-- Heading -->
            <div class="login-heading">
              <h1 class="login-title serif-text">Welcome Back</h1>
              <p class="login-subtitle">Sign in to manage your collection</p>
            </div>

            <!-- Form -->
            <v-form @submit.prevent="handleLogin" v-model="formValid" class="login-form">
              <v-text-field
                v-model="email"
                id="login-email"
                label="Email Address"
                type="email"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                required
                autofocus
                class="login-input"
              />

              <v-text-field
                v-model="password"
                id="login-password"
                label="Password"
                type="password"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Password is required']"
                required
                class="login-input"
              />

              <button
                id="login-submit"
                type="submit"
                class="btn-terra login-btn"
                :disabled="!formValid || loading"
                :class="{ disabled: !formValid || loading }"
              >
                <span v-if="loading" class="btn-loading">
                  <v-progress-circular size="16" width="2" indeterminate color="white" />
                  Signing in…
                </span>
                <span v-else>Sign In</span>
              </button>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Decorative Background -->
    <div class="login-deco" aria-hidden="true" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const formValid = ref(false)

const handleLogin = () => {
  if (!formValid.value) return

  loading.value = true
  store.dispatch('auth/login', { email: email.value, password: password.value })
    .then(() => {
      store.dispatch('snackbar/show', { text: 'Login successful!', color: 'success' })
      const lIsAdmin = store.getters['auth/isAdmin']
      router.push(lIsAdmin ? '/admin' : '/')
    })
    .catch((pError) => {
      store.dispatch('snackbar/show', { text: pError.message || 'Login failed', color: 'error' })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - var(--navbar-height));
  background: transparent;
  position: relative;
  overflow: hidden;
}

/* ── Decorative Background ── */
.login-deco {
  position: absolute;
  top: -20%;
  right: -10%;
  width: clamp(20rem, 50vw, 37.5rem);
  height: clamp(20rem, 50vw, 37.5rem);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(230, 167, 155, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Card ── */
.login-card {
  width: 100%;
  max-width: 26.25rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 3rem 2.75rem 3.25rem;
  position: relative;
  z-index: 1;
}

/* ── Brand ── */
.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.25rem;
  gap: 0.375rem;
}

.login-logo {
  font-size: 2.4rem;
  color: var(--text-primary);
  letter-spacing: 0.04em;
}

.login-tagline {
  color: var(--primary-hover);
}

/* ── Heading ── */
.login-heading {
  margin-bottom: var(--space-6);
  text-align: center;
}

.login-title {
  font-size: 1.7rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* ── Form ── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-input {
  /* inherits Vuetify theming via Vuetify theme + CSS vars */
}

.login-btn {
  width: 100%;
  padding: 0.875rem 1.75rem !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.95rem;
  border: none;
  margin-top: 0.75rem;
  text-align: center;
  cursor: pointer;
}

.login-btn.disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  justify-content: center;
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .login-card {
    padding: 2.5rem 1.75rem 2.75rem;
  }

  .login-logo {
    font-size: 2rem;
  }
}
</style>
