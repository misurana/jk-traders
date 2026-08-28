/* ============================================================
   charts.js — dependency-free SVG charts on window.Charts
   ============================================================ */
(function () {
  "use strict";
  var html = window.html;
  var uid = 0;
  function nextId(p) { uid += 1; return (p || "g") + uid; }

  // ---------- Sparkline (KPI cards) ----------
  function Sparkline(props) {
    var d = props.data || [], W = 120, H = 38, p = 3;
    if (d.length < 2) return null;
    var max = Math.max.apply(null, d), min = Math.min.apply(null, d);
    var rng = (max - min) || 1;
    function X(i) { return p + (W - 2 * p) * (i / (d.length - 1)); }
    function Y(v) { return p + (H - 2 * p) * (1 - (v - min) / rng); }
    var pts = d.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); });
    var line = "M" + pts.join(" L");
    var area = "M" + X(0).toFixed(1) + "," + (H - p) + " L" + pts.join(" L") + " L" + X(d.length - 1).toFixed(1) + "," + (H - p) + " Z";
    var id = nextId("spark"), c = props.color || "#235240";
    return html`<svg width="100%" height=${H} viewBox=${"0 0 " + W + " " + H} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${c} stop-opacity="0.22"/>
        <stop offset="1" stop-color=${c} stop-opacity="0"/>
      </linearGradient></defs>
      <path d=${area} fill=${"url(#" + id + ")"}/>
      <path d=${line} fill="none" stroke=${c} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // ---------- Area chart (revenue: now vs prev) ----------
  function AreaChart(props) {
    var data = props.series || [];
    var W = 720, H = 280, pl = 46, pr = 18, pt = 22, pb = 34;
    var iw = W - pl - pr, ih = H - pt - pb, n = data.length;
    var max = Math.max.apply(null, data.map(function (d) { return Math.max(d.now, d.prev); }));
    max = Math.ceil(max / 50) * 50;
    function X(i) { return pl + iw * (i / (n - 1)); }
    function Y(v) { return pt + ih * (1 - v / max); }
    var nowLine = "M" + data.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d.now).toFixed(1); }).join(" L");
    var prevLine = "M" + data.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d.prev).toFixed(1); }).join(" L");
    var area = "M" + X(0).toFixed(1) + "," + Y(data[0].now).toFixed(1) + " L" +
      data.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d.now).toFixed(1); }).join(" L") +
      " L" + X(n - 1).toFixed(1) + "," + (pt + ih) + " L" + X(0).toFixed(1) + "," + (pt + ih) + " Z";
    var grid = [];
    for (var g = 0; g <= 4; g++) { grid.push({ y: pt + ih * (g / 4), val: Math.round(max * (1 - g / 4)) }); }
    var id = nextId("area");
    return html`<svg width="100%" viewBox=${"0 0 " + W + " " + H} role="img" aria-label="Weekly revenue trend">
      <defs><linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2F6A52" stop-opacity="0.20"/>
        <stop offset="1" stop-color="#2F6A52" stop-opacity="0"/>
      </linearGradient></defs>
      ${grid.map(function (gr, i) { return html`<g key=${i}>
        <line x1=${pl} y1=${gr.y.toFixed(1)} x2=${W - pr} y2=${gr.y.toFixed(1)} stroke="#EEE7D8" stroke-width="1"/>
        <text x=${pl - 10} y=${(gr.y + 4).toFixed(1)} text-anchor="end" font-size="11" fill="#968B79" font-family="'JetBrains Mono', monospace">${"₹" + gr.val + "k"}</text>
      </g>`; })}
      ${data.map(function (d, i) { return (i % 2 === 0) ? html`<text key=${i} x=${X(i).toFixed(1)} y=${H - 12} text-anchor="middle" font-size="11" fill="#968B79" font-family="'JetBrains Mono', monospace">${d.label}</text>` : null; })}
      <path d=${area} fill=${"url(#" + id + ")"}/>
      <path d=${prevLine} fill="none" stroke="#C7BCA6" stroke-width="2" stroke-dasharray="5 5" stroke-linecap="round"/>
      <path d=${nowLine} fill="none" stroke="#235240" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx=${X(n - 1).toFixed(1)} cy=${Y(data[n - 1].now).toFixed(1)} r="4.5" fill="#235240" stroke="#fff" stroke-width="2"/>
    </svg>`;
  }

  // ---------- Bar chart (orders by month) ----------
  function BarChart(props) {
    var data = props.data || [];
    var W = 720, H = 280, pl = 40, pr = 12, pt = 18, pb = 30;
    var iw = W - pl - pr, ih = H - pt - pb, n = data.length;
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }));
    max = Math.ceil(max / 40) * 40;
    var peak = data.reduce(function (a, d, i) { return d.v > data[a].v ? i : a; }, 0);
    var bw = (iw / n) * 0.56;
    var grid = [];
    for (var g = 0; g <= 4; g++) { grid.push({ y: pt + ih * (g / 4), val: Math.round(max * (1 - g / 4)) }); }
    var id = nextId("bar");
    return html`<svg width="100%" viewBox=${"0 0 " + W + " " + H} role="img" aria-label="Orders by month">
      <defs><linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2F6A52"/><stop offset="1" stop-color="#1B4032"/>
      </linearGradient></defs>
      ${grid.map(function (gr, i) { return html`<g key=${i}>
        <line x1=${pl} y1=${gr.y.toFixed(1)} x2=${W - pr} y2=${gr.y.toFixed(1)} stroke="#EEE7D8" stroke-width="1"/>
        <text x=${pl - 8} y=${(gr.y + 4).toFixed(1)} text-anchor="end" font-size="11" fill="#968B79" font-family="'JetBrains Mono', monospace">${gr.val}</text>
      </g>`; })}
      ${data.map(function (d, i) {
        var bh = ih * (d.v / max);
        var x = pl + iw * ((i + 0.5) / n) - bw / 2;
        var y = pt + ih - bh;
        var fill = i === peak ? "#E29A2C" : "url(#" + id + ")";
        return html`<g key=${i}>
          <rect x=${x.toFixed(1)} y=${y.toFixed(1)} width=${bw.toFixed(1)} height=${Math.max(2, bh).toFixed(1)} rx="5" fill=${fill}/>
          <text x=${(x + bw / 2).toFixed(1)} y=${H - 10} text-anchor="middle" font-size="11" fill="#968B79" font-family="'JetBrains Mono', monospace">${d.m}</text>
        </g>`;
      })}
    </svg>`;
  }

  // ---------- Donut (category split) ----------
  function Donut(props) {
    var data = props.data || [], size = props.size || 200;
    var r = 42, cx = 60, cy = 60, C = 2 * Math.PI * r;
    var total = data.reduce(function (a, d) { return a + d.value; }, 0) || 1;
    var acc = 0;
    var segs = data.map(function (d, i) {
      var frac = d.value / total, len = frac * C, offset = -acc;
      acc += len;
      return { key: i, color: d.color, dash: len.toFixed(2) + " " + (C - len).toFixed(2), offset: offset.toFixed(2) };
    });
    return html`<svg width=${size} height=${size} viewBox="0 0 120 120" role="img" aria-label="Sales by category">
      <g transform="rotate(-90 60 60)">
        <circle cx=${cx} cy=${cy} r=${r} fill="none" stroke="#EEE7D8" stroke-width="15"/>
        ${segs.map(function (s) { return html`<circle key=${s.key} cx=${cx} cy=${cy} r=${r} fill="none"
          stroke=${s.color} stroke-width="15" stroke-dasharray=${s.dash} stroke-dashoffset=${s.offset} stroke-linecap="butt"/>`; })}
      </g>
      <text x="60" y="55" text-anchor="middle" font-size="9" fill="#968B79" font-family="'JetBrains Mono', monospace" letter-spacing="1">TOTAL SKUS</text>
      <text x="60" y="72" text-anchor="middle" font-size="20" fill="#211D19" font-family="'Fraunces', serif" font-weight="600">${props.total || total}</text>
    </svg>`;
  }

  window.Charts = { Sparkline: Sparkline, AreaChart: AreaChart, BarChart: BarChart, Donut: Donut };
})();
