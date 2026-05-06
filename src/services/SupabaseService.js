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
  },

  /**
   * Create an order with multiple items atomically.
   * 1. Insert into orders → get back the id
   * 2. Insert all order_items with that order_id
   * Returns { order, items } on success.
   */
  async createOrderWithItems(pOrderData, pItems) {
    // Step 1: Create the order row
    const { data: lOrder, error: lOrderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: pOrderData.customer_name,
        phone: pOrderData.phone,
        total_amount: pOrderData.total_amount
      }])
      .select()
      .single()

    if (lOrderError) throw lOrderError
    if (!lOrder) throw new Error('Order creation returned no data')

    // Step 2: Create order_items linked to the new order
    const lItemsPayload = pItems.map(item => ({
      order_id: lOrder.id,
      product_id: item.id || null,
      product_name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }))

    const { data: lItems, error: lItemsError } = await supabase
      .from('order_items')
      .insert(lItemsPayload)
      .select()

    if (lItemsError) throw lItemsError

    return { order: lOrder, items: lItems }
  },

  /** Fetch order_items for a specific order */
  getOrderItems(pOrderId) {
    return supabase
      .from('order_items')
      .select('*')
      .eq('order_id', pOrderId)
      .order('created_at', { ascending: true })
  },

  /** Fetch all orders with their items (for admin) */
  getOrdersWithItems() {
    return supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
  }
}
