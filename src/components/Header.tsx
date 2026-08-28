'use client'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'

export function Header() {
  const { setCartOpen, count } = useCart()

  return (
    <header className="row spread" style={{ padding: '20px 40px', background: '#fff', borderBottom: '1px solid #EAE6DF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="brand row" style={{ gap: '10px', alignItems: 'center', display: 'flex' }}>
        <div style={{ width: 40, height: 40, background: '#E29A2C', borderRadius: '50%' }}></div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: '1.2rem', color: '#235240' }}>Nuvana</span>
          <span style={{ fontSize: '0.8rem', color: '#8A9A5B' }}>Premium Dry Fruits & Nuts</span>
        </div>
      </div>
      
      <nav className="row" style={{ gap: '20px', display: 'flex', alignItems: 'center' }}>
        <a href="#" style={{ color: '#235240', fontWeight: 500, textDecoration: 'none' }}>Shop</a>
        <a href="#" style={{ color: '#8A9A5B', textDecoration: 'none' }}>About</a>
        <a href="#" style={{ color: '#8A9A5B', textDecoration: 'none' }}>Contact</a>
        
        <button 
          onClick={() => setCartOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', color: '#235240' }}
        >
          <ShoppingCart size={24} />
          {count > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#E29A2C', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}
