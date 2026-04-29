<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <div class="confirm-card">
      <h3 class="confirm-title serif-text">{{ title }}</h3>
      <p class="confirm-message">{{ message }}</p>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-cancel" @click="cancel">Cancel</button>
        <button class="confirm-btn confirm-confirm" @click="confirm">Confirm</button>
      </div>
    </div>
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
  return new Promise((resolve) => { resolvePromise = resolve })
}
const confirm = () => { show.value = false; resolvePromise(true) }
const cancel = () => { show.value = false; resolvePromise(false) }
defineExpose({ open })
</script>

<style scoped>
.confirm-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: 2.25rem 2rem 1.75rem; }
.confirm-title { font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.75rem; line-height: 1.2; }
.confirm-message { font-family: var(--font-sans); font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.75rem; }
.confirm-actions { display: flex; justify-content: flex-end; gap: 0.625rem; }
.confirm-btn { font-family: var(--font-sans); font-size: 0.88rem; font-weight: 500; padding: 0.625rem 1.375rem; border-radius: var(--radius-md); border: none; cursor: pointer; transition: background var(--transition-base), transform var(--transition-fast); }
.confirm-cancel { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.confirm-cancel:hover { background: var(--primary-muted); color: var(--text-primary); }
.confirm-confirm { background: #C0392B; color: #fff; }
.confirm-confirm:hover { background: #A93226; transform: translateY(-1px); }
</style>
