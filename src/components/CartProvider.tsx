'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type CartItem = {
  key: string
  product: any
  unit: string
  price: number
  qty: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: any, unit: string, price: number, qty: number) => void
  removeFromCart: (key: string) => void
  updateQty: (key: string, delta: number) => void
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)

  const addToCart = (product: any, unit: string, price: number, qty: number) => {
    const key = `${product.id}::${unit}`
    setCart(prev => {
      const existing = prev.find(item => item.key === key)
      if (existing) {
        return prev.map(item => item.key === key ? { ...item, qty: item.qty + qty } : item)
      }
      return [...prev, { key, product, unit, price, qty }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (key: string) => {
    setCart(prev => prev.filter(item => item.key !== key))
  }

  const updateQty = (key: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.key === key) {
        return { ...item, qty: Math.max(1, item.qty + delta) }
      }
      return item
    }))
  }

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const count = cart.reduce((acc, item) => acc + item.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, isCartOpen, setCartOpen, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
