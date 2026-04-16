<template>
  <v-footer class="bg-background py-12 border-t">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h2 class="luxury-text mb-4">ADAAH</h2>
          <p class="text-body-2 opacity-70 mb-6">
            Timeless beauty, handcrafted for the modern soul. Premium jewelry that tells your story.
          </p>
          <div class="d-flex">
            <v-btn icon variant="text" href="https://www.youtube.com/@tasneem4646-l2g" target="_blank" class="mr-2">
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
            <v-btn icon variant="text" href="https://instagram.com/" target="_blank">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="2" offset-md="2">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Discover</h4>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item to="/" class="pa-0 min-height-auto mb-2">New Arrivals</v-list-item>
            <v-list-item to="/" class="pa-0 min-height-auto mb-2">Best Sellers</v-list-item>
            <v-list-item to="/" class="pa-0 min-height-auto">Collections</v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="4">
          <h4 class="text-subtitle-1 font-weight-bold mb-4">Contact</h4>
          <p class="text-body-2 mb-2">Email: hello@adaah.com</p>
          <p class="text-body-2 mb-2">WhatsApp: +91 8643839796</p>
          <p class="text-body-2">Hours: Mon-Sat, 10AM - 7PM</p>
        </v-col>
      </v-row>
      <v-divider class="my-8"></v-divider>
      <div class="text-center text-caption opacity-60">
        &copy; {{ new Date().getFullYear() }} Adaah Jewelry. All rights reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.min-height-auto {
  min-height: auto !important;
}
</style>
