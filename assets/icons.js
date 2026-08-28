/* ============================================================
   icons.js — line icons (window.Icons) + product glyphs (window.Glyphs)
   Binds the shared htm renderer as window.html (guarded for offline).
   ============================================================ */
(function () {
  "use strict";
  if (window.React && window.htm && !window.html) {
    window.html = window.htm.bind(window.React.createElement);
    window.h = window.React.createElement;
  }
  var html = window.html;

  // Generic line-icon wrapper
  function I(inner, vb) {
    return function (p) {
      p = p || {};
      var s = p.size || 20;
      return html`<svg width=${s} height=${s} viewBox=${vb || "0 0 24 24"} fill="none"
        stroke="currentColor" stroke-width=${p.sw || 1.7} stroke-linecap="round"
        stroke-linejoin="round" class=${p.class || ""} aria-hidden="true">${inner(p)}</svg>`;
    };
  }

  var Icons = {
    search: I(function () { return html`<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`; }),
    cart: I(function () { return html`<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2.1 12.4a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.3L21.5 7H6"/>`; }),
    bag: I(function () { return html`<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>`; }),
    heart: I(function () { return html`<path d="M12 20s-7-4.5-9.2-9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 21.2 11c-2.2 4.5-9.2 9-9.2 9z"/>`; }),
    user: I(function () { return html`<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>`; }),
    users: I(function () { return html`<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M17.5 19a6.5 6.5 0 0 0-2-4.6"/>`; }),
    menu: I(function () { return html`<path d="M3 6h18M3 12h18M3 18h18"/>`; }),
    star: function (p) { p = p || {}; var s = p.size || 18; return html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill=${p.fill || "currentColor"} class=${p.class || ""} aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 21.4 6.1 20.9l1.1-6.5L2.5 9.8l6.5-.95L12 2.5z"/></svg>`; },
    chevronRight: I(function () { return html`<path d="M9 6l6 6-6 6"/>`; }),
    chevronDown: I(function () { return html`<path d="M6 9l6 6 6-6"/>`; }),
    chevronLeft: I(function () { return html`<path d="M15 6l-6 6 6 6"/>`; }),
    arrowRight: I(function () { return html`<path d="M4 12h16M14 6l6 6-6 6"/>`; }),
    plus: I(function () { return html`<path d="M12 5v14M5 12h14"/>`; }),
    minus: I(function () { return html`<path d="M5 12h14"/>`; }),
    x: I(function () { return html`<path d="M6 6l12 12M18 6L6 18"/>`; }),
    truck: I(function () { return html`<path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5H18l3 3v3h-7.5z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>`; }),
    leaf: I(function () { return html`<path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 14z"/><path d="M4 20c4-6 8-8 12-9"/>`; }),
    shield: I(function () { return html`<path d="M12 3l7 2.5V11c0 5-3.5 8.5-7 9.8C8.5 19.5 5 16 5 11V5.5z"/><path d="M9.2 11.8l1.9 1.9 3.7-3.9"/>`; }),
    gift: I(function () { return html`<path d="M4 11h16v9H4z"/><path d="M3 7.5h18V11H3z"/><path d="M12 7.5V20"/><path d="M12 7.5C11 5 9 4.2 7.8 5.2 6.8 6 7.4 7.5 9 7.5z"/><path d="M12 7.5C13 5 15 4.2 16.2 5.2 17.2 6 16.6 7.5 15 7.5z"/>`; }),
    phone: I(function () { return html`<path d="M6 3.5c.6 2 .3 3-.6 3.9C6.8 10 8.5 11.7 11.6 13.6c.9-.9 1.9-1.2 3.9-.6l2.5 1.2c.5 1.6-.2 3.6-2 4.2C11 20 4 13 3.9 6.6 4.5 4.8 6.5 4.1 8.1 4.6z"/>`; }),
    mail: I(function () { return html`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>`; }),
    mapPin: I(function () { return html`<path d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 0 0-14 0c0 3.4 2.5 6.8 7 11z"/><circle cx="12" cy="10" r="2.4"/>`; }),
    check: I(function () { return html`<path d="M5 12.5l4 4 10-10"/>`; }),
    filter: I(function () { return html`<path d="M3 5h18l-7 8v5l-4 2v-7z"/>`; }),
    grid: I(function () { return html`<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>`; }),
    box: I(function () { return html`<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.4l8 4.2 8-4.2"/><path d="M12 11.6V21"/>`; }),
    tag: I(function () { return html`<path d="M4 4h7.5L20 12.5 12.5 20 4 11.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>`; }),
    gear: I(function () { return html`<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.2 4.2l1.9 1.9M17.9 17.9l1.9 1.9M2.5 12h2.6M18.9 12h2.6M4.2 19.8l1.9-1.9M17.9 6.1l1.9-1.9"/>`; }),
    rupee: I(function () { return html`<path d="M7 4h10M7 8h10M16 4c0 4-3.5 5.5-7 5.5H9l7 6.5"/>`; }),
    bell: I(function () { return html`<path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 5 2 6 2 6H4.5s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>`; }),
    logout: I(function () { return html`<path d="M14 4H6v16h8"/><path d="M10 12h10M16.5 8.5L20 12l-3.5 3.5"/>`; }),
    dots: I(function () { return html`<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>`; }),
    eye: I(function () { return html`<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>`; }),
    edit: I(function () { return html`<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>`; }),
    trash: I(function () { return html`<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>`; }),
    download: I(function () { return html`<path d="M12 3v12M7.5 10.5L12 15l4.5-4.5"/><path d="M4 20h16"/>`; }),
    external: I(function () { return html`<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 13v6H5V6h6"/>`; }),
    trendUp: I(function () { return html`<path d="M4 16l5-5 3.5 3.5L20 7"/><path d="M15 7h5v5"/>`; }),
    trendDown: I(function () { return html`<path d="M4 8l5 5 3.5-3.5L20 17"/><path d="M15 17h5v-5"/>`; }),
    clock: I(function () { return html`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`; }),
    sparkle: I(function () { return html`<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/>`; }),
    percent: I(function () { return html`<path d="M6 18L18 6"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/>`; })
  };

  /* ---------- Product glyphs (rich, dimensional illustrations) ----------
     Each glyph is a self-contained 120×120 SVG. Fills use gradients + a soft
     specular highlight + a grounding shadow for a premium, appetising look.
     Gradient IDs are generated per-render via uid() so multiple copies of the
     same glyph on one page never collide (SVG requires document-unique ids). */
  function wrap(inner) { return html`<svg width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inner}</svg>`; }

  var _gid = 0;
  function uid(p) { _gid += 1; return (p || "g") + _gid; }
  function shadow(cx, cy, rx, ry) {
    return html`<ellipse cx=${cx} cy=${cy} rx=${rx} ry=${ry} fill="rgba(36,21,5,0.13)"/>`;
  }
  // reusable soft sheen — a translucent white streak reading as a gentle light
  // reflection on the form. Uses an rgba() fill (not an opacity attribute) so it
  // composites identically in browsers and in the offline SVG rasteriser.
  function sheen(cx, cy, rx, ry, rot, op) {
    var o = op || 0.22;
    return html`<ellipse cx=${cx} cy=${cy} rx=${rx} ry=${ry}
      fill=${"rgba(255,255,255," + o + ")"}
      transform=${"rotate(" + (rot || 0) + " " + cx + " " + cy + ")"}/>`;
  }

  var Glyphs = {
    almond: function () {
      var b = uid("al");
      return wrap(html`<g>
        ${shadow(62, 101, 25, 6)}
        <defs>
          <linearGradient id=${b} x1="0.2" y1="0" x2="0.75" y2="1">
            <stop offset="0" stop-color="#F4E0AF"/><stop offset="0.5" stop-color="#E6C37D"/><stop offset="1" stop-color="#C4954A"/>
          </linearGradient>
        </defs>
        <path d="M60 18c17 8 25 27 21 47-3 17-14 27-21 31-7-4-18-14-21-31-4-20 4-39 21-47z" fill=${"url(#" + b + ")"} stroke="#B0833F" stroke-width="1"/>
        <path d="M60 27c-5 20-5 61 0 74" stroke="#A9773A" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M60 35c-8 11-9 27-5 41M60 35c8 11 9 27 5 41" stroke="#CFA75E" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.5"/>
        ${sheen(52, 45, 7, 15, -14)}
      </g>`);
    },
    cashew: function () {
      var b = uid("ca");
      return wrap(html`<g>
        ${shadow(60, 100, 30, 6)}
        <defs>
          <linearGradient id=${b} x1="0.15" y1="0.1" x2="0.8" y2="1">
            <stop offset="0" stop-color="#F7EBCB"/><stop offset="0.5" stop-color="#EBD69F"/><stop offset="1" stop-color="#D3B26B"/>
          </linearGradient>
        </defs>
        <path d="M38 42c-15 5-21 22-10 34 8 9 21 11 33 6 11-5 20-3 26 4 4-11-1-22-13-26-3-17-19-27-36-18z" fill=${"url(#" + b + ")"} stroke="#C7A05B" stroke-width="1"/>
        <path d="M46 54c-7 4-10 12-6 19" stroke="#BE9750" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.65"/>
        ${sheen(46, 52, 9, 5, -22)}
      </g>`);
    },
    pistachio: function () {
      var l = uid("pi"), r = uid("pi"), k = uid("pi");
      return wrap(html`<g>
        ${shadow(60, 101, 27, 6)}
        <defs>
          <linearGradient id=${l} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EFE3BC"/><stop offset="1" stop-color="#D3BC82"/></linearGradient>
          <linearGradient id=${r} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4E9C6"/><stop offset="1" stop-color="#DCC48C"/></linearGradient>
          <linearGradient id=${k} x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#AECB5F"/><stop offset="1" stop-color="#6E9236"/></linearGradient>
        </defs>
        <path d="M30 40c-5 23 8 46 30 48 4 0 6-3 4-6-14-18-16-35-12-47 1-4-3-7-7-5-8 4-13 7-15 10z" fill=${"url(#" + l + ")"} stroke="#C6A968" stroke-width="1"/>
        <path d="M90 40c5 23-8 46-30 48-4 0-6-3-4-6 14-18 16-35 12-47-1-4 3-7 7-5 8 4 13 7 15 10z" fill=${"url(#" + r + ")"} stroke="#CDB273" stroke-width="1"/>
        <path d="M52 48c-3 16 0 31 8 41 6-10 8-25 6-41-4-6-16-6-14 0z" fill=${"url(#" + k + ")"}/>
        <path d="M55 50c-2 8-1 15 1 22 3-6 4-15 3-22-1-3-3-3-4 0z" fill="#9A3E60" opacity="0.9"/>
        ${sheen(40, 46, 5, 12, -12)}
      </g>`);
    },
    walnut: function () {
      var b = uid("wa");
      return wrap(html`<g>
        ${shadow(60, 101, 30, 6)}
        <defs>
          <radialGradient id=${b} cx="0.4" cy="0.34" r="0.72"><stop offset="0" stop-color="#E7CD94"/><stop offset="0.6" stop-color="#CBA35B"/><stop offset="1" stop-color="#A87B3C"/></radialGradient>
        </defs>
        <circle cx="60" cy="60" r="40" fill=${"url(#" + b + ")"} stroke="#96682F" stroke-width="1.5"/>
        <path d="M60 21v78" stroke="#8A5C2C" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 29c-9 13-9 39 0 62M70 29c9 13 9 39 0 62" stroke="#A6793C" stroke-width="2.4" fill="none" opacity="0.8"/>
        <path d="M40 45c9 7 9 24 0 32M80 45c-9 7-9 24 0 32" stroke="#B58A50" stroke-width="2" fill="none" opacity="0.7"/>
        ${sheen(48, 44, 12, 9, -20)}
      </g>`);
    },
    date: function () {
      var b = uid("da");
      return wrap(html`<g>
        ${shadow(60, 103, 22, 5)}
        <defs>
          <linearGradient id=${b} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stop-color="#B47B43"/><stop offset="0.5" stop-color="#8A5326"/><stop offset="1" stop-color="#572F13"/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="60" rx="27" ry="43" fill=${"url(#" + b + ")"} stroke="#4A2810" stroke-width="1"/>
        <path d="M53 24c-7 18-7 54 3 72" stroke="#C89A64" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.5"/>
        <ellipse cx="70" cy="80" rx="6" ry="12" fill="#3C1F0C" opacity="0.35"/>
        ${sheen(52, 44, 7, 16, -6, 0.28)}
      </g>`);
    },
    raisin: function () {
      var g1 = uid("ra"), g2 = uid("ra"), g3 = uid("ra");
      var beads = [
        { cx: 45, cy: 50, rx: 15, ry: 13, rot: -18, g: g1, hx: 40, hy: 45 },
        { cx: 71, cy: 45, rx: 14, ry: 12, rot: 12, g: g2, hx: 66, hy: 40 },
        { cx: 58, cy: 69, rx: 16, ry: 13, rot: -8, g: g3, hx: 53, hy: 63 },
        { cx: 80, cy: 67, rx: 13, ry: 11, rot: 20, g: g1, hx: 76, hy: 62 },
        { cx: 40, cy: 73, rx: 12, ry: 11, rot: 8, g: g2, hx: 36, hy: 68 }
      ];
      return wrap(html`<g>
        ${shadow(60, 100, 30, 6)}
        <defs>
          <radialGradient id=${g1} cx="0.36" cy="0.3" r="0.75"><stop offset="0" stop-color="#7A5030"/><stop offset="1" stop-color="#3E2413"/></radialGradient>
          <radialGradient id=${g2} cx="0.36" cy="0.3" r="0.75"><stop offset="0" stop-color="#6E4526"/><stop offset="1" stop-color="#331B0D"/></radialGradient>
          <radialGradient id=${g3} cx="0.36" cy="0.3" r="0.75"><stop offset="0" stop-color="#835836"/><stop offset="1" stop-color="#452812"/></radialGradient>
        </defs>
        ${beads.map(function (d, i) {
          return html`<g key=${i} transform=${"rotate(" + d.rot + " " + d.cx + " " + d.cy + ")"}>
            <ellipse cx=${d.cx} cy=${d.cy} rx=${d.rx} ry=${d.ry} fill=${"url(#" + d.g + ")"}/>
            <ellipse cx=${d.hx} cy=${d.hy} rx="3" ry="2" fill="rgba(255,255,255,0.24)"/>
          </g>`;
        })}
      </g>`);
    },
    fig: function () {
      var sk = uid("fi"), fl = uid("fi");
      return wrap(html`<g>
        ${shadow(60, 101, 26, 6)}
        <defs>
          <linearGradient id=${sk} x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#7E4162"/><stop offset="1" stop-color="#48213B"/></linearGradient>
          <radialGradient id=${fl} cx="0.5" cy="0.52" r="0.55"><stop offset="0" stop-color="#F2B3C6"/><stop offset="0.7" stop-color="#DE87A5"/><stop offset="1" stop-color="#B85E82"/></radialGradient>
        </defs>
        <path d="M60 22c3 0 4 3 3 6 11 3 22 15 22 31 0 21-15 33-25 33S35 81 35 60c0-16 12-28 22-31-1-3 0-7 3-7z" fill=${"url(#" + sk + ")"} stroke="#3C1B31" stroke-width="1"/>
        <ellipse cx="60" cy="61" rx="15" ry="17" fill=${"url(#" + fl + ")"}/>
        <g fill="#F6DCA8"><path d="M60 50l1.4 3.2 3.4.3-2.6 2.2.8 3.3-3-1.8-3 1.8.8-3.3-2.6-2.2 3.4-.3z" opacity="0.9"/></g>
        <g fill="#C86E90"><circle cx="53" cy="61" r="1.6"/><circle cx="67" cy="61" r="1.6"/><circle cx="60" cy="70" r="1.6"/><circle cx="55" cy="54" r="1.4"/><circle cx="65" cy="54" r="1.4"/></g>
        <path d="M60 22c1-4 4-7 8-8-1 5-3 8-8 8z" fill="#6E9236"/>
        ${sheen(49, 41, 6, 9, -16)}
      </g>`);
    },
    apricot: function () {
      var b = uid("ap");
      return wrap(html`<g>
        ${shadow(60, 101, 27, 6)}
        <defs>
          <radialGradient id=${b} cx="0.4" cy="0.34" r="0.72"><stop offset="0" stop-color="#FAD08A"/><stop offset="0.55" stop-color="#F0A94A"/><stop offset="1" stop-color="#DB8127"/></radialGradient>
        </defs>
        <circle cx="60" cy="62" r="37" fill=${"url(#" + b + ")"} stroke="#C2701A" stroke-width="1"/>
        <path d="M60 27c-6 15-6 55 0 70" stroke="#C0701C" stroke-width="2.4" fill="none" opacity="0.6"/>
        <path d="M60 25c3-6 10-9 15-7-2 7-8 10-15 7z" fill="#6E9236"/>
        <path d="M60 25c-1-5-4-8-8-8 1 5 3 8 8 8z" fill="#5E8A2E"/>
        ${sheen(49, 49, 10, 12, -18)}
      </g>`);
    },
    saffron: function () {
      var glow = uid("sa");
      return wrap(html`<g>
        <defs><radialGradient id=${glow} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#E29A2C" stop-opacity="0.28"/><stop offset="1" stop-color="#E29A2C" stop-opacity="0"/></radialGradient></defs>
        <ellipse cx="60" cy="58" rx="40" ry="40" fill=${"url(#" + glow + ")"}/>
        <g stroke-linecap="round" fill="none">
          <path d="M40 86c6-27 16-42 24-60" stroke="#9E2222" stroke-width="4.2"/>
          <path d="M52 88c4-25 12-42 18-58" stroke="#C0342A" stroke-width="4.2"/>
          <path d="M66 88c2-23 6-44 8-60" stroke="#A82424" stroke-width="4.2"/>
          <path d="M79 84c-2-23-4-42-6-56" stroke="#C6402C" stroke-width="4.2"/>
          <path d="M40 86c-2 4 0 9 5 9" stroke="#9E2222" stroke-width="4.2"/>
        </g>
        <g stroke-linecap="round" fill="none" stroke="#E7A63A" stroke-width="4.2">
          <path d="M64 26c1-3 4-5 7-4"/><path d="M70 30c1-3 5-4 8-2"/><path d="M73 32c2-2 5-2 7 0"/>
        </g>
      </g>`);
    },
    gift: function () {
      var box = uid("gi"), lid = uid("gi"), rib = uid("gi");
      return wrap(html`<g>
        ${shadow(60, 102, 34, 6)}
        <defs>
          <linearGradient id=${box} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6A52"/><stop offset="1" stop-color="#173F2E"/></linearGradient>
          <linearGradient id=${lid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A5D48"/><stop offset="1" stop-color="#143026"/></linearGradient>
          <linearGradient id=${rib} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2CB74"/><stop offset="0.5" stop-color="#E0A63C"/><stop offset="1" stop-color="#C6851F"/></linearGradient>
        </defs>
        <rect x="31" y="53" width="58" height="43" rx="6" fill=${"url(#" + box + ")"}/>
        <rect x="26" y="41" width="68" height="16" rx="5" fill=${"url(#" + lid + ")"}/>
        <rect x="53" y="41" width="14" height="55" fill=${"url(#" + rib + ")"}/>
        <path d="M60 41c-7-13-19-15-23-6-3 8 5 13 23 6z" fill=${"url(#" + rib + ")"}/>
        <path d="M60 41c7-13 19-15 23-6 3 8-5 13-23 6z" fill=${"url(#" + rib + ")"}/>
        <circle cx="60" cy="41" r="5" fill="#F2CB74"/>
        <path d="M22 34l1.6 3.6 3.8.3-2.9 2.5.9 3.7-3.4-2-3.4 2 .9-3.7-2.9-2.5 3.8-.3z" fill="#F2CB74" opacity="0.85"/>
        <path d="M96 58l1.2 2.7 2.9.2-2.2 1.9.7 2.8-2.6-1.5-2.6 1.5.7-2.8-2.2-1.9 2.9-.2z" fill="#F2CB74" opacity="0.7"/>
      </g>`);
    }
  };

  window.Icons = Icons;
  window.Glyphs = Glyphs;
})();
