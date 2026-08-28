/* ============================================================
   storefront.js — customer-facing store on window.Store
   ============================================================ */
(function () {
  "use strict";
  var html = window.html, React = window.React;
  var UI = window.UI, Icons = window.Icons, N = window.NUVANA;
  var useState = React.useState, useEffect = React.useEffect;

  function catName(id) {
    var c = N.categories.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }
  function variants(p) {
    if (p.unit === "box") return [
      { label: "1 box", price: p.price, mrp: p.mrp },
      { label: "Set of 2", price: Math.round(p.price * 1.9), mrp: p.mrp ? Math.round(p.mrp * 1.9) : 0 }
    ];
    if (p.unit === "1 g") return [
      { label: "1 g", price: p.price }, { label: "2 g", price: Math.round(p.price * 1.95) }, { label: "5 g", price: Math.round(p.price * 4.6) }
    ];
    var grams = parseInt(p.unit, 10) || 250;
    return [
      { label: p.unit, price: p.price, mrp: p.mrp },
      { label: grams * 2 + " g", price: Math.round(p.price * 1.9), mrp: p.mrp ? Math.round(p.mrp * 1.9) : 0 },
      { label: grams * 4 + " g", price: Math.round(p.price * 3.6), mrp: p.mrp ? Math.round(p.mrp * 3.6) : 0 }
    ];
  }

  /* ---------------- Header ---------------- */
  function Header(props) {
    var store = props.store;
    var q = useState("");
    var val = q[0], setVal = q[1];
    function submit(e) { e.preventDefault(); store.search(val); }
    var page = store.route.page;
    return html`<header class="store-header">
      <div class="wrap bar">
        <${UI.Brand} />
        <nav class="store-nav">
          <a href="#/" class=${page === "home" ? "active" : ""}>Home</a>
          <a href="#/shop" onClick=${function () { store.goShop("all"); }} class=${page === "shop" ? "active" : ""}>Shop All</a>
          <a href="#/shop" onClick=${function () { store.goShop("gifting"); }}>Gifting</a>
          <a href="#/shop" onClick=${function () { store.goShop("dried"); }}>Dried Fruits</a>
        </nav>
        <div class="grow"></div>
        <form class="search" style=${{ maxWidth: "260px", width: "100%" }} onSubmit=${submit}>
          ${Icons.search({ size: 18 })}
          <input placeholder="Search almonds, dates…" value=${val} onInput=${function (e) { setVal(e.target.value); }} aria-label="Search products"/>
        </form>
        <button class="btn-icon" aria-label="Account">${Icons.user({ size: 20 })}</button>
        <button class="btn-icon cart-btn" aria-label="Cart" onClick=${store.openCart}>
          ${Icons.cart({ size: 20 })}
          ${store.count > 0 ? html`<span class="cart-count">${store.count}</span>` : null}
        </button>
      </div>
    </header>`;
  }

  /* ---------------- Hero ---------------- */
  function HeroArt() {
    var tiles = [
      { g: "pistachio", grad: ["#E4EBD3", "#CDDCAF"], s: 132, top: "8%", left: "16%" },
      { g: "almond", grad: ["#F6EAD0", "#E7D3A9"], s: 104, top: "44%", left: "2%" },
      { g: "date", grad: ["#EAD9C6", "#CFA883"], s: 96, top: "56%", left: "44%" },
      { g: "saffron", grad: ["#F7E3C4", "#EAB05A"], s: 118, top: "12%", left: "56%" },
      { g: "cashew", grad: ["#F3ECDC", "#E4D6BB"], s: 88, top: "70%", left: "18%" }
    ];
    var M = window.Motifs;
    return html`<div class="hero-art">
      <div class="glow"></div>
      ${M ? html`<span class="hero-mandala" aria-hidden="true">${M.mandala({ color: "#E9C579" })}</span>` : null}
      ${tiles.map(function (t, i) {
        return html`<div key=${i} class="rise" style=${{
          position: "absolute", top: t.top, left: t.left, width: t.s + "px", height: t.s + "px",
          borderRadius: "26px", overflow: "hidden", background: "linear-gradient(150deg," + t.grad[0] + "," + t.grad[1] + ")",
          boxShadow: "0 18px 34px -18px rgba(10,30,20,.55)", border: "1px solid rgba(255,255,255,.5)",
          animationDelay: (i * 0.08) + "s", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px"
        }}>${window.Glyphs[t.g] ? window.Glyphs[t.g]() : null}</div>`;
      })}
    </div>`;
  }

  function Hero(props) {
    var store = props.store;
    return html`<section class="hero"><div class="wrap">
      <div class="hero-panel">
        <div class="hero-copy">
          <span class="eyebrow on-dark">Freshly packed · ${N.brand.est}</span>
          <h1>The good stuff,<br/><em>sorted by hand.</em></h1>
          <p>Small-batch almonds, pistachios, dates and more — sourced from the valleys that grow them best, and sealed within days of arriving.</p>
          <div class="hero-cta">
            <button class="btn btn-saffron btn-lg" onClick=${function () { store.goShop("all"); }}>Shop the collection ${Icons.arrowRight({ size: 18 })}</button>
            <button class="btn btn-ghost btn-lg" style=${{ color: "#EAE0CC", borderColor: "rgba(255,255,255,.28)" }} onClick=${function () { store.goShop("gifting"); }}>Gift boxes</button>
          </div>
          <div class="hero-meta">
            <div class="m"><b>65+</b><span>Sourced SKUs</span></div>
            <div class="m"><b>12k+</b><span>Happy homes</span></div>
            <div class="m"><b>4.8★</b><span>Avg rating</span></div>
          </div>
        </div>
        <${HeroArt} />
      </div>
    </div></section>`;
  }

  /* ---------------- Category strip ---------------- */
  function CategoryStrip(props) {
    var store = props.store;
    return html`<section class="sec" style=${{ paddingTop: "20px" }}><div class="wrap">
      <div class="cat-strip">
        ${N.categories.map(function (c) {
          return html`<div key=${c.id} class="cat-tile" onClick=${function () { store.goShop(c.id); }}
            role="button" tabindex="0" onKeyDown=${function (e) { if (e.key === "Enter") store.goShop(c.id); }}>
            <div class="cat-ico" style=${{ background: c.tint }}>
              <div style=${{ width: "40px", height: "40px" }}>${window.Glyphs[c.glyph] ? window.Glyphs[c.glyph]() : null}</div>
            </div>
            <div class="nm">${c.name}</div>
            <div class="ct">${c.count} items</div>
          </div>`;
        })}
      </div>
    </div></section>`;
  }

  /* ---------------- Product card ---------------- */
  function ProductCard(props) {
    var p = props.p, store = props.store;
    var soldOut = p.stock <= 0;
    return html`<article class="pcard">
      <div class="pcard-media" style=${{ cursor: "pointer" }} onClick=${function () { store.openProduct(p); }}
        role="button" tabindex="0" aria-label=${"View " + p.name} onKeyDown=${function (e) { if (e.key === "Enter") store.openProduct(p); }}>
        <${UI.ProductMedia} product=${p} />
        <${UI.Flags} flags=${p.flags} />
        ${soldOut ? html`<div style=${{ position: "absolute", inset: 0, background: "rgba(251,248,241,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span class="badge badge-neg" style=${{ fontSize: "12px" }}>Sold out</span></div>` : null}
        <button class="pcard-fav" aria-label="Save for later" onClick=${function (e) { e.stopPropagation(); }}>${Icons.heart({ size: 17 })}</button>
      </div>
      <div class="pcard-body">
        <div class="pcard-cat">${catName(p.cat)}</div>
        <h3 class="pcard-name" style=${{ cursor: "pointer" }} onClick=${function () { store.openProduct(p); }}>${p.name}</h3>
        <div class="row center gap-6">
          <${UI.Rating} value=${p.rating} size=${13} />
          <span class="data-id" style=${{ fontSize: "12px" }}>${p.rating} · ${p.reviews} reviews</span>
        </div>
        <div class="pcard-row">
          <${UI.Money} price=${p.price} mrp=${p.mrp} unit=${p.unit} />
          ${soldOut
            ? html`<button class="add-btn" disabled style=${{ opacity: .4, cursor: "not-allowed" }} aria-label="Out of stock">${Icons.plus({ size: 18 })}</button>`
            : html`<button class="add-btn" aria-label=${"Add " + p.name + " to cart"} onClick=${function () { store.add(p, p.unit, p.price, 1); }}>${Icons.plus({ size: 18 })}</button>`}
        </div>
      </div>
    </article>`;
  }

  /* ---------------- Home sections ---------------- */
  function GiftFeature(props) {
    var store = props.store;
    var M = window.Motifs;
    return html`<section class="sec"><div class="wrap">
      <div class="feature festive-band">
        ${M ? html`<div class="band-toran" aria-hidden="true">${M.toran({ count: 11 })}</div>` : null}
        ${M ? html`<span class="festive-band__mandala -right" aria-hidden="true">${M.mandala({ color: "#E9C579" })}</span>` : null}
        ${M ? html`<span class="orn-corner -bl" aria-hidden="true">${M.corner({ color: "#EFC969", accent: "#C6851F", flip: "v" })}</span>` : null}
        <div class="feature-copy">
          <span class="eyebrow">◦ Gifting, done right</span>
          <h2 style=${{ marginTop: "12px" }}>Hampers they'll<br/>actually <span class="text-gold">remember.</span></h2>
          <p>Curated boxes of our finest, wrapped with a handwritten note and sealed for freshness. Corporate Diwali orders welcome — with your logo on the sleeve.</p>
          <div class="feature-badges">
            <span class="badge badge-gold">Free note card</span>
            <span class="badge badge-gold">Bulk pricing</span>
            <span class="badge badge-gold">Pan-India delivery</span>
          </div>
          <div style=${{ marginTop: "22px" }}>
            <button class="btn btn-saffron btn-lg" onClick=${function () { store.goShop("gifting"); }}>Explore gift boxes ${Icons.arrowRight({ size: 18 })}</button>
          </div>
        </div>
        <div class="feature-art">
          ${M ? html`<span class="gift-marigold" aria-hidden="true">${M.marigold()}</span>` : null}
          <div class="gift-box">${window.Glyphs.gift()}</div>
          ${M ? html`<span class="gift-diya" aria-hidden="true">${M.diya()}</span>` : null}
        </div>
      </div>
    </div></section>`;
  }

  function TrustStrip() {
    var items = [
      { i: "leaf", h: "Sourced at origin", p: "Direct from Kashmir, Iran & beyond — no middle shelves." },
      { i: "shield", h: "Sealed for freshness", p: "Nitrogen-flushed packs, freshly filled every week." },
      { i: "truck", h: "Free shipping ₹999+", p: "Dispatched in 24 hours, delivered pan-India." },
      { i: "sparkle", h: "Hand-sorted quality", p: "Every batch checked by hand before it's packed." }
    ];
    return html`<section class="sec" style=${{ paddingTop: "10px" }}><div class="wrap">
      <div class="trust">
        ${items.map(function (t, i) {
          return html`<div key=${i} class="trust-item">
            <span class="trust-ico">${Icons[t.i]({ size: 22 })}</span>
            <div><h4>${t.h}</h4><p>${t.p}</p></div>
          </div>`;
        })}
      </div>
    </div></section>`;
  }

  function QuoteBand() {
    var t = N.testimonials[0];
    var M = window.Motifs;
    return html`<section class="sec"><div class="wrap">
      <div class="quote-band">
        ${M ? html`<span class="orn-marigold" aria-hidden="true" style=${{ width: "46px", height: "46px" }}>${M.marigold({ color: "#EEB24A", inner: "#F6DDA0", core: "#C6851F" })}</span>` : null}
        <span class="eyebrow on-dark plain" style=${{ justifyContent: "center" }}>What members say</span>
        <p class="q">“${t.q}”</p>
        <div class="who">${t.who}</div>
      </div>
    </div></section>`;
  }

  function Newsletter() {
    var s = useState(false), done = s[0], setDone = s[1];
    return html`<section class="sec"><div class="wrap">
      <div class="news">
        <div>
          <span class="eyebrow">◦ Join the table</span>
          <h2 style=${{ marginTop: "10px" }}>₹100 off your first order</h2>
          <p>Recipes, restocks and the occasional members-only price. No spam — that's a promise.</p>
        </div>
        <form class="news-form" onSubmit=${function (e) { e.preventDefault(); setDone(true); }}>
          ${done
            ? html`<div class="badge badge-pos" style=${{ padding: "14px 18px", fontSize: "14px" }}>${Icons.check({ size: 16 })} You're in — check your inbox.</div>`
            : html`<input class="input" type="email" required placeholder="you@email.com" aria-label="Email"/>
                   <button class="btn btn-saffron" type="submit">Subscribe</button>`}
        </form>
      </div>
    </div></section>`;
  }

  function SectionHead(props) {
    return html`<div class="sec-head">
      <div>
        <span class="eyebrow">◦ ${props.eyebrow}</span>
        <h2 style=${{ marginTop: "12px" }}>${props.title}</h2>
        ${props.sub ? html`<p>${props.sub}</p>` : null}
      </div>
      ${props.link ? html`<a class="sec-link" href="#/shop" onClick=${props.onLink}>${props.link} ${Icons.arrowRight({ size: 16 })}</a>` : null}
    </div>`;
  }

  function Home(props) {
    var store = props.store;
    var best = N.products.filter(function (p) { return p.flags.indexOf("best") >= 0; }).slice(0, 4);
    var fresh = N.products.filter(function (p) { return p.flags.indexOf("new") >= 0; }).slice(0, 4);
    return html`<main>
      <${Hero} store=${store} />
      <${CategoryStrip} store=${store} />
      <section class="sec" style=${{ paddingTop: "10px" }}><div class="wrap">
        <${SectionHead} eyebrow="Loved by thousands" title="This week's bestsellers"
          sub="The jars that empty fastest in our customers' kitchens." link="View all"
          onLink=${function () { store.goShop("all"); }} />
        <div class="pgrid">${best.map(function (p) { return html`<${ProductCard} key=${p.id} p=${p} store=${store} />`; })}</div>
      </div></section>
      <${GiftFeature} store=${store} />
      <section class="sec" style=${{ paddingTop: "10px" }}><div class="wrap">
        <${SectionHead} eyebrow="Just landed" title="New this season"
          sub="Fresh arrivals from this year's harvest." link="View all" onLink=${function () { store.goShop("all"); }} />
        <div class="pgrid">${fresh.map(function (p) { return html`<${ProductCard} key=${p.id} p=${p} store=${store} />`; })}</div>
      </div></section>
      <${TrustStrip} />
      <${QuoteBand} />
      <${Newsletter} />
    </main>`;
  }

  /* ---------------- Shop ---------------- */
  function Shop(props) {
    var store = props.store;
    var sortState = useState("popular"); var sort = sortState[0], setSort = sortState[1];
    var cat = store.shopCategory || "all";
    var list = N.products.filter(function (p) {
      if (cat !== "all" && p.cat !== cat) return false;
      if (store.query) { return p.name.toLowerCase().indexOf(store.query.toLowerCase()) >= 0 || catName(p.cat).toLowerCase().indexOf(store.query.toLowerCase()) >= 0; }
      return true;
    });
    list = list.slice().sort(function (a, b) {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.sold - a.sold;
    });
    var chips = [{ id: "all", name: "All products" }].concat(N.categories.map(function (c) { return { id: c.id, name: c.name }; }));
    return html`<main>
      <section class="shop-head"><div class="wrap">
        <span class="eyebrow">◦ The pantry</span>
        <h1 style=${{ marginTop: "10px" }}>${cat === "all" ? "Shop all" : catName(cat)}</h1>
        <p style=${{ color: "var(--muted)", marginTop: "6px" }}>${list.length} ${list.length === 1 ? "product" : "products"}${store.query ? ' matching "' + store.query + '"' : ""}</p>
        <div class="filters">
          ${chips.map(function (c) {
            return html`<button key=${c.id} class=${UI.cx("chip", cat === c.id ? "active" : "")}
              onClick=${function () { store.setShopCategory(c.id); }}>${c.name}</button>`;
          })}
          <div class="grow"></div>
          <div class="row center gap-8">
            <span class="data-id">Sort</span>
            <select class="select" style=${{ width: "auto", borderRadius: "999px" }} value=${sort} onChange=${function (e) { setSort(e.target.value); }}>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </div>
      </div></section>
      <section style=${{ paddingBottom: "50px" }}><div class="wrap">
        ${store.query || cat !== "all" ? html`<div style=${{ marginBottom: "18px" }}>
          <button class="btn btn-ghost btn-sm" onClick=${function () { store.clearFilters(); }}>${Icons.x({ size: 14 })} Clear filters</button></div>` : null}
        ${list.length
          ? html`<div class="pgrid">${list.map(function (p) { return html`<${ProductCard} key=${p.id} p=${p} store=${store} />`; })}</div>`
          : html`<div class="panel card-pad" style=${{ textAlign: "center", padding: "60px" }}>
              <h3 style=${{ fontSize: "20px" }}>Nothing here yet</h3>
              <p style=${{ color: "var(--muted)", marginTop: "8px" }}>Try another category or clear your search.</p>
            </div>`}
      </div></section>
    </main>`;
  }

  /* ---------------- Product modal ---------------- */
  function ProductModal(props) {
    var p = props.p, store = props.store;
    var vs = variants(p);
    var vi = useState(0); var idx = vi[0], setIdx = vi[1];
    var qs = useState(1); var qty = qs[0], setQty = qs[1];
    var v = vs[idx];
    var soldOut = p.stock <= 0;
    return html`<div class="overlay center" onClick=${props.onClose}>
      <div class="modal" onClick=${function (e) { e.stopPropagation(); }}>
        <div class="pm">
          <div class="pm-media"><${UI.ProductMedia} product=${p} pad="20%" /></div>
          <div class="pm-body">
            <div class="row between center">
              <span class="pcard-cat">${catName(p.cat)}</span>
              <button class="btn-icon" aria-label="Close" onClick=${props.onClose}>${Icons.x({ size: 20 })}</button>
            </div>
            <h2 style=${{ fontSize: "28px" }}>${p.name}</h2>
            <div class="row center gap-8">
              <${UI.Rating} value=${p.rating} size=${16} />
              <span class="data-id">${p.rating} · ${p.reviews} reviews</span>
            </div>
            <p style=${{ color: "var(--muted)", fontSize: "14.5px" }}>${p.blurb}</p>
            <div class="row center gap-8">
              <span class="badge badge-muted">${Icons.mapPin({ size: 13 })} ${p.origin}</span>
              ${!soldOut ? html`<span class="badge badge-pos"><span class="dot"></span> In stock</span>`
                         : html`<span class="badge badge-neg"><span class="dot"></span> Out of stock</span>`}
            </div>
            <div>
              <div class="data-id" style=${{ marginBottom: "8px" }}>Choose size</div>
              <div class="weights">
                ${vs.map(function (opt, i) {
                  return html`<div key=${i} class=${UI.cx("weight-opt", i === idx ? "active" : "")} onClick=${function () { setIdx(i); }}
                    role="button" tabindex="0">${opt.label}<small>${N.fmtINR(opt.price)}</small></div>`;
                })}
              </div>
            </div>
            <div class="row between center" style=${{ marginTop: "6px" }}>
              <${UI.Money} price=${v.price} mrp=${v.mrp} />
              <${UI.Qty} value=${qty} onInc=${function () { setQty(qty + 1); }} onDec=${function () { setQty(Math.max(1, qty - 1)); }} />
            </div>
            ${soldOut
              ? html`<button class="btn btn-lg btn-block" disabled style=${{ background: "var(--ivory-2)", color: "var(--muted)", cursor: "not-allowed" }}>Currently unavailable</button>`
              : html`<button class="btn btn-saffron btn-lg btn-block" onClick=${function () { store.add(p, v.label, v.price, qty); props.onClose(); }}>
                  ${Icons.bag({ size: 18 })} Add ${qty} · ${N.fmtINR(v.price * qty)}</button>`}
            <div class="row gap-16" style=${{ marginTop: "4px" }}>
              <span class="row center gap-6 data-id">${Icons.truck({ size: 15 })} Ships in 24h</span>
              <span class="row center gap-6 data-id">${Icons.shield({ size: 15 })} Freshness sealed</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- Cart drawer ---------------- */
  function CartDrawer(props) {
    var store = props.store;
    var items = store.cart;
    return html`<div class="overlay right" onClick=${props.onClose}>
      <aside class="drawer" onClick=${function (e) { e.stopPropagation(); }} aria-label="Your cart">
        <div class="drawer-head">
          <div><h3 style=${{ fontSize: "18px" }}>Your cart</h3><span class="data-id">${store.count} item${store.count === 1 ? "" : "s"}</span></div>
          <button class="btn-icon" aria-label="Close cart" onClick=${props.onClose}>${Icons.x({ size: 20 })}</button>
        </div>
        <div class="drawer-body">
          ${store.placed
            ? html`<div style=${{ textAlign: "center", padding: "40px 10px" }}>
                <div class="trust-ico" style=${{ margin: "0 auto 16px", width: "56px", height: "56px" }}>${Icons.check({ size: 26 })}</div>
                <h3 style=${{ fontSize: "20px" }}>Order placed</h3>
                <p style=${{ color: "var(--muted)", marginTop: "8px" }}>This is a prototype, so no payment was taken. In the live store, your order would be on its way.</p>
                <button class="btn btn-ghost" style=${{ marginTop: "18px" }} onClick=${function () { store.resetPlaced(); props.onClose(); }}>Keep shopping</button>
              </div>`
            : items.length
              ? items.map(function (it) {
                  return html`<div key=${it.key} class="cart-line">
                    <div class="cart-thumb"><${UI.ProductMedia} product=${it.product} pad="14%" /></div>
                    <div class="grow">
                      <div class="row between"><span style=${{ fontWeight: 650, fontSize: "14px" }}>${it.product.name}</span>
                        <button class="btn-icon" style=${{ width: "28px", height: "28px" }} aria-label="Remove" onClick=${function () { store.remove(it.key); }}>${Icons.trash({ size: 15 })}</button></div>
                      <div class="data-id">${it.unit}</div>
                      <div class="row between center" style=${{ marginTop: "8px" }}>
                        <${UI.Qty} value=${it.qty} onInc=${function () { store.inc(it.key); }} onDec=${function () { store.dec(it.key); }} />
                        <span class="mono" style=${{ fontWeight: 700, color: "var(--pine)" }}>${N.fmtINR(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </div>`;
                })
              : html`<div style=${{ textAlign: "center", padding: "50px 10px" }}>
                  <div style=${{ width: "90px", height: "90px", margin: "0 auto 14px", opacity: .5 }}>${window.Glyphs.almond()}</div>
                  <h3 style=${{ fontSize: "18px" }}>Your cart is empty</h3>
                  <p style=${{ color: "var(--muted)", marginTop: "6px" }}>Add something delicious to get started.</p>
                  <button class="btn btn-primary" style=${{ marginTop: "16px" }} onClick=${function () { store.goShop("all"); props.onClose(); }}>Browse the pantry</button>
                </div>`}
        </div>
        ${!store.placed && items.length ? html`<div class="drawer-foot">
          <div class="row between" style=${{ marginBottom: "6px" }}><span class="data-id">Subtotal</span><span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(store.total)}</span></div>
          <div class="row between" style=${{ marginBottom: "14px" }}><span class="data-id">Shipping</span><span class="badge badge-pos" style=${{ fontSize: "11px" }}>${store.total >= 999 ? "Free" : N.fmtINR(59)}</span></div>
          <button class="btn btn-saffron btn-lg btn-block" onClick=${store.checkout}>Checkout · ${N.fmtINR(store.total + (store.total >= 999 ? 0 : 59))}</button>
          <p style=${{ textAlign: "center", marginTop: "10px" }} class="data-id">Secure checkout · Prototype demo</p>
        </div>` : null}
      </aside>
    </div>`;
  }

  /* ---------------- Footer ---------------- */
  function Footer(props) {
    var store = props.store;
    var col = function (title, links) {
      return html`<div><h5>${title}</h5>${links.map(function (l, i) { return html`<a key=${i} href=${l.href || "#/shop"} onClick=${l.onClick}>${l.t}</a>`; })}</div>`;
    };
    return html`<footer class="store-foot">
      <div class="wrap">
        <div class="cols">
          <div>
            <div class="row center gap-12"><${UI.Mark} size=${40} /><span class="brand-name" style=${{ fontFamily: "var(--font-display)", fontSize: "21px" }}>Nuvana</span></div>
            <p style=${{ marginTop: "14px", color: "#A9B6AB", fontSize: "14px", maxWidth: "34ch" }}>Premium dry fruits and nuts, sourced at origin and sealed for freshness. Made for everyday snacking and once-a-year gifting.</p>
            <div class="row gap-8" style=${{ marginTop: "18px" }}>
              <span class="row center gap-6 data-id" style=${{ color: "#A9B6AB" }}>${Icons.phone({ size: 15 })} ${N.brand.phone}</span>
            </div>
          </div>
          ${col("Shop", [
            { t: "All products", onClick: function () { store.goShop("all"); } },
            { t: "Almonds", onClick: function () { store.goShop("almonds"); } },
            { t: "Pistachios", onClick: function () { store.goShop("pistachios"); } },
            { t: "Gift boxes", onClick: function () { store.goShop("gifting"); } }
          ])}
          ${col("Company", [
            { t: "Our story" }, { t: "Sourcing" }, { t: "Bulk & corporate" }, { t: "Contact" }
          ])}
          ${col("Help", [
            { t: "Shipping & returns" }, { t: "Track order" }, { t: "FAQs" }, { t: "Privacy" }
          ])}
        </div>
        <div class="foot-bottom">
          <span>© 2026 Nuvana Foods · A design prototype</span>
          <a href="#/admin" class="row center gap-6" style=${{ color: "#E9C579" }}>${Icons.grid({ size: 15 })} Open admin panel ${Icons.arrowRight({ size: 14 })}</a>
        </div>
      </div>
    </footer>`;
  }

  /* ---------------- Store app (owns cart + overlays) ---------------- */
  function StoreApp(props) {
    var route = props.route, navigate = props.navigate;
    var cs = useState([]); var cart = cs[0], setCart = cs[1];
    var ms = useState(null); var modalP = ms[0], setModalP = ms[1];
    var os = useState(false); var cartOpen = os[0], setCartOpen = os[1];
    var ps = useState(false); var placed = ps[0], setPlaced = ps[1];
    var scs = useState(route.category || "all"); var shopCategory = scs[0], setShopCategory = scs[1];
    var qy = useState(""); var query = qy[0], setQuery = qy[1];

    useEffect(function () { window.scrollTo(0, 0); }, [route.page, shopCategory]);

    function keyOf(p, unit) { return p.id + "::" + unit; }
    function add(p, unit, price, qty) {
      var k = keyOf(p, unit);
      setCart(function (prev) {
        var found = prev.filter(function (x) { return x.key === k; })[0];
        if (found) return prev.map(function (x) { return x.key === k ? Object.assign({}, x, { qty: x.qty + qty }) : x; });
        return prev.concat([{ key: k, product: p, unit: unit, price: price, qty: qty }]);
      });
      setPlaced(false); setCartOpen(true);
    }
    function inc(k) { setCart(function (prev) { return prev.map(function (x) { return x.key === k ? Object.assign({}, x, { qty: x.qty + 1 }) : x; }); }); }
    function dec(k) { setCart(function (prev) { return prev.map(function (x) { return x.key === k ? Object.assign({}, x, { qty: Math.max(1, x.qty - 1) }) : x; }); }); }
    function remove(k) { setCart(function (prev) { return prev.filter(function (x) { return x.key !== k; }); }); }
    function checkout() { setCart([]); setPlaced(true); }

    var count = cart.reduce(function (a, x) { return a + x.qty; }, 0);
    var total = cart.reduce(function (a, x) { return a + x.price * x.qty; }, 0);

    var store = {
      route: route, cart: cart, count: count, total: total, placed: placed,
      shopCategory: shopCategory, query: query,
      add: add, inc: inc, dec: dec, remove: remove, checkout: checkout,
      resetPlaced: function () { setPlaced(false); },
      openProduct: function (p) { setModalP(p); },
      openCart: function () { setCartOpen(true); },
      goShop: function (c) { setShopCategory(c || "all"); setQuery(""); navigate("#/shop"); },
      setShopCategory: function (c) { setShopCategory(c); },
      search: function (q) { setQuery(q); setShopCategory("all"); navigate("#/shop"); },
      clearFilters: function () { setShopCategory("all"); setQuery(""); },
      navigate: navigate
    };

    return html`<div class="store">
      <div class="announce">Free shipping on orders over <b>₹999</b> · Fresh stock packed this week</div>
      <${Header} store=${store} />
      ${route.page === "shop" ? html`<${Shop} store=${store} />` : html`<${Home} store=${store} />`}
      <${Footer} store=${store} />
      ${modalP ? html`<${ProductModal} p=${modalP} store=${store} onClose=${function () { setModalP(null); }} />` : null}
      ${cartOpen ? html`<${CartDrawer} store=${store} onClose=${function () { setCartOpen(false); }} />` : null}
    </div>`;
  }

  window.Store = { StoreApp: StoreApp };
})();
