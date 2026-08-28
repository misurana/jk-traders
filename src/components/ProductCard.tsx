'use client'
import React from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from './CartProvider'
import Link from 'next/link'

export function ProductCard({ p }: { p: any }) {
  const soldOut = p.stock <= 0
  const { addToCart } = useCart()

  return (
    <article className="pcard">
      <Link href={`/product/${p.id}`} className="pcard-media" style={{ display: 'block', cursor: 'pointer', background: `linear-gradient(150deg, ${p.grad_from}, ${p.grad_to})` }}>
        {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </Link>
      <div className="pcard-body">
        <Link href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="pcard-name" style={{ cursor: 'pointer', color: '#235240' }}>{p.name}</h3>
        </Link>
        <div className="row center gap-6">
          <span className="stars" style={{ display: 'flex' }}>
             {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#E29A2C" color="#E29A2C" />)}
          </span>
          <span className="data-id" style={{ fontSize: '12px' }}>5.0 · 10 reviews</span>
        </div>
        <div className="pcard-row" style={{ marginTop: '10px' }}>
          <span className="price">
            <span className="now">₹{p.price_inr}</span>
            {p.mrp_inr > p.price_inr && <span className="was" style={{ textDecoration: 'line-through', color: '#999', marginLeft: '6px' }}>₹{p.mrp_inr}</span>}
            <span className="unit" style={{ color: '#8A9A5B', marginLeft: '6px' }}>/ {p.unit}</span>
          </span>
          <button className="add-btn" disabled={soldOut} 
                  onClick={() => addToCart(p, p.unit, p.price_inr, 1)}
                  style={{ padding: '8px', background: '#235240', color: 'white', borderRadius: '50%', border: 'none', cursor: soldOut ? 'not-allowed' : 'pointer' }}>
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
