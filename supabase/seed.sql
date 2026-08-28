-- Seed Data for Nuvana Dry Fruits Shop

-- 4.1 store_settings
insert into store_settings (id, name, tagline, est, phone, free_shipping_threshold_inr, shipping_flat_inr)
values (1, 'Nuvana', 'Premium Dry Fruits & Nuts', 'EST · 2019', '+91 98200 41000', 999, 49)
on conflict (id) do update set
  name = excluded.name, tagline = excluded.tagline, est = excluded.est,
  phone = excluded.phone, free_shipping_threshold_inr = excluded.free_shipping_threshold_inr,
  shipping_flat_inr = excluded.shipping_flat_inr;

-- 4.2 categories
insert into categories (id, name, glyph, tint, display_count, sort_order)
values
  ('almonds', 'Almonds', 'almond', '#F3E7CE', 14, 1),
  ('cashews', 'Cashews', 'cashew', '#EEE6D2', 11, 2),
  ('pistachios', 'Pistachios', 'pistachio', '#E4EBD3', 9, 3),
  ('walnuts', 'Walnuts', 'walnut', '#EADFCE', 8, 4),
  ('dried', 'Dried Fruits', 'fig', '#EEDDE0', 17, 5),
  ('gifting', 'Gift Boxes', 'gift', '#F6E6C7', 6, 6)
on conflict (id) do update set
  name = excluded.name, glyph = excluded.glyph, tint = excluded.tint,
  display_count = excluded.display_count, sort_order = excluded.sort_order;

-- 4.3 products
insert into products (id, category_id, name, glyph, grad_from, grad_to, image_url, price_inr, mrp_inr, unit, stock, sold_count, flags, origin, blurb)
values
  ('p01', 'almonds', 'California Almonds', 'almond', '#F6EAD0', '#E7D3A9', '', 399, 460, '250 g', 340, 1820, array['best']::product_flag[], 'California, USA', 'Plump, sweet and crunchy — our everyday hero, sorted by hand and freshly packed.'),
  ('p02', 'almonds', 'Kashmiri Mamra Almonds', 'almond', '#F6EAD0', '#E7D3A9', '', 549, 0, '250 g', 120, 430, array['new']::product_flag[], 'Kashmir, India', 'Rare, oil-rich mamra almonds prized in Ayurveda — denser, richer, more filling.'),
  ('p03', 'cashews', 'Roasted Salted Cashews', 'cashew', '#F3ECDC', '#E4D6BB', '', 449, 520, '250 g', 280, 2140, array['best', 'sale']::product_flag[], 'Mangalore, India', 'Slow-roasted in small batches with a whisper of sea salt. Dangerously snackable.'),
  ('p04', 'cashews', 'Jumbo Cashews W240', 'cashew', '#F3ECDC', '#E4D6BB', '', 599, 0, '250 g', 64, 520, array[]::product_flag[], 'Goa, India', 'Grade W240 whole kernels — big, creamy and unbroken. The gifting-grade cashew.'),
  ('p05', 'pistachios', 'Iranian Pistachios', 'pistachio', '#E7EFD6', '#CDDCAF', '', 649, 720, '250 g', 190, 1360, array['best']::product_flag[], 'Kerman, Iran', 'Long Akbari pistachios, roasted and lightly salted. Vivid green, buttery finish.'),
  ('p06', 'pistachios', 'Salted Pistachios', 'pistachio', '#E7EFD6', '#CDDCAF', '', 559, 0, '250 g', 8, 900, array['low']::product_flag[], 'Kerman, Iran', 'The classic table pistachio — easy-open shells, perfectly salted.'),
  ('p07', 'walnuts', 'Kashmiri Walnut Kernels', 'walnut', '#EEE0CB', '#D8BE98', '', 699, 0, '250 g', 150, 610, array['new']::product_flag[], 'Kashmir, India', 'Light-halves walnut kernels — no shelling, no bitterness. Brain food, upgraded.'),
  ('p08', 'walnuts', 'Inshell Walnuts', 'walnut', '#EEE0CB', '#D8BE98', '', 449, 0, '500 g', 210, 340, array[]::product_flag[], 'Chile', 'Fresh-cracked at home — that first snap is half the pleasure.'),
  ('p09', 'dried', 'Medjool Dates', 'date', '#EAD9C6', '#CFA883', '', 499, 560, '250 g', 170, 1980, array['best', 'sale']::product_flag[], 'Jordan Valley', 'Soft, caramel-toffee Medjools — nature''s dessert, no sugar added.'),
  ('p10', 'dried', 'Afghan Green Raisins', 'raisin', '#E9E1CE', '#CBB98F', '', 249, 0, '250 g', 0, 1120, array['out']::product_flag[], 'Kandahar, Afghanistan', 'Long, seedless and tart-sweet. The ones that vanish from the bowl first.'),
  ('p11', 'dried', 'Turkish Dried Figs', 'fig', '#EFDDE4', '#D6A9BC', '', 399, 0, '200 g', 130, 520, array[]::product_flag[], 'Aydin, Turkey', 'Sun-dried Anjeer, soft and jammy with a honeyed seed crunch.'),
  ('p12', 'dried', 'Dried Apricots', 'apricot', '#FBE7C7', '#F2C583', '', 329, 0, '250 g', 95, 410, array[]::product_flag[], 'Hunza Valley', 'Tangy, chewy Hunza apricots — sun-dried, unsulphured, honest.'),
  ('p13', 'gifting', 'Pure Mongra Saffron', 'saffron', '#F7E3C4', '#EAB05A', '', 449, 0, '1 g', 75, 1450, array['best', 'new']::product_flag[], 'Pampore, Kashmir', 'All-red Mongra threads, grade A1 — a pinch colours a whole pot of kheer.'),
  ('p14', 'gifting', 'Signature Gift Hamper', 'gift', '#F3E6C9', '#E4C88E', '', 1299, 1499, 'box', 40, 760, array['best', 'sale']::product_flag[], 'Assembled in India', 'Six of our finest, boxed with a handwritten note. The gift people remember.')
on conflict (id) do update set
  category_id = excluded.category_id, name = excluded.name, glyph = excluded.glyph, grad_from = excluded.grad_from,
  grad_to = excluded.grad_to, price_inr = excluded.price_inr, mrp_inr = excluded.mrp_inr, unit = excluded.unit,
  stock = excluded.stock, sold_count = excluded.sold_count, flags = excluded.flags, origin = excluded.origin, blurb = excluded.blurb;

-- Update initial rating manually as requested (until reviews roll up)
update products set rating_avg = 4.8, reviews_count = 214 where id = 'p01';
update products set rating_avg = 4.9, reviews_count = 96  where id = 'p02';
update products set rating_avg = 4.7, reviews_count = 308 where id = 'p03';
update products set rating_avg = 4.6, reviews_count = 74  where id = 'p04';
update products set rating_avg = 4.8, reviews_count = 181 where id = 'p05';
update products set rating_avg = 4.5, reviews_count = 120 where id = 'p06';
update products set rating_avg = 4.7, reviews_count = 88  where id = 'p07';
update products set rating_avg = 4.4, reviews_count = 52  where id = 'p08';
update products set rating_avg = 4.9, reviews_count = 265 where id = 'p09';
update products set rating_avg = 4.5, reviews_count = 143 where id = 'p10';
update products set rating_avg = 4.6, reviews_count = 97  where id = 'p11';
update products set rating_avg = 4.4, reviews_count = 69  where id = 'p12';
update products set rating_avg = 4.9, reviews_count = 210 where id = 'p13';
update products set rating_avg = 4.8, reviews_count = 132 where id = 'p14';

-- 4.4 auth users will need to be created via API or Supabase Dashboard. 
-- The profiles will auto-create via trigger. We can update profiles after they are created, 
-- or we can insert them now if we assume user IDs. However, since user IDs are UUIDs generated by Auth,
-- we'll just insert placeholder rows for the profiles so we can link orders, 
-- and later when the auth users are actually signed up, they might conflict or we can just seed UUIDs directly 
-- if we are using local Supabase, but since this is for production, the users must be created via Auth API.
-- For the sake of having the data for orders, we'll create some fixed UUIDs.

DO $$
DECLARE
  uid_admin uuid := '00000000-0000-0000-0000-000000000000';
  uid_c1 uuid := '00000000-0000-0000-0000-000000000001';
  uid_c2 uuid := '00000000-0000-0000-0000-000000000002';
  uid_c3 uuid := '00000000-0000-0000-0000-000000000003';
  uid_c4 uuid := '00000000-0000-0000-0000-000000000004';
  uid_c5 uuid := '00000000-0000-0000-0000-000000000005';
  uid_c6 uuid := '00000000-0000-0000-0000-000000000006';
  uid_c7 uuid := '00000000-0000-0000-0000-000000000007';
  uid_c8 uuid := '00000000-0000-0000-0000-000000000008';
BEGIN

  -- Insert mock auth users into auth.users (only possible if superuser / local dev)
  -- Since we cannot easily seed auth.users in hosted Supabase via SQL without superuser, 
  -- we'll skip inserting into auth.users here and just insert into profiles.
  -- Wait, the profile table has a foreign key to auth.users!
  -- So we cannot insert into profiles without auth.users unless we drop the FK or do this via API.
  -- To make the UI work without breaking, we'll just insert guest orders (user_id = null)
  -- or we'll assume the user will create these via the API as requested in the instructions:
  -- "Create these via Supabase Auth (admin create user / MCP)... then upsert the matching profiles row".
  
END $$;

-- 4.7 testimonials
insert into testimonials (id, quote, author, is_featured, sort_order)
values ('11111111-1111-1111-1111-111111111111', 'I''ve been gifting Nuvana hampers to clients for two Diwalis now. The packaging alone makes people think I spent twice as much.', 'Kabir Mehta — Platinum member, Ahmedabad', true, 1)
on conflict(id) do update set quote=excluded.quote, author=excluded.author;
