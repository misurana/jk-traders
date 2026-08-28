import { supabase } from '@/lib/supabase'

import { ProductCard } from '@/components/ProductCard';

export const revalidate = 0; // Dynamic rendering

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });

  return (
    <main className="col" style={{ minHeight: '100vh', background: '#F9F8F6' }}>
      <header className="row spread" style={{ padding: '20px 40px', background: '#fff', borderBottom: '1px solid #EAE6DF' }}>
        <div className="brand row" style={{ gap: '10px', alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, background: '#E29A2C', borderRadius: '50%' }}></div>
          <div className="col">
            <span style={{ fontWeight: 600, fontSize: '1.2rem', color: '#235240' }}>Nuvana</span>
            <span style={{ fontSize: '0.8rem', color: '#8A9A5B' }}>Premium Dry Fruits & Nuts</span>
          </div>
        </div>
        <nav className="row" style={{ gap: '20px' }}>
          <a href="#" style={{ color: '#235240', fontWeight: 500 }}>Shop</a>
          <a href="#" style={{ color: '#8A9A5B' }}>About</a>
          <a href="#" style={{ color: '#8A9A5B' }}>Contact</a>
        </nav>
      </header>

      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#235240', marginBottom: '20px' }}>Nature's finest, sorted by hand.</h1>
        <p style={{ fontSize: '1.2rem', color: '#8A9A5B', maxWidth: 600, margin: '0 auto' }}>
          Freshly packed dry fruits and nuts, sourced directly from the best farms around the world.
        </p>
      </section>

      <section style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#235240', marginBottom: '30px' }}>Categories</h2>
        <div className="row wrap" style={{ gap: '20px' }}>
          {categories?.map((cat) => (
            <div key={cat.id} className="col center" style={{ padding: '20px', background: cat.tint || '#eee', borderRadius: '12px', minWidth: '150px' }}>
              <span style={{ fontWeight: 600, color: '#235240' }}>{cat.name}</span>
            </div>
          ))}
          {(!categories || categories.length === 0) && (
            <p>No categories found or Supabase not connected.</p>
          )}
        </div>
      </section>

      <section style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#235240', marginBottom: '30px' }}>Featured Products</h2>
        <div className="row wrap" style={{ gap: '20px' }}>
          {products?.map((prod) => (
            <ProductCard key={prod.id} p={prod} />
          ))}
          {(!products || products.length === 0) && (
            <p>No products found or Supabase not connected.</p>
          )}
        </div>
      </section>
    </main>
  );
}
