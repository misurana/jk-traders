import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'

export const revalidate = 0; // Dynamic rendering

export default async function ShopPage() {
  const { data: products } = await supabase.from('products').select('*').order('name', { ascending: true });

  return (
    <main className="col" style={{ minHeight: '100vh', background: '#F9F8F6' }}>
      <Header />
      
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#235240', marginBottom: '20px' }}>Our Collection</h1>
        <p style={{ fontSize: '1.2rem', color: '#8A9A5B', maxWidth: 600, margin: '0 auto' }}>
          Explore all our premium nuts, seeds, and dried fruits.
        </p>
      </section>

      <section style={{ padding: '40px' }}>
        <div className="row wrap" style={{ gap: '20px', justifyContent: 'center' }}>
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
