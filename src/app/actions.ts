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

export async function addToCart(productId: string, unit: string, price: number, qty: number) {
  // Mock cart action for now if no auth implemented correctly
  return { success: true }
}
