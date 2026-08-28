'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createClientServer() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    }
  })
}

export async function login(formData: FormData) {
  const supabase = await createClientServer()
  // Implement login via standard supabase auth
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }
  
  // Set auth cookie
  const cookieStore = await cookies()
  if (data.session) {
    cookieStore.set('sb-access-token', data.session.access_token, { httpOnly: true, secure: true })
    cookieStore.set('sb-refresh-token', data.session.refresh_token, { httpOnly: true, secure: true })
  }

  redirect('/')
}

export async function checkoutAction(items: { id: string, unit: string, qty: number }[]) {
  // Mock checkout logic since we don't have full auth setup yet
  // In a real scenario, this would insert an order into the Supabase 'orders' table
  // and loop over items to insert into 'order_items' table.
  const supabase = await createClientServer()
  
  // Here we would decrement stock for the checked out items
  for (const item of items) {
    const { data: p } = await supabase.from('products').select('stock, sold_count').eq('id', item.id).single()
    if (p && p.stock >= item.qty) {
      await supabase.from('products').update({ stock: p.stock - item.qty, sold_count: (p.sold_count || 0) + item.qty }).eq('id', item.id)
    }
  }

  return { success: true, message: 'Order placed successfully!' }
}
