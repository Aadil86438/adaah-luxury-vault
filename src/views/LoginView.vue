<template>
  <div class="login-page">
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

    <!-- Decorative Background -->
    <div class="login-deco" aria-hidden="true" />
  </div>
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
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 40px 16px;
  position: relative;
  overflow: hidden;
}

/* ── Decorative Background ── */
.login-deco {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(230, 167, 155, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Card ── */
.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 48px 44px 52px;
  position: relative;
  z-index: 1;
}

/* ── Brand ── */
.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
  gap: 6px;
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
  margin-bottom: 32px;
  text-align: center;
}

.login-title {
  font-size: 1.7rem;
  color: var(--text-primary);
  margin-bottom: 8px;
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
  gap: 8px;
}

.login-input {
  /* inherits Vuetify theming via Vuetify theme + CSS vars */
}

.login-btn {
  width: 100%;
  padding: 14px 28px !important;
  border-radius: var(--radius-md) !important;
  font-size: 0.95rem;
  border: none;
  margin-top: 12px;
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
  gap: 10px;
  justify-content: center;
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .login-card {
    padding: 40px 28px 44px;
  }

  .login-logo {
    font-size: 2rem;
  }
}
</style>
