import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { AddToCartButton } from './AddToCartButton'
import { Star, MapPin, Truck, Shield } from 'lucide-react'

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
  
  if (!p) {
    return (
      <main className="col" style={{ minHeight: '100vh', background: '#F9F8F6' }}>
        <Header />
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <h2>Product not found</h2>
        </div>
      </main>
    )
  }

  const soldOut = p.stock <= 0

  return (
    <main className="col" style={{ minHeight: '100vh', background: '#F9F8F6' }}>
      <Header />
      
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', height: '400px', borderRadius: '16px', background: `linear-gradient(150deg, ${p.grad_from}, ${p.grad_to})`, overflow: 'hidden' }}>
          {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ color: '#E29A2C', fontWeight: 600, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>{p.category_id}</span>
            <h1 style={{ fontSize: '32px', color: '#235240', margin: '8px 0' }}>{p.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#E29A2C" color="#E29A2C" />)}
              </div>
              <span style={{ color: '#8A9A5B', fontSize: '14px' }}>5.0 · 10 reviews</span>
            </div>
          </div>
          
          <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>{p.blurb}</p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ background: '#eee', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} /> {p.origin}
            </span>
            <span style={{ background: soldOut ? '#FEE2E2' : '#E4EBD3', color: soldOut ? '#991B1B' : '#2E7D5B', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
              {soldOut ? 'Out of stock' : 'In stock'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#235240' }}>₹{p.price_inr}</span>
            <span style={{ color: '#8A9A5B' }}>/ {p.unit}</span>
          </div>

          <AddToCartButton p={p} soldOut={soldOut} />
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', color: '#8A9A5B', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={16} /> Ships in 24h</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> Freshness sealed</span>
          </div>
        </div>
      </div>
    </main>
  )
}
