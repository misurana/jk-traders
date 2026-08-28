'use client'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export function AddToCartButton({ p, soldOut }: { p: any, soldOut: boolean }) {
  const { addToCart } = useCart()

  return (
    <button 
      disabled={soldOut}
      onClick={() => addToCart(p, p.unit, p.price_inr, 1)}
      style={{ 
        background: soldOut ? '#ccc' : '#E29A2C', 
        color: 'white', 
        border: 'none', 
        padding: '16px 32px', 
        borderRadius: '8px', 
        fontSize: '18px', 
        fontWeight: 600, 
        cursor: soldOut ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}
    >
      <ShoppingCart size={20} />
      {soldOut ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
