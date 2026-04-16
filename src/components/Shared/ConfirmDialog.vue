<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card class="premium-card">
      <v-card-title class="luxury-text pt-6 px-6">{{ title }}</v-card-title>
      <v-card-text class="pa-6">{{ message }}</v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn color="error" variant="flat" class="rounded-pill px-6" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const title = ref('')
const message = ref('')
let resolvePromise

const open = (pTitle, pMessage) => {
  title.value = pTitle
  message.value = pMessage
  show.value = true
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

const confirm = () => {
  show.value = false
  resolvePromise(true)
}

const cancel = () => {
  show.value = false
  resolvePromise(false)
}

defineExpose({ open })
</script>
