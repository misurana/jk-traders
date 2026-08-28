/* ============================================================
   admin.js — admin panel + analytics on window.Admin
   ============================================================ */
(function () {
  "use strict";
  var html = window.html, React = window.React;
  var UI = window.UI, Icons = window.Icons, Charts = window.Charts, N = window.NUVANA;
  var useState = React.useState;

  var NAV = [
    { group: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: "grid" }] },
    { group: "Catalogue", items: [
      { id: "products", label: "Products", icon: "box", count: N.products.length },
      { id: "categories", label: "Categories", icon: "tag" },
      { id: "reviews", label: "Reviews", icon: "star", count: N.reviews.filter(function (r) { return r.status === "pending"; }).length }
    ] },
    { group: "Sales", items: [
      { id: "orders", label: "Orders", icon: "bag", count: N.orders.length },
      { id: "customers", label: "Customers", icon: "users" }
    ] },
    { group: "System", items: [{ id: "settings", label: "Settings", icon: "gear" }] }
  ];
  var TITLES = { dashboard: "Dashboard", products: "Products", categories: "Categories", reviews: "Reviews", orders: "Orders", customers: "Customers", settings: "Settings" };
  function hashFor(id) { return id === "dashboard" ? "#/admin" : "#/admin/" + id; }

  // Deterministic order detail (kept consistent between table + slide-over)
  var _cache = {};
  function orderDetail(o) {
    if (_cache[o.id]) return _cache[o.id];
    var seed = parseInt(o.id.replace(/\D/g, ""), 10) || 1;
    var pool = N.products, count = Math.min(o.items, pool.length), picks = [];
    for (var i = 0; i < count; i++) {
      var p = pool[(seed + i * 7) % pool.length];
      var qty = ((seed + i) % 3) + 1;
      picks.push({ product: p, qty: qty, price: p.price });
    }
    var subtotal = picks.reduce(function (a, x) { return a + x.price * x.qty; }, 0);
    var shipping = subtotal >= 999 ? 0 : 59;
    var d = { items: picks, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
    _cache[o.id] = d; return d;
  }

  /* ---------------- Sidebar ---------------- */
  function Sidebar(props) {
    var page = props.page, navigate = props.navigate;
    return html`<aside class="side">
      <div class="side-brand">
        <${UI.Mark} size=${38} />
        <div class="col" style=${{ gap: "1px" }}>
          <span class="brand-name">Nuvana</span>
          <span class="brand-sub">Admin Console</span>
        </div>
      </div>
      <div class="side-scroll">
        ${NAV.map(function (grp, gi) {
          return html`<div key=${gi}>
            <div class="nav-label">${grp.group}</div>
            ${grp.items.map(function (it) {
              return html`<a key=${it.id} href=${hashFor(it.id)} class=${UI.cx("nav-item", page === it.id ? "active" : "")}>
                <span class="nv-ico">${Icons[it.icon]({ size: 19 })}</span>
                <span>${it.label}</span>
                ${it.count ? html`<span class="nv-count">${it.count}</span>` : null}
              </a>`;
            })}
          </div>`;
        })}
      </div>
      <div class="side-foot">
        <a class="side-user" href="#/">
          <${UI.Avatar} initials="RS" color="#E29A2C" />
          <div class="col grow" style=${{ gap: "1px" }}>
            <span class="nm">Ravi Suri</span>
            <span class="rl">Store owner</span>
          </div>
          ${Icons.logout({ size: 17 })}
        </a>
      </div>
    </aside>`;
  }

  /* ---------------- Topbar ---------------- */
  function Topbar(props) {
    var page = props.page, navigate = props.navigate;
    return html`<header class="topbar">
      <div class="col">
        <span class="crumb">Nuvana / ${TITLES[page] || "Admin"}</span>
        <h1>${TITLES[page] || "Admin"}</h1>
      </div>
      <div class="grow"></div>
      <div class="search hide-sm" style=${{ maxWidth: "260px", width: "100%" }}>
        ${Icons.search({ size: 18 })}
        <input placeholder="Search orders, products…" aria-label="Search"/>
      </div>
      <button class="btn-icon" aria-label="Notifications" style=${{ position: "relative" }}>
        ${Icons.bell({ size: 20 })}
        <span style=${{ position: "absolute", top: "9px", right: "9px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--berry)", border: "2px solid var(--ivory)" }}></span>
      </button>
      <a class="btn btn-ghost btn-sm" href="#/">${Icons.external({ size: 15 })} View store</a>
      <${UI.Avatar} initials="RS" color="#235240" />
    </header>`;
  }

  /* ---------------- Dashboard ---------------- */
  function KpiCard(props) {
    var k = props.k, up = k.delta >= 0;
    return html`<div class="kpi">
      <div class="kpi-top">
        <span class="kpi-ico" style=${{ background: k.tint, color: k.color }}>${Icons[k.ico]({ size: 20 })}</span>
        <span class=${"delta " + (up ? "up" : "down")}>${(up ? Icons.trendUp : Icons.trendDown)({ size: 14 })} ${Math.abs(k.delta)}%</span>
      </div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-val">${k.display}</div>
      <div style=${{ marginTop: "10px" }}><${Charts.Sparkline} data=${k.spark} color=${k.color} /></div>
    </div>`;
  }

  function RecentOrders(props) {
    var navigate = props.navigate, onOpen = props.onOpen;
    var list = N.orders.slice(0, 6);
    return html`<div class="panel">
      <div class="panel-head">
        <div><h3>Recent orders</h3><span class="sub">Latest ${list.length} of ${N.orders.length}</span></div>
        <a class="sec-link" href="#/admin/orders">View all ${Icons.arrowRight({ size: 15 })}</a>
      </div>
      <div style=${{ overflowX: "auto" }}>
        <table class="table clickable">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${list.map(function (o) {
              return html`<tr key=${o.id} onClick=${function () { onOpen(o); }}>
                <td><span class="mono" style=${{ fontWeight: 600, color: "var(--pine)" }}>${o.id}</span></td>
                <td><div class="row center gap-8"><${UI.Avatar} initials=${UI.initials(o.customer)} color=${"#235240"} /><span style=${{ fontWeight: 600 }}>${o.customer}</span></div></td>
                <td><span class="data-id">${o.date}</span></td>
                <td><span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(orderDetail(o).total)}</span></td>
                <td><${UI.Status} status=${o.status} /></td>
                <td style=${{ textAlign: "right" }}>${Icons.chevronRight({ size: 16, class: "" })}</td>
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function Dashboard(props) {
    var navigate = props.navigate, onOpen = props.onOpen;
    var totalSku = N.categories.reduce(function (a, c) { return a + c.count; }, 0);
    return html`<div>
      <div class="kpis">
        ${N.kpis.map(function (k) { return html`<${KpiCard} key=${k.key} k=${k} />`; })}
      </div>

      <div class="dash-grid">
        <div class="panel">
          <div class="panel-head">
            <div><h3>Revenue</h3><span class="sub">Last 12 weeks · vs previous period</span></div>
            <div class="legend">
              <div class="lg"><span class="sw" style=${{ background: "#235240" }}></span>This period</div>
              <div class="lg"><span class="sw" style=${{ background: "#C7BCA6" }}></span>Previous</div>
            </div>
          </div>
          <div class="panel-body"><${Charts.AreaChart} series=${N.revenueSeries} /></div>
        </div>
        <div class="panel">
          <div class="panel-head"><div><h3>Sales by category</h3><span class="sub">Share of revenue</span></div></div>
          <div class="panel-body">
            <div class="jc" style=${{ display: "flex" }}><${Charts.Donut} data=${N.categorySplit} total=${totalSku} size=${186} /></div>
            <div style=${{ marginTop: "14px" }}>
              ${N.categorySplit.map(function (c, i) {
                return html`<div key=${i} class="row between center" style=${{ padding: "6px 0" }}>
                  <div class="row center gap-8"><span class="sw" style=${{ width: "10px", height: "10px", borderRadius: "3px", background: c.color, display: "inline-block" }}></span><span style=${{ fontSize: "13.5px", fontWeight: 600 }}>${c.name}</span></div>
                  <span class="mono" style=${{ fontSize: "13px", color: "var(--muted)" }}>${c.value}%</span>
                </div>`;
              })}
            </div>
          </div>
        </div>
      </div>

      <div class="dash-grid" style=${{ marginTop: "18px" }}>
        <div class="panel">
          <div class="panel-head"><div><h3>Orders</h3><span class="sub">Monthly · this year</span></div>
            <span class="badge badge-pine">${Icons.sparkle({ size: 13 })} Peak in Dec</span></div>
          <div class="panel-body"><${Charts.BarChart} data=${N.ordersByMonth} /></div>
        </div>
        <div class="panel">
          <div class="panel-head"><div><h3>Top products</h3><span class="sub">By units sold</span></div></div>
          <div class="panel-body">
            ${N.topProducts.map(function (tp, i) {
              var p = N.product(tp.id);
              return html`<div key=${tp.id} class="tp">
                <span class="tp-rank">${i + 1}</span>
                <div class="tp-thumb"><${UI.ProductMedia} product=${p} pad="12%" /></div>
                <div class="grow">
                  <div class="row between"><span class="tp-name">${p.name}</span><span class="mono" style=${{ fontSize: "13px", fontWeight: 700 }}>${N.fmtK(tp.revenue)}</span></div>
                  <div class="tp-meta">${tp.units.toLocaleString("en-IN")} units</div>
                  <div class="bar-track"><div class="bar-fill" style=${{ width: tp.share + "%" }}></div></div>
                </div>
              </div>`;
            })}
          </div>
        </div>
      </div>

      <div style=${{ marginTop: "18px" }}><${RecentOrders} navigate=${navigate} onOpen=${onOpen} /></div>
    </div>`;
  }

  /* ---------------- Orders ---------------- */
  var STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
  function Orders(props) {
    var onOpen = props.onOpen;
    var fs = useState("all"); var filter = fs[0], setFilter = fs[1];
    var qs = useState(""); var q = qs[0], setQ = qs[1];
    var list = N.orders.filter(function (o) {
      if (filter !== "all" && o.status !== filter) return false;
      if (q) { var s = q.toLowerCase(); return o.id.toLowerCase().indexOf(s) >= 0 || o.customer.toLowerCase().indexOf(s) >= 0 || o.city.toLowerCase().indexOf(s) >= 0; }
      return true;
    });
    return html`<div>
      <div class="toolbar">
        <div class="search" style=${{ maxWidth: "300px", width: "100%" }}>
          ${Icons.search({ size: 18 })}
          <input placeholder="Search by order, customer, city…" value=${q} onInput=${function (e) { setQ(e.target.value); }} aria-label="Search orders"/>
        </div>
        <div class="grow"></div>
        <button class="btn btn-ghost btn-sm">${Icons.download({ size: 15 })} Export CSV</button>
        <button class="btn btn-primary btn-sm">${Icons.plus({ size: 15 })} New order</button>
      </div>
      <div class="filters" style=${{ paddingTop: "0", marginBottom: "16px" }}>
        ${STATUSES.map(function (s) {
          var label = s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1);
          var n = s === "all" ? N.orders.length : N.orders.filter(function (o) { return o.status === s; }).length;
          return html`<button key=${s} class=${UI.cx("chip", filter === s ? "active" : "")} onClick=${function () { setFilter(s); }}>${label} <span class="mono" style=${{ opacity: .7 }}>${n}</span></button>`;
        })}
      </div>
      <div class="panel">
        <div style=${{ overflowX: "auto" }}>
          <table class="table clickable">
            <thead><tr><th>Order</th><th>Customer</th><th>City</th><th>Date</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              ${list.map(function (o) {
                return html`<tr key=${o.id} onClick=${function () { onOpen(o); }}>
                  <td><span class="mono" style=${{ fontWeight: 600, color: "var(--pine)" }}>${o.id}</span></td>
                  <td><div class="row center gap-8"><${UI.Avatar} initials=${UI.initials(o.customer)} color=${"#235240"} /><span style=${{ fontWeight: 600 }}>${o.customer}</span></div></td>
                  <td>${o.city}</td>
                  <td><span class="data-id">${o.date}</span></td>
                  <td><span class="mono">${o.items}</span></td>
                  <td><span class="badge badge-muted">${o.pay}</span></td>
                  <td><span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(orderDetail(o).total)}</span></td>
                  <td><${UI.Status} status=${o.status} /></td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
        ${list.length === 0 ? html`<div style=${{ padding: "50px", textAlign: "center", color: "var(--muted)" }}>No orders match those filters.</div>` : null}
      </div>
    </div>`;
  }

  function OrderSlideOver(props) {
    var o = props.order, onClose = props.onClose;
    var d = orderDetail(o);
    var steps = ["Placed", "Processing", "Shipped", "Delivered"];
    var cur = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 }[o.status];
    return html`<div class="overlay right" onClick=${onClose}>
      <aside class="slideover" onClick=${function (e) { e.stopPropagation(); }} aria-label=${"Order " + o.id}>
        <div class="drawer-head">
          <div><div class="row center gap-8"><h3 style=${{ fontSize: "18px" }} class="mono">${o.id}</h3><${UI.Status} status=${o.status} /></div>
            <span class="data-id">${o.date} · ${o.channel} · ${o.pay}</span></div>
          <button class="btn-icon" aria-label="Close" onClick=${onClose}>${Icons.x({ size: 20 })}</button>
        </div>
        <div class="drawer-body">
          <div class="card card-pad" style=${{ marginBottom: "16px" }}>
            <div class="row center gap-12">
              <${UI.Avatar} initials=${UI.initials(o.customer)} color="#235240" />
              <div class="grow"><div style=${{ fontWeight: 700 }}>${o.customer}</div><div class="data-id">${o.city}, India</div></div>
              <button class="btn btn-ghost btn-sm">${Icons.mail({ size: 15 })} Contact</button>
            </div>
          </div>

          ${cur >= 0 ? html`<div class="card card-pad" style=${{ marginBottom: "16px" }}>
            <div class="data-id" style=${{ marginBottom: "14px" }}>Fulfilment</div>
            <div class="row between">
              ${steps.map(function (st, i) {
                var done = i <= cur;
                return html`<div key=${i} class="col center" style=${{ flex: 1, position: "relative" }}>
                  <span style=${{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
                    background: done ? "var(--pine)" : "var(--ivory-2)", color: done ? "#fff" : "var(--muted-2)" }}>${done ? Icons.check({ size: 14 }) : html`<span class="mono" style=${{ fontSize: "11px" }}>${i + 1}</span>`}</span>
                  <span style=${{ fontSize: "10.5px", marginTop: "6px", color: done ? "var(--ink)" : "var(--muted-2)", fontWeight: 600 }}>${st}</span>
                  ${i < steps.length - 1 ? html`<span style=${{ position: "absolute", top: "13px", left: "50%", width: "100%", height: "2px", background: i < cur ? "var(--pine)" : "var(--line-2)" }}></span>` : null}
                </div>`;
              })}
            </div>
          </div>` : html`<div class="card card-pad" style=${{ marginBottom: "16px", background: "var(--neg-tint)" }}>
            <span class="badge badge-neg">${Icons.x({ size: 13 })} This order was cancelled</span></div>`}

          <div class="data-id" style=${{ marginBottom: "8px" }}>Items · ${d.items.length}</div>
          ${d.items.map(function (it, i) {
            return html`<div key=${i} class="cart-line" style=${{ padding: "12px 0" }}>
              <div class="cart-thumb"><${UI.ProductMedia} product=${it.product} pad="14%" /></div>
              <div class="grow">
                <div style=${{ fontWeight: 650, fontSize: "14px" }}>${it.product.name}</div>
                <div class="data-id">${it.product.unit} · Qty ${it.qty}</div>
              </div>
              <span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(it.price * it.qty)}</span>
            </div>`;
          })}

          <div class="card card-pad" style=${{ marginTop: "16px" }}>
            <div class="row between" style=${{ padding: "3px 0" }}><span class="data-id">Subtotal</span><span class="mono">${N.fmtINR(d.subtotal)}</span></div>
            <div class="row between" style=${{ padding: "3px 0" }}><span class="data-id">Shipping</span><span class="mono">${d.shipping === 0 ? "Free" : N.fmtINR(d.shipping)}</span></div>
            <div class="row between" style=${{ padding: "8px 0 0", borderTop: "1px solid var(--line)", marginTop: "6px" }}><span style=${{ fontWeight: 700 }}>Total</span><span class="mono" style=${{ fontWeight: 700, fontSize: "16px", color: "var(--pine)" }}>${N.fmtINR(d.total)}</span></div>
          </div>
        </div>
        <div class="drawer-foot row gap-8">
          <button class="btn btn-ghost grow">${Icons.download({ size: 15 })} Invoice</button>
          <button class="btn btn-primary grow">Update status ${Icons.chevronDown({ size: 15 })}</button>
        </div>
      </aside>
    </div>`;
  }

  /* ---------------- Products ---------------- */
  function Products() {
    var vs = useState("grid"); var view = vs[0], setView = vs[1];
    var cs = useState("all"); var cat = cs[0], setCat = cs[1];
    var qs = useState(""); var q = qs[0], setQ = qs[1];
    var list = N.products.filter(function (p) {
      if (cat !== "all" && p.cat !== cat) return false;
      if (q) return p.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
      return true;
    });
    function sku(p) { return "NX-" + p.id.toUpperCase(); }
    var chips = [{ id: "all", name: "All" }].concat(N.categories.map(function (c) { return { id: c.id, name: c.name }; }));
    return html`<div>
      <div class="toolbar">
        <div class="search" style=${{ maxWidth: "280px", width: "100%" }}>
          ${Icons.search({ size: 18 })}
          <input placeholder="Search products…" value=${q} onInput=${function (e) { setQ(e.target.value); }} aria-label="Search products"/>
        </div>
        <div class="grow"></div>
        <div class="seg">
          <button class=${view === "grid" ? "active" : ""} onClick=${function () { setView("grid"); }}>${Icons.grid({ size: 15 })}</button>
          <button class=${view === "list" ? "active" : ""} onClick=${function () { setView("list"); }}>${Icons.menu({ size: 15 })}</button>
        </div>
        <button class="btn btn-saffron btn-sm">${Icons.plus({ size: 15 })} Add product</button>
      </div>
      <div class="filters" style=${{ paddingTop: "0", marginBottom: "16px" }}>
        ${chips.map(function (c) { return html`<button key=${c.id} class=${UI.cx("chip", cat === c.id ? "active" : "")} onClick=${function () { setCat(c.id); }}>${c.name}</button>`; })}
      </div>
      ${view === "grid"
        ? html`<div class="padmin">${list.map(function (p) {
            var sm = UI.stockMeta(p);
            return html`<div key=${p.id} class="pa-card">
              <div class="pa-media"><${UI.ProductMedia} product=${p} pad="9%" /></div>
              <div class="pa-body">
                <div class="row between center"><span class="data-id">${sku(p)}</span><button class="btn-icon" style=${{ width: "28px", height: "28px" }} aria-label="More">${Icons.dots({ size: 16 })}</button></div>
                <div style=${{ fontWeight: 700, fontSize: "15px", marginTop: "2px" }}>${p.name}</div>
                <div class="row between center" style=${{ marginTop: "8px" }}>
                  <span class="mono" style=${{ fontWeight: 700, color: "var(--pine)" }}>${N.fmtINR(p.price)}</span>
                  <span class="row center gap-4">${Icons.star({ size: 13, class: "" })}<span class="data-id">${p.rating}</span></span>
                </div>
                <div class="stock-bar"><div style=${{ width: sm.pct + "%", height: "100%", borderRadius: "999px", background: sm.color }}></div></div>
                <div class="row between center" style=${{ marginTop: "8px" }}>
                  <span class=${"badge " + sm.cls} style=${{ fontSize: "11px" }}>${sm.label}</span>
                  <span class="data-id">${p.sold.toLocaleString("en-IN")} sold</span>
                </div>
              </div>
            </div>`;
          })}</div>`
        : html`<div class="panel"><div style=${{ overflowX: "auto" }}>
            <table class="table">
              <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Rating</th><th></th></tr></thead>
              <tbody>
                ${list.map(function (p) {
                  var sm = UI.stockMeta(p);
                  return html`<tr key=${p.id}>
                    <td><div class="row center gap-10"><div class="tp-thumb" style=${{ width: "40px", height: "40px" }}><${UI.ProductMedia} product=${p} pad="12%" /></div><span style=${{ fontWeight: 650 }}>${p.name}</span></div></td>
                    <td><span class="data-id">${sku(p)}</span></td>
                    <td>${N.categories.filter(function (c) { return c.id === p.cat; })[0].name}</td>
                    <td><span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(p.price)}</span></td>
                    <td><span class=${"badge " + sm.cls} style=${{ fontSize: "11px" }}>${sm.label}</span></td>
                    <td><span class="mono">${p.sold.toLocaleString("en-IN")}</span></td>
                    <td><span class="row center gap-4">${Icons.star({ size: 13 })}<span class="data-id">${p.rating}</span></span></td>
                    <td><div class="row gap-4"><button class="btn-icon" style=${{ width: "30px", height: "30px" }} aria-label="Edit">${Icons.edit({ size: 15 })}</button></div></td>
                  </tr>`;
                })}
              </tbody>
            </table>
          </div></div>`}
    </div>`;
  }

  /* ---------------- Customers ---------------- */
  function Customers() {
    var qs = useState(""); var q = qs[0], setQ = qs[1];
    var list = N.customers.filter(function (c) { return !q || c.name.toLowerCase().indexOf(q.toLowerCase()) >= 0 || c.email.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
    var totalSpent = N.customers.reduce(function (a, c) { return a + c.spent; }, 0);
    var avg = Math.round(totalSpent / N.customers.length);
    var tierColor = { Platinum: "badge-pine", Gold: "badge-warn", Silver: "badge-muted" };
    return html`<div>
      <div class="mini-stats" style=${{ marginBottom: "18px", maxWidth: "560px" }}>
        <div class="mini"><div class="v">${N.customers.length * 76}</div><div class="l">Total customers</div></div>
        <div class="mini"><div class="v">${N.fmtK(avg)}</div><div class="l">Avg lifetime value</div></div>
        <div class="mini"><div class="v">68%</div><div class="l">Repeat rate</div></div>
      </div>
      <div class="toolbar">
        <div class="search" style=${{ maxWidth: "280px", width: "100%" }}>${Icons.search({ size: 18 })}<input placeholder="Search customers…" value=${q} onInput=${function (e) { setQ(e.target.value); }} aria-label="Search customers"/></div>
        <div class="grow"></div>
        <button class="btn btn-ghost btn-sm">${Icons.download({ size: 15 })} Export</button>
      </div>
      <div class="panel"><div style=${{ overflowX: "auto" }}>
        <table class="table">
          <thead><tr><th>Customer</th><th>City</th><th>Orders</th><th>Spent</th><th>Since</th><th>Tier</th></tr></thead>
          <tbody>
            ${list.map(function (c) {
              return html`<tr key=${c.id}>
                <td><div class="row center gap-10"><${UI.Avatar} initials=${UI.initials(c.name)} color=${c.color} /><div><div style=${{ fontWeight: 650 }}>${c.name}</div><div class="data-id">${c.email}</div></div></div></td>
                <td>${c.city}</td>
                <td><span class="mono">${c.orders}</span></td>
                <td><span class="mono" style=${{ fontWeight: 700 }}>${N.fmtINR(c.spent)}</span></td>
                <td><span class="data-id">${c.since}</span></td>
                <td><span class=${"badge " + (tierColor[c.tier] || "badge-muted")}>${c.tier}</span></td>
              </tr>`;
            })}
          </tbody>
        </table>
      </div></div>
    </div>`;
  }

  /* ---------------- Categories ---------------- */
  function Categories() {
    function share(name) { var s = N.categorySplit.filter(function (x) { return x.name.toLowerCase().indexOf(name.toLowerCase().split(" ")[0]) >= 0; })[0]; return s ? s.value : 4; }
    return html`<div>
      <div class="toolbar">
        <span class="data-id">${N.categories.length} categories</span>
        <div class="grow"></div>
        <button class="btn btn-saffron btn-sm">${Icons.plus({ size: 15 })} Add category</button>
      </div>
      <div class="padmin">
        ${N.categories.map(function (c) {
          var sh = share(c.name);
          return html`<div key=${c.id} class="pa-card card-pad">
            <div class="row between center">
              <div class="cat-ico" style=${{ background: c.tint, width: "52px", height: "52px", borderRadius: "14px" }}><div style=${{ width: "34px", height: "34px" }}>${window.Glyphs[c.glyph] ? window.Glyphs[c.glyph]() : null}</div></div>
              <button class="btn-icon" style=${{ width: "30px", height: "30px" }} aria-label="Edit">${Icons.edit({ size: 15 })}</button>
            </div>
            <div style=${{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "19px", marginTop: "14px" }}>${c.name}</div>
            <div class="data-id">${c.count} products</div>
            <div style=${{ marginTop: "14px" }}>
              <div class="row between center" style=${{ marginBottom: "5px" }}><span class="data-id">Revenue share</span><span class="mono" style=${{ fontWeight: 700 }}>${sh}%</span></div>
              <div class="bar-track"><div class="bar-fill" style=${{ width: (sh * 3) + "%" }}></div></div>
            </div>
          </div>`;
        })}
      </div>
    </div>`;
  }

  /* ---------------- Reviews ---------------- */
  function Reviews() {
    var rs = useState(N.reviews); var reviews = rs[0], setReviews = rs[1];
    function act(id, status) { setReviews(reviews.map(function (r) { return r.id === id ? Object.assign({}, r, { status: status }) : r; })); }
    var pending = reviews.filter(function (r) { return r.status === "pending"; }).length;
    var avg = (reviews.reduce(function (a, r) { return a + r.rating; }, 0) / reviews.length).toFixed(1);
    return html`<div>
      <div class="mini-stats" style=${{ marginBottom: "18px", maxWidth: "560px" }}>
        <div class="mini"><div class="v">${avg}★</div><div class="l">Average rating</div></div>
        <div class="mini"><div class="v">${reviews.length}</div><div class="l">Total reviews</div></div>
        <div class="mini"><div class="v" style=${{ color: pending ? "var(--saffron-700)" : "inherit" }}>${pending}</div><div class="l">Awaiting moderation</div></div>
      </div>
      <div class="col gap-12">
        ${reviews.map(function (r) {
          var p = N.product(r.product);
          var badge = r.status === "published" ? { cls: "badge-pos", label: "Published" }
            : r.status === "hidden" ? { cls: "badge-muted", label: "Hidden" }
            : { cls: "badge-warn", label: "Pending" };
          return html`<div key=${r.id} class="panel card-pad">
            <div class="row gap-16">
              <div class="tp-thumb" style=${{ width: "54px", height: "54px" }}><${UI.ProductMedia} product=${p} pad="12%" /></div>
              <div class="grow">
                <div class="row between center wrap-flex gap-8">
                  <div class="row center gap-10">
                    <${UI.Avatar} initials=${UI.initials(r.name)} color="#235240" />
                    <div><div style=${{ fontWeight: 700 }}>${r.name}</div><div class="data-id">on ${p.name} · ${r.date}</div></div>
                  </div>
                  <div class="row center gap-10">
                    <${UI.Rating} value=${r.rating} size=${15} />
                    <span class=${"badge " + badge.cls}>${badge.label}</span>
                  </div>
                </div>
                <p style=${{ marginTop: "10px", color: "var(--ink-2)", fontSize: "14.5px" }}>“${r.text}”</p>
                <div class="row gap-8" style=${{ marginTop: "12px" }}>
                  ${r.status === "pending"
                    ? html`<button class="btn btn-primary btn-sm" onClick=${function () { act(r.id, "published"); }}>${Icons.check({ size: 14 })} Approve</button>
                           <button class="btn btn-ghost btn-sm" onClick=${function () { act(r.id, "hidden"); }}>Hide</button>`
                    : r.status === "published"
                      ? html`<button class="btn btn-ghost btn-sm" onClick=${function () { act(r.id, "hidden"); }}>${Icons.eye({ size: 14 })} Hide</button>`
                      : html`<button class="btn btn-primary btn-sm" onClick=${function () { act(r.id, "published"); }}>${Icons.check({ size: 14 })} Publish</button>`}
                  <button class="btn btn-ghost btn-sm">${Icons.mail({ size: 14 })} Reply</button>
                </div>
              </div>
            </div>
          </div>`;
        })}
      </div>
    </div>`;
  }

  /* ---------------- Settings ---------------- */
  function Toggle(props) {
    var s = useState(props.on !== false); var on = s[0], setOn = s[1];
    return html`<button class=${"switch " + (on ? "on" : "")} role="switch" aria-checked=${on} aria-label=${props.label || "Toggle"} onClick=${function () { setOn(!on); }}></button>`;
  }
  function Settings() {
    return html`<div style=${{ maxWidth: "760px" }}>
      <div class="panel" style=${{ marginBottom: "18px" }}>
        <div class="panel-head"><h3>Store profile</h3></div>
        <div class="panel-body col gap-16">
          <div class="row gap-16 wrap-flex">
            <div class="field grow"><label>Store name</label><input class="input" defaultValue="Nuvana Foods" /></div>
            <div class="field grow"><label>Support phone</label><input class="input" defaultValue=${N.brand.phone} /></div>
          </div>
          <div class="field"><label>Tagline</label><input class="input" defaultValue="Premium dry fruits & nuts, sourced at origin." /></div>
          <div class="row gap-16 wrap-flex">
            <div class="field grow"><label>Currency</label><select class="select"><option>₹ Indian Rupee (INR)</option><option>$ US Dollar (USD)</option></select></div>
            <div class="field grow"><label>Country</label><select class="select"><option>India</option><option>United Arab Emirates</option></select></div>
          </div>
        </div>
      </div>

      <div class="panel" style=${{ marginBottom: "18px" }}>
        <div class="panel-head"><h3>Shipping</h3></div>
        <div class="panel-body">
          <div class="row gap-16 wrap-flex">
            <div class="field grow"><label>Free shipping over (₹)</label><input class="input" defaultValue="999" /></div>
            <div class="field grow"><label>Flat rate (₹)</label><input class="input" defaultValue="59" /></div>
          </div>
        </div>
      </div>

      <div class="panel" style=${{ marginBottom: "18px" }}>
        <div class="panel-head"><h3>Notifications</h3></div>
        <div class="panel-body">
          <div class="set-row"><div><div style=${{ fontWeight: 650 }}>New order emails</div><div class="data-id">Email me when an order is placed</div></div><${Toggle} on=${true} label="Order emails" /></div>
          <div class="set-row"><div><div style=${{ fontWeight: 650 }}>Low-stock alerts</div><div class="data-id">Warn me when stock drops below 15 units</div></div><${Toggle} on=${true} label="Low stock" /></div>
          <div class="set-row"><div><div style=${{ fontWeight: 650 }}>Weekly summary</div><div class="data-id">A performance digest every Monday</div></div><${Toggle} on=${false} label="Weekly summary" /></div>
        </div>
      </div>

      <div class="row gap-10 between">
        <button class="btn btn-ghost">Discard</button>
        <button class="btn btn-saffron">${Icons.check({ size: 16 })} Save changes</button>
      </div>
    </div>`;
  }

  /* ---------------- Admin app ---------------- */
  function AdminApp(props) {
    var route = props.route, navigate = props.navigate;
    var page = route.adminPage || "dashboard";
    var os = useState(null); var order = os[0], setOrder = os[1];
    var onOpen = function (o) { setOrder(o); };
    var content;
    if (page === "orders") content = html`<${Orders} onOpen=${onOpen} />`;
    else if (page === "products") content = html`<${Products} />`;
    else if (page === "customers") content = html`<${Customers} />`;
    else if (page === "categories") content = html`<${Categories} />`;
    else if (page === "reviews") content = html`<${Reviews} />`;
    else if (page === "settings") content = html`<${Settings} />`;
    else content = html`<${Dashboard} navigate=${navigate} onOpen=${onOpen} />`;

    return html`<div class="admin">
      <${Sidebar} page=${page} navigate=${navigate} />
      <div class="admin-main">
        <${Topbar} page=${page} navigate=${navigate} />
        <div class="admin-content rise">${content}</div>
      </div>
      ${order ? html`<${OrderSlideOver} order=${order} onClose=${function () { setOrder(null); }} />` : null}
    </div>`;
  }

  window.Admin = { AdminApp: AdminApp };
})();
