<template>
  <!-- App Bar -->
  <v-app-bar flat class="app-navbar" :elevation="0" height="68">
    <v-container class="d-flex align-center py-0 h-100">
      <!-- Mobile Hamburger -->
      <v-app-bar-nav-icon
        variant="text"
        class="d-md-none navbar-icon-btn"
        @click="drawer = !drawer"
      />

      <!-- Brand -->
      <div class="navbar-brand serif-text" @click="$router.push('/')">
        Adaah
      </div>

      <v-spacer />

      <!-- Desktop Nav Links -->
      <nav class="d-none d-md-flex align-center navbar-links">
        <router-link to="/" class="luxury-nav-link">Home</router-link>
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="luxury-nav-link"
        >Admin</router-link>
        <router-link
          v-if="isAuthenticated && isAdmin"
          to="/admin"
          class="luxury-nav-link"
        >Dashboard</router-link>
      </nav>

      <!-- Theme Toggle -->
      <ThemeToggle class="ml-2" />

      <!-- User Menu -->
      <v-menu v-if="isAuthenticated" location="bottom end" :offset="8">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-1" variant="text">
            <v-avatar class="user-avatar" size="34">
              <span class="avatar-initial">{{ userEmail.charAt(0).toUpperCase() }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="admin-menu-list mt-1 rounded-xl" min-width="160">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            class="logout-item"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary width="272" class="mobile-drawer">
    <div class="drawer-content">
      <div class="drawer-brand serif-text">Adaah</div>
      <v-divider class="drawer-divider" />
      <nav class="drawer-nav">
        <router-link to="/" class="drawer-link" @click="drawer = false">
          <v-icon size="18">mdi-home-outline</v-icon>
          <span>Home</span>
        </router-link>
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="drawer-link"
          @click="drawer = false"
        >
          <v-icon size="18">mdi-shield-lock-outline</v-icon>
          <span>Admin Portal</span>
        </router-link>
        <router-link
          v-if="isAuthenticated && isAdmin"
          to="/admin"
          class="drawer-link"
          @click="drawer = false"
        >
          <v-icon size="18">mdi-view-dashboard-outline</v-icon>
          <span>Dashboard</span>
        </router-link>
        <button
          v-if="isAuthenticated"
          class="drawer-link drawer-logout"
          @click="handleLogout"
        >
          <v-icon size="18">mdi-logout</v-icon>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const store = useStore()
const router = useRouter()
const drawer = ref(false)

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const userEmail = computed(() => store.getters['auth/userEmail'] || '')

const handleLogout = () => {
  drawer.value = false
  store.dispatch('auth/logout').then(() => router.push('/login'))
}
</script>

<style scoped>
/* ── Brand ── */
.navbar-brand {
  font-size: 1.75rem;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
  transition: opacity var(--transition-fast);
}

.navbar-brand:hover {
  opacity: 0.78;
}

/* ── Nav Links ── */
.navbar-links {
  gap: 4px;
}

.navbar-icon-btn {
  color: var(--text-primary) !important;
}

/* ── User Avatar ── */
.user-avatar {
  background: var(--primary);
}

.avatar-initial {
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
}

/* ── Admin Menu ── */
.admin-menu-list {
  background: var(--card) !important;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md) !important;
}

.logout-item {
  color: #C0392B !important;
}

/* ── Mobile Drawer ── */
.mobile-drawer {
  background: var(--card) !important;
}

.drawer-content {
  padding: 32px 24px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-brand {
  font-size: 2rem;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  margin-bottom: 28px;
}

.drawer-divider {
  border-color: var(--border) !important;
  margin-bottom: 24px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: background var(--transition-fast);
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.drawer-link:hover {
  background: var(--primary-muted);
  color: var(--primary-hover);
}

.drawer-logout {
  color: #C0392B;
  margin-top: 8px;
}

.drawer-logout:hover {
  background: rgba(192, 57, 43, 0.08);
  color: #C0392B;
}
</style>
