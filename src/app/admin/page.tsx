import { supabase } from '@/lib/supabase'

export const revalidate = 0; // Dynamic rendering

export default async function AdminDashboard() {
  const { data: products } = await supabase.from('products').select('*').order('name', { ascending: true });
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: carts } = await supabase.from('carts').select('*, cart_items(*)');

  return (
    <main style={{ minHeight: '100vh', background: '#F4F7F6', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1A362D', margin: 0 }}>Nuvana Admin</h1>
        <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          Admin Logged In
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#8A9A5B', fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1A362D', margin: 0 }}>{products?.length || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#8A9A5B', fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Active Carts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1A362D', margin: 0 }}>{carts?.length || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#8A9A5B', fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Revenue (Mock)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1A362D', margin: 0 }}>₹1,24,500</p>
        </div>
      </div>

      <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1A362D', marginBottom: '20px' }}>Inventory</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px', color: '#8A9A5B', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '12px', color: '#8A9A5B', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '12px', color: '#8A9A5B', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '12px', color: '#8A9A5B', fontWeight: 600 }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px', color: '#555' }}>{p.id}</td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#1A362D' }}>{p.name}</td>
                <td style={{ padding: '12px', color: '#555' }}>₹{p.price_inr}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: p.stock > 0 ? '#E4EBD3' : '#FEE2E2', color: p.stock > 0 ? '#2E7D5B' : '#991B1B', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                    {p.stock} in stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
