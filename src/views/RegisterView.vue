<template>
  <v-container class="fill-height justify-center align-center py-12">
    <v-card width="100%" max-width="450" class="premium-card pa-8 border" flat>
      <div class="text-center mb-8">
        <h1 class="luxury-text mb-2">Create Account</h1>
        <p class="text-body-2 opacity-70">Join the Adaah luxury community</p>
      </div>

      <v-form @submit.prevent="handleRegister" v-model="formValid">
        <v-text-field
          v-model="email"
          label="Email Address"
          type="email"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
          required
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Minimum 6 characters']"
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
          Register
        </v-btn>

        <div class="text-center text-body-2">
          Already have an account? 
          <router-link to="/login" class="text-primary font-weight-bold text-decoration-none">Sign in here</router-link>
        </div>
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

const handleRegister = () => {
  if (!formValid.value) return

  loading.value = true
  store.dispatch('auth/register', { email: email.value, password: password.value })
    .then(() => {
      store.dispatch('snackbar/show', { text: 'Account created successfully!', color: 'success' })
      router.push('/')
    })
    .catch((pError) => {
      store.dispatch('snackbar/show', { text: pError.message || 'Registration failed', color: 'error' })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
