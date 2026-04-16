import { createClient } from '@supabase/supabase-js'

const lSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const lSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(lSupabaseUrl, lSupabaseAnonKey)

export const SupabaseService = {
  // Auth
  signUp(pEmail, pPassword) {
    return supabase.auth.signUp({ email: pEmail, password: pPassword })
  },

  signIn(pEmail, pPassword) {
    return supabase.auth.signInWithPassword({ email: pEmail, password: pPassword })
  },

  signOut() {
    return supabase.auth.signOut()
  },

  getSession() {
    return supabase.auth.getSession()
  },

  // Users Table
  createUserProfile(pId, pEmail, pRole = 'user') {
    return supabase
      .from('users')
      .insert([{ id: pId, email: pEmail, role: pRole }])
  },

  getUserProfile(pId) {
    return supabase
      .from('users')
      .select('*')
      .eq('id', pId)
      .single()
  },

  // Products Table
  getProducts() {
    return supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
  },

  getActiveProducts() {
    return supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
  },

  createProduct(pProduct) {
    return supabase
      .from('products')
      .insert([pProduct])
  },

  updateProduct(pId, pUpdates) {
    return supabase
      .from('products')
      .update(pUpdates)
      .eq('id', pId)
  },

  deleteProduct(pId) {
    return supabase
      .from('products')
      .delete()
      .eq('id', pId)
  },

  // Storage
  uploadProductImage(pFile) {
    const lFileName = `${Date.now()}-${pFile.name}`
    return supabase.storage
      .from('product-images')
      .upload(lFileName, pFile)
  },

  getPublicUrl(pPath) {
    return supabase.storage
      .from('product-images')
      .getPublicUrl(pPath)
  },

  // Orders Table
  createOrder(pOrder) {
    return supabase
      .from('orders')
      .insert([pOrder])
  },

  getOrders() {
    return supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
  }
}
