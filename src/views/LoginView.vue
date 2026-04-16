<template>
  <v-container class="fill-height justify-center align-center py-12">
    <v-card width="100%" max-width="450" class="premium-card pa-8 border" flat>
      <div class="text-center mb-8">
        <h1 class="luxury-text mb-2">Welcome Back</h1>
        <p class="text-body-2 opacity-70">Sign in to your Adaah account</p>
      </div>

      <v-form @submit.prevent="handleLogin" v-model="formValid">
        <v-text-field
          v-model="email"
          label="Email Address"
          type="email"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
          required
          autofocus
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'Password is required']"
          required
          class="mb-6"
        ></v-text-field>

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          class="rounded-pill mb-4"
          :loading="loading"
          :disabled="!formValid || loading"
        >
          Sign In
        </v-btn>

        <!-- Registration link removed as per requirement -->
      </v-form>
    </v-card>
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
      console.error('Login Handler Error:', pError)
      store.dispatch('snackbar/show', { text: pError.message || 'Login failed', color: 'error' })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
