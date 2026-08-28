/* ============================================================
   ui.js — shared presentational helpers on window.UI
   ============================================================ */
(function () {
  "use strict";
  var html = window.html;
  var Icons = window.Icons, Glyphs = window.Glyphs;

  function cx() { return [].slice.call(arguments).filter(Boolean).join(" "); }

  // Small brand mark (saffron almond on pine) — reused in header/footer/sidebar
  function Mark(props) {
    props = props || {};
    var s = props.size || 40;
    return html`<span class="brand-mark" style=${{ width: s + "px", height: s + "px" }}>
      <svg width=${s * 0.5} height=${s * 0.5} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 14c18 9 27 30 22 52-4 18-15 28-22 34-7-6-18-16-22-34-5-22 4-43 22-52z" fill="#E29A2C"/>
        <path d="M50 26c0 26 0 52 0 66" stroke="#B87E1E" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </span>`;
  }

  function Brand(props) {
    props = props || {};
    var N = window.NUVANA.brand;
    return html`<a class="brand" href=${props.href || "#/"} aria-label="Nuvana home">
      <${Mark} size=${props.size || 40} />
      <span class="col" style=${{ gap: "1px" }}>
        <span class="brand-name">${N.name}</span>
        <span class="brand-sub">${props.sub || "Dry Fruits & Nuts"}</span>
      </span>
    </a>`;
  }

  function Rating(props) {
    var v = props.value || 0, size = props.size || 15, out = [];
    var full = Math.round(v);
    for (var i = 0; i < 5; i++) {
      out.push(Icons.star({ size: size, class: i < full ? "" : "s-empty", key: i }));
    }
    return html`<span class="stars" title=${v + " out of 5"}>${out}</span>`;
  }

  function Money(props) {
    var N = window.NUVANA;
    var hasMrp = props.mrp && props.mrp > props.price;
    return html`<span class="price">
      <span class="now">${N.fmtINR(props.price)}</span>
      ${hasMrp ? html`<span class="was">${N.fmtINR(props.mrp)}</span>` : null}
      ${props.unit ? html`<span class="unit">/ ${props.unit}</span>` : null}
    </span>`;
  }

  // Gradient tile + product glyph — used in cards, thumbs, modal.
  // Layers (back → front): gradient wash · faint paisley watermark · SVG glyph
  // · optional real photo. Drop a URL/path into a product's `img` field and it
  // covers the tile; if it fails to load it hides itself and the art shows.
  function ProductMedia(props) {
    var p = props.product;
    var Motifs = window.Motifs;
    var g = Glyphs[p.glyph] ? Glyphs[p.glyph]() : null;
    var bg = "linear-gradient(150deg, " + p.grad[0] + " 0%, " + p.grad[1] + " 100%)";
    var pad = props.pad || "16%";
    var decor = (!props.plain && Motifs) ? html`<span class="fig-watermark" aria-hidden="true">
      ${Motifs.paisley({ color: p.grad[1], edge: p.grad[1], seed: p.grad[0] })}
    </span>` : null;
    var photo = p.img ? html`<img class="fig-photo" src=${p.img} alt=${p.name} loading="lazy"
      onError=${function (e) { e.currentTarget.style.display = "none"; }} />` : null;
    return html`<div class=${cx("fig", props.class)} style=${{ background: bg, width: "100%", height: "100%" }}>
      ${decor}
      <span class="fig-art" style=${{ padding: pad }}>${g}</span>
      ${photo}
    </div>`;
  }

  function Qty(props) {
    return html`<div class="qty">
      <button onClick=${props.onDec} aria-label="Decrease quantity">${Icons.minus({ size: 14 })}</button>
      <span>${props.value}</span>
      <button onClick=${props.onInc} aria-label="Increase quantity">${Icons.plus({ size: 14 })}</button>
    </div>`;
  }

  // Product corner flags
  var FLAG = {
    best: { label: "Bestseller", cls: "flag-best" },
    sale: { label: "Sale", cls: "flag-sale" },
    new:  { label: "New", cls: "flag-new" }
  };
  function Flags(props) {
    var flags = (props.flags || []).filter(function (f) { return FLAG[f]; });
    if (!flags.length) return null;
    return html`<div class="pcard-flags">
      ${flags.map(function (f) { return html`<span key=${f} class=${cx("flag", FLAG[f].cls)}>${FLAG[f].label}</span>`; })}
    </div>`;
  }

  // Status pill for orders
  function Status(props) {
    var s = props.status || "pending";
    var label = s.charAt(0).toUpperCase() + s.slice(1);
    return html`<span class=${"st st-" + s}>${label}</span>`;
  }

  // Discount percentage helper
  function pctOff(price, mrp) {
    if (!mrp || mrp <= price) return 0;
    return Math.round((1 - price / mrp) * 100);
  }

  // Stock meta → {label, cls, color, pct}
  function stockMeta(p) {
    if (p.stock <= 0) return { label: "Out of stock", cls: "badge-neg", color: "#C0492F", pct: 0 };
    if (p.stock <= 15) return { label: "Low · " + p.stock + " left", cls: "badge-warn", color: "#E29A2C", pct: Math.max(8, p.stock) };
    return { label: "In stock · " + p.stock, cls: "badge-pos", color: "#2E7D5B", pct: Math.min(100, Math.round(p.stock / 4)) };
  }

  function Avatar(props) {
    return html`<span class="avatar" style=${{ background: props.color || "#235240" }}>${props.initials}</span>`;
  }
  function initials(name) {
    return name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  }

  window.UI = {
    cx: cx, Mark: Mark, Brand: Brand, Rating: Rating, Money: Money,
    ProductMedia: ProductMedia, Qty: Qty, Flags: Flags, Status: Status,
    pctOff: pctOff, stockMeta: stockMeta, Avatar: Avatar, initials: initials
  };
})();
