<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
    scrim="rgba(0,0,0,0.72)"
  >
    <div class="loader-content">
      <div class="loader-ring">
        <v-progress-circular
          color="primary"
          indeterminate
          size="56"
          width="3"
        />
      </div>
      <p class="loader-text serif-text">Loading Adaah…</p>
    </div>
  </v-overlay>
</template>

<script setup>
defineProps({ loading: Boolean })
</script>

<style scoped>
.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(250, 247, 242, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(230, 167, 155, 0.2);
}

.loader-text {
  color: rgba(255, 255, 255, 0.88);
  font-size: 1rem;
  letter-spacing: 0.06em;
  font-weight: 400;
  margin: 0;
}
</style>
