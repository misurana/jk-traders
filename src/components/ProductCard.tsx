'use client'
import React from 'react'
import { ShoppingCart, Star } from 'lucide-react'

export function ProductCard({ p }: { p: any }) {
  const soldOut = p.stock <= 0

  return (
    <article className="pcard">
      <div className="pcard-media" style={{ cursor: 'pointer', background: `linear-gradient(150deg, ${p.grad_from}, ${p.grad_to})` }}>
        {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div className="pcard-body">
        <h3 className="pcard-name" style={{ cursor: 'pointer' }}>{p.name}</h3>
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
          <button className="add-btn" disabled={soldOut} style={{ padding: '8px', background: '#235240', color: 'white', borderRadius: '50%', border: 'none', cursor: soldOut ? 'not-allowed' : 'pointer' }}>
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
