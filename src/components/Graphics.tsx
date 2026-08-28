import React, { useState, useEffect } from 'react';
/* ============================================================
   graphics.js — window.Motifs
   Festive, dependency-free decorative SVG for the "rich & festive"
   direction (paisley, marigold, diya, mandala, toran, flourishes).
   Every motif is a self-contained SVG that scales to its wrapper.
   Colours default to the festive palette but accept overrides so a
   motif can sit on ivory, on a deep pine band, or in gold.
   ============================================================ */

  
  
  if (!html) return; // offline guard — app.js shows a friendly notice

  // --- palette shortcuts (kept in sync with styles.css festive tokens) ---
  const GOLD = "#E0A63C", GOLD_LT = "#F2CB74", GOLD_DK = "#C6851F";
  const PINE = "#2F6A52", BERRY = "#9A3E60", MARIGOLD = "#E8842A", FLAME = "#F6A81E";

  const _m = 0;
  function mid(p) { _m += 1; return (p || "m") + _m; }

  // small helper: build N items evenly around a circle
  function ring(n, fn) {
    const out = [], i;
    for (i = 0; i < n; i += 1) out.push(fn(i, (i / n) * 360));
    return out;
  }

  const Motifs = {
    /* Paisley / boteh — the signature festive teardrop. Fills with a soft
       gradient, a scalloped inner border and a seed row so it reads at any size. */
    paisley: function (props) {
      props = props || {};
      const c = props.color || GOLD, edge = props.edge || GOLD_DK, seed = props.seed || GOLD_LT;
      const g = mid("pz");
      return (<svg viewBox="0 0 48 64" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <defs><linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color={seed}/><stop offset="1" stop-color={c}/>
        </linearGradient></defs>
        <path d="M27 4C41 8 45 27 33 42 26 51 11 51 8 39 6 29 17 23 25 29 31 33 28 42 22 41" fill={"url(#" + g + ")"} stroke={edge} strokeWidth="1.4"/>
        <path d="M27 12C35 16 37 28 30 38 25 45 15 45 13 37" fill="none" stroke={edge} strokeWidth="1" opacity="0.55"/>
        <g fill={seed}><circle cx="24" cy="18" r="1.6"/><circle cx="29" cy="22" r="1.5"/><circle cx="31" cy="28" r="1.4"/><circle cx="30" cy="34" r="1.3"/><circle cx="26" cy="38" r="1.2"/></g>
      </svg>);
    },

    /* Marigold — the quintessential festival flower, built from two petal rings. */
    marigold: function (props) {
      props = props || {};
      const outer = props.color || MARIGOLD, inner = props.inner || GOLD_LT, core = props.core || GOLD_DK;
      return (<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <g transform="translate(32 32)">
          {ring(16, function (i, a) { return (<ellipse key=${"o" + i} cx="0" cy="-20" rx="5.2" ry="9" fill={outer} transform={"rotate(" + a + ")"}/>); })}
          {ring(12, function (i, a) { return (<ellipse key=${"i" + i} cx="0" cy="-13" rx="4.4" ry="7.5" fill={inner} transform={"rotate(" + (a + 15) + ")"}/>); })}
          <circle r="7.5" fill={core}/>
          {ring(8, function (i, a) { return (<circle key=${"c" + i} cx="0" cy="-4.5" r="1.5" fill={inner} transform={"rotate(" + a + ")"}/>); })}
        </g>
      </svg>);
    },

    /* Diya — a lit oil lamp. Warm glow, gold dish, teardrop flame. */
    diya: function (props) {
      props = props || {};
      const dish = props.dish || GOLD, dishDk = props.dishDark || GOLD_DK;
      const glow = mid("dg"), fl = mid("df");
      return (<svg viewBox="0 0 80 64" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <defs>
          <radialGradient id={glow} cx="0.5" cy="0.42" r="0.5">
            <stop offset="0" stop-color={"rgba(246,168,30,0.55)"}/><stop offset="1" stop-color={"rgba(246,168,30,0)"}/>
          </radialGradient>
          <linearGradient id={fl} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FFE9A6"/><stop offset="0.5" stop-color={FLAME}/><stop offset="1" stop-color="#E0561C"/>
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="24" rx="30" ry="26" fill={"url(#" + glow + ")"}/>
        <path d="M38 8C44 16 44 24 40 30 36 24 36 16 38 8Z" fill={"url(#" + fl + ")"}/>
        <path d="M39 16C41 20 41 25 40 29 38.5 25 38.5 20 39 16Z" fill="#FFF4CF" opacity="0.85"/>
        <path d="M12 40C22 54 58 54 68 40 62 44 48 47 40 47 32 47 18 44 12 40Z" fill={dish}/>
        <path d="M12 40C22 50 58 50 68 40 60 45 48 47 40 47 32 47 20 45 12 40Z" fill={dishDk} opacity="0.55"/>
        <ellipse cx="40" cy="40" rx="28" ry="5" fill={dishDk} opacity="0.4"/>
      </svg>);
    },

    /* Mandala — concentric decorative rings. Meant as a large, faint backdrop. */
    mandala: function (props) {
      props = props || {};
      const stroke = props.color || GOLD, op = props.opacity == null ? 1 : props.opacity;
      return (<svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""} style={{ opacity: op }}>
        <g transform="translate(100 100)" fill="none" stroke={stroke} strokeWidth="1.4">
          <circle r="20"/><circle r="30"/><circle r="58"/><circle r="92"/>
          {ring(24, function (i, a) { return (<line key=${"l" + i} x1="0" y1="-30" x2="0" y2="-58" transform={"rotate(" + a + ")"}/>); })}
          {ring(12, function (i, a) { return (<path key=${"p" + i} d="M0 -58 Q7 -74 0 -90 Q-7 -74 0 -58Z" transform={"rotate(" + a + ")"}/>); })}
          {ring(24, function (i, a) { return (<circle key=${"d" + i} cx="0" cy="-70" r="1.6" fill={stroke} stroke="none" transform={"rotate(" + (a + 7.5) + ")"}/>); })}
          {ring(36, function (i, a) { return (<path key=${"s" + i} d="M0 -92 l4 -7 -4 3 -4 -3 4 7Z" fill={stroke} stroke="none" transform={"rotate(" + a + ")"}/>); })}
        </g>
      </svg>);
    },

    /* Toran — a hanging festoon of mango leaves and marigolds across a width.
       )count) sets how many leaf pairs; scales to the wrapper. */
    toran: function (props) {
      props = props || {};
      const count = props.count || 9, leaf = props.leaf || PINE, flower = props.flower || MARIGOLD, cord = props.cord || GOLD_DK;
      const W = 400, step = W / count, items = [], i;
      for (i = 0; i <= count; i += 1) {
        const x = i * step;
        const isFlower = i % 2 === 1;
        if (isFlower) {
          items.push((<g key={"t" + i} transform={"translate(" + x + " 14)"}>
            <line x1="0" y1="0" x2="0" y2="10" stroke={cord} strokeWidth="1.5"/>
            <circle cx="0" cy="16" r="6" fill={flower}/><circle cx="0" cy="16" r="2.6" fill={GOLD_DK}/>
          </g>));
        } else {
          items.push((<g key={"t" + i} transform={"translate(" + x + " 14)"}>
            <path d="M0 2C-6 8-7 20 0 30 7 20 6 8 0 2Z" fill={leaf}/>
            <path d="M0 6C-4 12-4 20 0 26" stroke="#1F4A36" strokeWidth="1" fill="none" opacity="0.6"/>
          </g>));
        }
      }
      return (<svg viewBox="0 0 400 48" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" className={props.class || ""}>
        <path d="M0 12 Q200 26 400 12" fill="none" stroke={cord} strokeWidth="2.5"/>
        {items}
      </svg>);
    },

    /* Corner flourish — a lotus fan radiating from the corner, for card / hero
       corners. )flip) ("h","v","hv") points it into any corner. */
    corner: function (props) {
      props = props || {};
      const color = props.color || GOLD, accent = props.accent || GOLD_DK;
      const sx = 1, sy = 1;
      if (props.flip === "h" || props.flip === "hv") sx = -1;
      if (props.flip === "v" || props.flip === "hv") sy = -1;
      const angles = [12, 30, 48, 66, 84];
      return (<svg viewBox="0 0 90 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <g transform={"translate(45 45) scale(" + sx + " " + sy + ") translate(-45 -45)"}>
          <g transform="translate(14 14)">
            {angles.map(function (a, i) {
              const len = i === 2 ? 30 : (i % 2 === 0 ? 22 : 26);
              return (<ellipse key=${"pt" + i} cx={len * 0.55} cy="0" rx={len * 0.5} ry="5.2" fill={i % 2 === 0 ? color : accent} transform={"rotate(" + a + ")"}/>);
            })}
            <path d="M40 8A40 40 0 0 1 8 40" fill="none" stroke={accent} strokeWidth="1.4"/>
            {angles.map(function (a, i) { return (<circle key=${"cd" + i} cx="40" cy="0" r="1.7" fill={accent} transform={"rotate(" + a + ")"}/>); })}
            <circle r="4.5" fill={color}/><circle r="1.8" fill={accent}/>
          </g>
        </g>
      </svg>);
    },

    /* Divider — a slim rule with a paisley/lotus medallion at centre. */
    divider: function (props) {
      props = props || {};
      const color = props.color || GOLD, accent = props.accent || GOLD_DK;
      return (<svg viewBox="0 0 320 40" width="100%" height="40" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <g stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
          <line x1="20" y1="20" x2="120" y2="20"/><line x1="200" y1="20" x2="300" y2="20"/>
          <circle cx="120" cy="20" r="2.2" fill={color} stroke="none"/><circle cx="200" cy="20" r="2.2" fill={color} stroke="none"/>
          <circle cx="108" cy="20" r="1.4" fill={color} stroke="none"/><circle cx="212" cy="20" r="1.4" fill={color} stroke="none"/>
        </g>
        <g transform="translate(160 20)">
          {ring(8, function (i, a) { return (<path key=${"pl" + i} d="M0 -5 Q4 -12 0 -18 Q-4 -12 0 -5Z" fill={color} transform={"rotate(" + a + ")"}/>); })}
          <circle r="4.5" fill={accent}/><circle r="2" fill={color}/>
        </g>
      </svg>);
    },

    /* Sprig — a small botanical branch (almond blossom) for quiet accents. */
    sprig: function (props) {
      props = props || {};
      const stem = props.stem || PINE, bloom = props.bloom || "#F2C6D2", petal = props.petal || "#FFFFFF";
      return (<svg viewBox="0 0 72 40" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={props.class || ""}>
        <path d="M4 34C20 30 34 22 60 8" fill="none" stroke={stem} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M22 27C16 24 14 18 18 14 22 18 24 23 22 27Z" fill={stem} opacity="0.85"/>
        <path d="M40 18C34 16 32 10 36 6 40 10 42 15 40 18Z" fill={stem} opacity="0.85"/>
        {[[60, 8], [48, 15], [30, 24]].map(function (p, i) {
          return (<g key=${"b" + i} transform={"translate(" + p[0] + " " + p[1] + ")"}>
            {ring(5, function (j, a) { return (<ellipse key=${j} cx="0" cy="-5" rx="2.6" ry="4" fill={petal} stroke={bloom} strokeWidth="0.8" transform={"rotate(" + a + ")"}/>); })}
            <circle r="2.2" fill={bloom}/>
          </g>);
        })}
      </svg>);
    }
  };

  window.Motifs = Motifs;
