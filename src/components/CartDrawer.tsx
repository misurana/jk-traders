'use client'
import React from 'react'
import { useCart } from './CartProvider'
import { X, Trash2, Plus, Minus, Check, ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const { cart, removeFromCart, updateQty, isCartOpen, setCartOpen, total, count } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="overlay right" onClick={() => setCartOpen(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Your cart">
        <div className="drawer-head" style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', margin: 0, color: '#235240' }}>Your cart</h3>
            <span className="data-id" style={{ color: '#8A9A5B', fontSize: '14px' }}>{count} item{count === 1 ? '' : 's'}</span>
          </div>
          <button className="btn-icon" aria-label="Close cart" onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#235240" />
          </button>
        </div>
        
        <div className="drawer-body" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {cart.length > 0 ? (
            cart.map((it) => (
              <div key={it.key} className="cart-line" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div className="cart-thumb" style={{ width: '80px', height: '80px', borderRadius: '12px', background: `linear-gradient(150deg, ${it.product.grad_from}, ${it.product.grad_to})` }}>
                  {it.product.image_url && <img src={it.product.image_url} alt={it.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />}
                </div>
                <div className="grow" style={{ flex: 1 }}>
                  <div className="row spread" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#235240' }}>{it.product.name}</span>
                    <button className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E29A2C' }} aria-label="Remove" onClick={() => removeFromCart(it.key)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="data-id" style={{ color: '#8A9A5B', fontSize: '13px', marginTop: '4px' }}>{it.unit}</div>
                  <div className="row spread center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    
                    <div className="qty" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F9F8F6', padding: '4px 8px', borderRadius: '20px' }}>
                      <button onClick={() => updateQty(it.key, -1)} aria-label="Decrease" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Minus size={14} /></button>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{it.qty}</span>
                      <button onClick={() => updateQty(it.key, 1)} aria-label="Increase" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}><Plus size={14} /></button>
                    </div>

                    <span className="mono" style={{ fontWeight: 700, color: '#235240' }}>₹{it.price * it.qty}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 10px' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', background: '#F9F8F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <ShoppingBag size={30} color="#8A9A5B" opacity={0.5} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#235240' }}>Your cart is empty</h3>
              <p style={{ color: '#8A9A5B', marginTop: '6px' }}>Add something delicious to get started.</p>
              <button className="btn btn-primary" style={{ marginTop: '20px', background: '#235240', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCartOpen(false)}>
                Browse the pantry
              </button>
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="drawer-foot" style={{ padding: '20px', borderTop: '1px solid #eee', background: '#fff' }}>
            <div className="row spread" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="data-id" style={{ color: '#8A9A5B' }}>Subtotal</span>
              <span className="mono" style={{ fontWeight: 700, color: '#235240' }}>₹{total}</span>
            </div>
            <div className="row spread" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="data-id" style={{ color: '#8A9A5B' }}>Shipping</span>
              <span className="badge badge-pos" style={{ background: '#E4EBD3', color: '#2E7D5B', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                {total >= 999 ? 'Free' : '₹59'}
              </span>
            </div>
            <button 
              className="btn btn-saffron btn-lg btn-block" 
              style={{ width: '100%', background: '#E29A2C', color: '#fff', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}
              onClick={async () => {
                const { checkoutAction } = await import('@/app/actions')
                const res = await checkoutAction(cart.map(c => ({ id: c.product.id, unit: c.unit, qty: c.qty })))
                if (res.success) {
                  alert(res.message)
                  cart.forEach(c => removeFromCart(c.key))
                  setCartOpen(false)
                }
              }}
            >
              Checkout · ₹{total + (total >= 999 ? 0 : 59)}
            </button>
            <p style={{ textAlign: 'center', marginTop: '12px', color: '#8A9A5B', fontSize: '12px' }}>Secure checkout</p>
          </div>
        )}
      </aside>
    </div>
  )
}
