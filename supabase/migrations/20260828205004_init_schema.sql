-- 2.1 Extensions
create extension if not exists "pgcrypto";

-- 2.2 Enums
do $$ begin
  create type user_role       as enum ('customer','staff','admin');
  create type customer_tier   as enum ('Silver','Gold','Platinum');
  create type order_status    as enum ('pending','processing','shipped','delivered','cancelled');
  create type payment_method  as enum ('UPI','COD','Card','Net Banking');
  create type order_channel   as enum ('Web','App');
  create type review_status   as enum ('pending','published','hidden');
  create type product_flag    as enum ('best','sale','new','low','out');
exception when duplicate_object then null; end $$;

-- 2.3 profiles
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null default '',
  email        text unique,
  phone        text,
  role         user_role not null default 'customer',
  city         text,
  tier         customer_tier not null default 'Silver',
  member_since date not null default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2.4 categories
create table if not exists categories (
  id           text primary key,
  name         text not null,
  glyph        text not null,
  tint         text not null,
  display_count int not null default 0,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- 2.5 products
create table if not exists products (
  id           text primary key,
  category_id  text not null references categories(id),
  name         text not null,
  glyph        text not null,
  grad_from    text not null,
  grad_to      text not null,
  image_url    text default '',
  price_inr    int  not null check (price_inr >= 0),
  mrp_inr      int  not null default 0,
  unit         text not null,
  origin       text,
  blurb        text,
  stock        int  not null default 0 check (stock >= 0),
  sold_count   int  not null default 0,
  flags        product_flag[] not null default '{}',
  rating_avg   numeric(2,1) not null default 0,
  reviews_count int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active   on products(is_active);

-- 2.6 addresses
create table if not exists addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  line1      text not null,
  line2      text,
  city       text not null,
  state      text,
  pincode    text not null,
  phone      text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_addresses_user on addresses(user_id);

-- 2.7 carts / cart_items
create table if not exists carts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete cascade,
  session_token text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create table if not exists cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references carts(id) on delete cascade,
  product_id text not null references products(id),
  unit       text not null,
  qty        int  not null check (qty > 0),
  unique (cart_id, product_id, unit)
);

-- 2.8 orders
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  order_no       text unique not null,
  user_id        uuid references profiles(id) on delete set null,
  customer_name  text not null,
  city           text,
  status         order_status   not null default 'pending',
  payment_method payment_method not null default 'UPI',
  channel        order_channel  not null default 'Web',
  items_count    int  not null default 0,
  subtotal_inr   int  not null default 0,
  shipping_inr   int  not null default 0,
  total_inr      int  not null default 0,
  placed_at      timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_orders_user   on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_placed on orders(placed_at);

-- 2.9 order_items
create table if not exists order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  product_id     text not null references products(id),
  product_name   text not null,
  unit           text not null,
  unit_price_inr int  not null,
  qty            int  not null check (qty > 0),
  line_total_inr int  not null
);
create index if not exists idx_order_items_order   on order_items(order_id);
create index if not exists idx_order_items_product on order_items(product_id);

-- 2.10 reviews
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references products(id) on delete cascade,
  user_id     uuid references profiles(id) on delete set null,
  author_name text not null,
  rating      int  not null check (rating between 1 and 5),
  body        text not null,
  status      review_status not null default 'pending',
  created_at  timestamptz not null default now()
);
create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_reviews_status  on reviews(status);

-- 2.11 testimonials & store_settings
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  author      text not null,
  is_featured boolean not null default true,
  sort_order  int not null default 0
);

create table if not exists store_settings (
  id       int primary key default 1 check (id = 1),
  name     text not null,
  tagline  text not null,
  est      text,
  phone    text,
  free_shipping_threshold_inr int not null default 999,
  shipping_flat_inr           int not null default 49,
  updated_at timestamptz not null default now()
);

-- 2.12 Triggers & functions
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ begin
  create trigger trg_profiles_updated before update on profiles
    for each row execute function set_updated_at();
  create trigger trg_products_updated before update on products
    for each row execute function set_updated_at();
  create trigger trg_orders_updated   before update on orders
    for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

create or replace function refresh_product_rating() returns trigger
language plpgsql as $$
declare pid text := coalesce(new.product_id, old.product_id);
begin
  update products p set
    rating_avg = coalesce((select round(avg(rating)::numeric,1)
                           from reviews r
                           where r.product_id = pid and r.status='published'),0),
    reviews_count = (select count(*) from reviews r
                     where r.product_id = pid and r.status='published')
  where p.id = pid;
  return null;
end $$;

do $$ begin
  create trigger trg_reviews_rollup
    after insert or update or delete on reviews
    for each row execute function refresh_product_rating();
exception when duplicate_object then null; end $$;

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end $$;

do $$ begin
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();
exception when duplicate_object then null; end $$;

-- 2.13 place_order()
create sequence if not exists order_no_seq start with 24818;

create or replace function place_order(
  p_user_id  uuid,
  p_name     text,
  p_city     text,
  p_payment  payment_method,
  p_channel  order_channel,
  p_items    jsonb
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid; v_no text; v_sub int := 0; v_ship int := 0; v_cnt int := 0;
  it jsonb; v_prod products%rowtype; v_line int;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
     raise exception 'Cart is empty';
  end if;
  v_no := 'NX-' || to_char(nextval('order_no_seq'), 'FM00000');
  insert into orders(order_no,user_id,customer_name,city,status,payment_method,channel)
    values (v_no,p_user_id,p_name,p_city,'processing',p_payment,p_channel)
    returning id into v_order_id;

  for it in select * from jsonb_array_elements(p_items) loop
    select * into v_prod from products
      where id = (it->>'product_id') for update;
    if not found then raise exception 'Unknown product %', it->>'product_id'; end if;
    if v_prod.stock < (it->>'qty')::int then
      raise exception 'Insufficient stock for %', v_prod.name; end if;

    v_line := v_prod.price_inr * (it->>'qty')::int;
    v_sub  := v_sub + v_line;
    v_cnt  := v_cnt + (it->>'qty')::int;

    insert into order_items(order_id,product_id,product_name,unit,unit_price_inr,qty,line_total_inr)
      values (v_order_id, v_prod.id, v_prod.name, coalesce(it->>'unit',v_prod.unit),
              v_prod.price_inr, (it->>'qty')::int, v_line);

    update products set stock = stock - (it->>'qty')::int,
                        sold_count = sold_count + (it->>'qty')::int
      where id = v_prod.id;
  end loop;

  v_ship := case when v_sub >= (select free_shipping_threshold_inr from store_settings limit 1) then 0 else (select shipping_flat_inr from store_settings limit 1) end;
  update orders set items_count=v_cnt, subtotal_inr=v_sub,
                    shipping_inr=v_ship, total_inr=v_sub+v_ship
    where id = v_order_id;
  return v_no;
end $$;

-- 2.14 Analytics VIEWS
create or replace view v_kpis as
select
  coalesce(sum(total_inr),0)                              as revenue_inr,
  count(*)                                                as orders_count,
  coalesce(round(avg(total_inr)),0)                       as aov_inr
from orders where status <> 'cancelled';

create or replace view v_new_customers as
select count(*) as new_customers
from profiles where role='customer'
  and created_at >= date_trunc('month', now());

create or replace view v_orders_by_month as
select to_char(date_trunc('month', placed_at),'Mon') as m,
       date_trunc('month', placed_at)                as month_start,
       count(*)                                      as v
from orders where status <> 'cancelled'
group by 1,2 order by 2;

create or replace view v_category_split as
select c.name,
       round(100.0 * sum(oi.line_total_inr) /
             nullif(sum(sum(oi.line_total_inr)) over (),0), 0) as value
from order_items oi
join products p   on p.id = oi.product_id
join categories c on c.id = p.category_id
group by c.name order by value desc;

create or replace view v_top_products as
select p.id, p.name, sum(oi.qty) as units, sum(oi.line_total_inr) as revenue
from order_items oi join products p on p.id = oi.product_id
group by p.id, p.name order by units desc limit 5;

-- 3 ROW LEVEL SECURITY
create or replace function is_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select exists(select 1 from profiles where id = auth.uid()
                and role in ('admin','staff'));
$$;

alter table profiles enable row level security;
create policy "profiles self read"   on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid());
create policy "profiles admin all"   on profiles for all    using (is_admin()) with check (is_admin());

alter table categories enable row level security;
create policy "cat public read" on categories for select using (true);
create policy "cat admin write" on categories for all using (is_admin()) with check (is_admin());

alter table products enable row level security;
create policy "prod public read" on products for select using (is_active or is_admin());
create policy "prod admin write" on products for all using (is_admin()) with check (is_admin());

alter table addresses enable row level security;
create policy "addr owner" on addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table carts enable row level security;
create policy "cart owner" on carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
alter table cart_items enable row level security;
create policy "cart_items owner" on cart_items for all
  using (exists(select 1 from carts c where c.id=cart_id and c.user_id=auth.uid()))
  with check (exists(select 1 from carts c where c.id=cart_id and c.user_id=auth.uid()));

alter table orders enable row level security;
create policy "orders own read"  on orders for select using (user_id = auth.uid() or is_admin());
create policy "orders admin write" on orders for update using (is_admin()) with check (is_admin());
alter table order_items enable row level security;
create policy "order_items read" on order_items for select
  using (exists(select 1 from orders o where o.id=order_id
               and (o.user_id=auth.uid() or is_admin())));

alter table reviews enable row level security;
create policy "rev public read" on reviews for select using (status='published' or is_admin());
create policy "rev insert" on reviews for insert with check (auth.uid() is not null);
create policy "rev admin update" on reviews for update using (is_admin()) with check (is_admin());

alter table testimonials enable row level security;
create policy "tst read" on testimonials for select using (true);
create policy "tst admin" on testimonials for all using (is_admin()) with check (is_admin());
alter table store_settings enable row level security;
create policy "set read" on store_settings for select using (true);
create policy "set admin" on store_settings for all using (is_admin()) with check (is_admin());

grant execute on function place_order(uuid,text,text,payment_method,order_channel,jsonb) to anon, authenticated;
