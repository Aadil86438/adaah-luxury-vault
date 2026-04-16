import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    redirect: '/'
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const lIsAuthenticated = store.getters['auth/isAuthenticated']
  const lIsAdmin = store.getters['auth/isAdmin']

  if (to.meta.requiresAuth && !lIsAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !lIsAdmin) {
    next('/')
  } else if (to.meta.guest && lIsAuthenticated) {
    if (lIsAdmin) next('/admin')
    else next('/')
  } else {
    next()
  }
})

export default router
