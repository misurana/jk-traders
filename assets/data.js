/* ============================================================
   data.js — brand, catalog, orders, customers, analytics
   Everything lives on window.NUVANA (shared across scripts).
   ============================================================ */
(function () {
  "use strict";

  // ---- Formatting helpers (Indian numbering) ----
  function fmtINR(n) {
    var s = Math.round(n).toString();
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    if (rest) last3 = "," + last3;
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return "₹" + rest + last3;
  }
  function fmtK(n) {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + "Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "k";
    return "₹" + n;
  }

  // ---- Categories ----
  var categories = [
    { id: "almonds",    name: "Almonds",      glyph: "almond",    tint: "#F3E7CE", count: 14 },
    { id: "cashews",    name: "Cashews",      glyph: "cashew",    tint: "#EEE6D2", count: 11 },
    { id: "pistachios", name: "Pistachios",   glyph: "pistachio", tint: "#E4EBD3", count: 9  },
    { id: "walnuts",    name: "Walnuts",      glyph: "walnut",    tint: "#EADfce", count: 8  },
    { id: "dried",      name: "Dried Fruits", glyph: "fig",       tint: "#EEDDE0", count: 17 },
    { id: "gifting",    name: "Gift Boxes",   glyph: "gift",      tint: "#F6E6C7", count: 6  }
  ];

  // ---- Product gradients (media backgrounds) ----
  var G = {
    almond:    ["#F6EAD0", "#E7D3A9"],
    cashew:    ["#F3ECDC", "#E4D6BB"],
    pistachio: ["#E7EFD6", "#CDDCAF"],
    walnut:    ["#EEE0CB", "#D8BE98"],
    date:      ["#EAD9C6", "#CFA883"],
    raisin:    ["#E9E1CE", "#CBB98F"],
    fig:       ["#EFDDE4", "#D6A9BC"],
    apricot:   ["#FBE7C7", "#F2C583"],
    saffron:   ["#F7E3C4", "#EAB05A"],
    gift:      ["#F3E6C9", "#E4C88E"]
  };

  // ---- Products ----
  // price/mrp in INR; unit = the sold weight; glyph maps to icons.js
  var products = [
    { id:"p01", name:"California Almonds",         cat:"almonds",    glyph:"almond",    grad:G.almond, img:"",    price:399, mrp:460, unit:"250 g", rating:4.8, reviews:214, stock:340, sold:1820, flags:["best"],  origin:"California, USA", blurb:"Plump, sweet and crunchy — our everyday hero, sorted by hand and freshly packed." },
    { id:"p02", name:"Kashmiri Mamra Almonds",     cat:"almonds",    glyph:"almond",    grad:G.almond, img:"",    price:549, mrp:0,   unit:"250 g", rating:4.9, reviews:96,  stock:120, sold:430,  flags:["new"],   origin:"Kashmir, India", blurb:"Rare, oil-rich mamra almonds prized in Ayurveda — denser, richer, more filling." },
    { id:"p03", name:"Roasted Salted Cashews",     cat:"cashews",    glyph:"cashew",    grad:G.cashew, img:"",    price:449, mrp:520, unit:"250 g", rating:4.7, reviews:308, stock:280, sold:2140, flags:["best","sale"], origin:"Mangalore, India", blurb:"Slow-roasted in small batches with a whisper of sea salt. Dangerously snackable." },
    { id:"p04", name:"Jumbo Cashews W240",         cat:"cashews",    glyph:"cashew",    grad:G.cashew, img:"",    price:599, mrp:0,   unit:"250 g", rating:4.6, reviews:74,  stock:64,  sold:520,  flags:[],        origin:"Goa, India", blurb:"Grade W240 whole kernels — big, creamy and unbroken. The gifting-grade cashew." },
    { id:"p05", name:"Iranian Pistachios",         cat:"pistachios", glyph:"pistachio", grad:G.pistachio, img:"", price:649, mrp:720, unit:"250 g", rating:4.8, reviews:181, stock:190, sold:1360, flags:["best"],  origin:"Kerman, Iran", blurb:"Long Akbari pistachios, roasted and lightly salted. Vivid green, buttery finish." },
    { id:"p06", name:"Salted Pistachios",          cat:"pistachios", glyph:"pistachio", grad:G.pistachio, img:"", price:559, mrp:0,   unit:"250 g", rating:4.5, reviews:120, stock:8,   sold:900,  flags:["low"],   origin:"Kerman, Iran", blurb:"The classic table pistachio — easy-open shells, perfectly salted." },
    { id:"p07", name:"Kashmiri Walnut Kernels",    cat:"walnuts",    glyph:"walnut",    grad:G.walnut, img:"",    price:699, mrp:0,   unit:"250 g", rating:4.7, reviews:88,  stock:150, sold:610,  flags:["new"],   origin:"Kashmir, India", blurb:"Light-halves walnut kernels — no shelling, no bitterness. Brain food, upgraded." },
    { id:"p08", name:"Inshell Walnuts",            cat:"walnuts",    glyph:"walnut",    grad:G.walnut, img:"",    price:449, mrp:0,   unit:"500 g", rating:4.4, reviews:52,  stock:210, sold:340,  flags:[],        origin:"Chile", blurb:"Fresh-cracked at home — that first snap is half the pleasure." },
    { id:"p09", name:"Medjool Dates",              cat:"dried",      glyph:"date",      grad:G.date, img:"",      price:499, mrp:560, unit:"250 g", rating:4.9, reviews:265, stock:170, sold:1980, flags:["best","sale"], origin:"Jordan Valley", blurb:"Soft, caramel-toffee Medjools — nature's dessert, no sugar added." },
    { id:"p10", name:"Afghan Green Raisins",       cat:"dried",      glyph:"raisin",    grad:G.raisin, img:"",    price:249, mrp:0,   unit:"250 g", rating:4.5, reviews:143, stock:0,   sold:1120, flags:["out"],   origin:"Kandahar, Afghanistan", blurb:"Long, seedless and tart-sweet. The ones that vanish from the bowl first." },
    { id:"p11", name:"Turkish Dried Figs",         cat:"dried",      glyph:"fig",       grad:G.fig, img:"",       price:399, mrp:0,   unit:"200 g", rating:4.6, reviews:97,  stock:130, sold:520,  flags:[],        origin:"Aydin, Turkey", blurb:"Sun-dried Anjeer, soft and jammy with a honeyed seed crunch." },
    { id:"p12", name:"Dried Apricots",             cat:"dried",      glyph:"apricot",   grad:G.apricot, img:"",   price:329, mrp:0,   unit:"250 g", rating:4.4, reviews:69,  stock:95,  sold:410,  flags:[],        origin:"Hunza Valley", blurb:"Tangy, chewy Hunza apricots — sun-dried, unsulphured, honest." },
    { id:"p13", name:"Pure Mongra Saffron",        cat:"gifting",    glyph:"saffron",   grad:G.saffron, img:"",   price:449, mrp:0,   unit:"1 g",   rating:4.9, reviews:210, stock:75,  sold:1450, flags:["best","new"], origin:"Pampore, Kashmir", blurb:"All-red Mongra threads, grade A1 — a pinch colours a whole pot of kheer." },
    { id:"p14", name:"Signature Gift Hamper",      cat:"gifting",    glyph:"gift",      grad:G.gift, img:"",      price:1299,mrp:1499,unit:"box",   rating:4.8, reviews:132, stock:40,  sold:760,  flags:["best","sale"], origin:"Assembled in India", blurb:"Six of our finest, boxed with a handwritten note. The gift people remember." }
  ];

  // ---- Analytics: KPIs ----
  var kpis = [
    { key:"revenue",  label:"Revenue",        value:842650, display:fmtK(842650), delta:+12.4, ico:"rupee",  tint:"#EAF1EA", color:"#235240",
      spark:[38,42,40,47,52,49,58,61,57,66,72,79] },
    { key:"orders",   label:"Orders",         value:1284,   display:"1,284",       delta:+8.1,  ico:"bag",    tint:"#FBEFD6", color:"#C9821B",
      spark:[52,55,51,60,58,63,61,67,72,70,78,84] },
    { key:"customers",label:"New Customers",  value:612,    display:"612",         delta:+5.6,  ico:"users",  tint:"#F7E4EC", color:"#B23A6B",
      spark:[30,33,31,29,34,38,36,41,39,44,47,49] },
    { key:"aov",      label:"Avg Order Value",value:656,    display:fmtINR(656),   delta:-1.8,  ico:"cart",   tint:"#E5EEF7", color:"#3A6EA5",
      spark:[62,64,63,61,60,62,59,61,60,58,59,57] }
  ];

  // ---- Revenue area chart (last 12 weeks): current vs previous period ----
  var revenueSeries = [
    { label:"W1",  now:118, prev:96  }, { label:"W2",  now:132, prev:104 },
    { label:"W3",  now:124, prev:118 }, { label:"W4",  now:151, prev:122 },
    { label:"W5",  now:168, prev:139 }, { label:"W6",  now:159, prev:147 },
    { label:"W7",  now:182, prev:151 }, { label:"W8",  now:201, prev:162 },
    { label:"W9",  now:193, prev:171 }, { label:"W10", now:224, prev:184 },
    { label:"W11", now:248, prev:196 }, { label:"W12", now:271, prev:210 }
  ]; // values in ₹thousands

  // ---- Orders by month (bar) ----
  var ordersByMonth = [
    { m:"Jan", v:74 }, { m:"Feb", v:82 }, { m:"Mar", v:96 }, { m:"Apr", v:88 },
    { m:"May", v:104 }, { m:"Jun", v:118 }, { m:"Jul", v:132 }, { m:"Aug", v:146 },
    { m:"Sep", v:128 }, { m:"Oct", v:158 }, { m:"Nov", v:184 }, { m:"Dec", v:212 }
  ];

  // ---- Category split (donut) ----
  var categorySplit = [
    { name:"Almonds",      value:32, color:"#235240" },
    { name:"Pistachios",   value:22, color:"#E29A2C" },
    { name:"Cashews",      value:18, color:"#B23A6B" },
    { name:"Dried Fruits", value:14, color:"#3A6EA5" },
    { name:"Walnuts",      value:9,  color:"#8A9A5B" },
    { name:"Gifting",      value:5,  color:"#C97B4A" }
  ];

  // ---- Top products (admin dashboard) ----
  var topProducts = [
    { id:"p03", units:2140, revenue:961260, share:100 },
    { id:"p09", units:1980, revenue:987020, share:92 },
    { id:"p01", units:1820, revenue:726180, share:85 },
    { id:"p13", units:1450, revenue:650550, share:68 },
    { id:"p05", units:1360, revenue:882640, share:63 }
  ];

  // ---- Orders ----
  var orders = [
    { id:"NX-24817", customer:"Aarav Sharma",     city:"Mumbai",    date:"28 Aug 2026", items:3, total:1497, status:"processing", pay:"UPI",         channel:"Web" },
    { id:"NX-24816", customer:"Diya Nair",        city:"Kochi",     date:"28 Aug 2026", items:1, total:1299, status:"pending",    pay:"COD",         channel:"Web" },
    { id:"NX-24815", customer:"Kabir Mehta",      city:"Ahmedabad", date:"27 Aug 2026", items:5, total:2646, status:"shipped",    pay:"Card",        channel:"App" },
    { id:"NX-24814", customer:"Ananya Rao",       city:"Bengaluru", date:"27 Aug 2026", items:2, total:948,  status:"delivered",  pay:"UPI",         channel:"Web" },
    { id:"NX-24813", customer:"Vivaan Gupta",     city:"Delhi",     date:"27 Aug 2026", items:4, total:2196, status:"delivered",  pay:"UPI",         channel:"App" },
    { id:"NX-24812", customer:"Isha Kulkarni",    city:"Pune",      date:"26 Aug 2026", items:1, total:649,  status:"shipped",    pay:"Card",        channel:"Web" },
    { id:"NX-24811", customer:"Rohan Iyer",       city:"Chennai",   date:"26 Aug 2026", items:6, total:3294, status:"processing", pay:"Net Banking", channel:"Web" },
    { id:"NX-24810", customer:"Meera Joshi",      city:"Jaipur",    date:"25 Aug 2026", items:2, total:1098, status:"delivered",  pay:"UPI",         channel:"App" },
    { id:"NX-24809", customer:"Aditya Verma",     city:"Lucknow",   date:"25 Aug 2026", items:3, total:1647, status:"cancelled",  pay:"COD",         channel:"Web" },
    { id:"NX-24808", customer:"Saanvi Reddy",     city:"Hyderabad", date:"24 Aug 2026", items:1, total:449,  status:"delivered",  pay:"UPI",         channel:"Web" },
    { id:"NX-24807", customer:"Arjun Malhotra",   city:"Chandigarh",date:"24 Aug 2026", items:4, total:2246, status:"shipped",    pay:"Card",        channel:"App" },
    { id:"NX-24806", customer:"Tara Menezes", city:"Goa", date:"23 Aug 2026", items:2, total:1198, status:"delivered", pay:"UPI", channel:"Web" }
  ];

  // ---- Customers ----
  var customers = [
    { id:"c1", name:"Aarav Sharma",   email:"aarav.sharma@gmail.com",   city:"Mumbai",    orders:14, spent:18640, since:"Mar 2024", tier:"Gold",     color:"#235240" },
    { id:"c2", name:"Diya Nair",      email:"diya.nair@outlook.com",    city:"Kochi",     orders:6,  spent:7420,  since:"Jan 2025", tier:"Silver",   color:"#B23A6B" },
    { id:"c3", name:"Kabir Mehta",    email:"kabir.mehta@gmail.com",    city:"Ahmedabad", orders:22, spent:31280, since:"Aug 2023", tier:"Platinum", color:"#C9821B" },
    { id:"c4", name:"Ananya Rao",     email:"ananya.rao@gmail.com",     city:"Bengaluru", orders:9,  spent:11360, since:"Nov 2024", tier:"Gold",     color:"#3A6EA5" },
    { id:"c5", name:"Vivaan Gupta",   email:"vivaan.g@yahoo.com",       city:"Delhi",     orders:4,  spent:4980,  since:"Apr 2025", tier:"Silver",   color:"#8A9A5B" },
    { id:"c6", name:"Isha Kulkarni",  email:"isha.k@gmail.com",         city:"Pune",      orders:17, spent:22140, since:"Jun 2024", tier:"Gold",     color:"#C97B4A" },
    { id:"c7", name:"Rohan Iyer",     email:"rohan.iyer@gmail.com",     city:"Chennai",   orders:3,  spent:5490,  since:"Jul 2025", tier:"Silver",   color:"#235240" },
    { id:"c8", name:"Meera Joshi",    email:"meera.joshi@gmail.com",    city:"Jaipur",    orders:28, spent:38920, since:"Feb 2023", tier:"Platinum", color:"#B23A6B" }
  ];

  // ---- Reviews (admin moderation) ----
  var reviews = [
    { id:"r1", product:"p09", name:"Meera Joshi",   rating:5, date:"27 Aug 2026", status:"published", text:"The Medjools arrived soft and fresh — genuinely the best I've had outside of Dubai." },
    { id:"r2", product:"p03", name:"Rohan Iyer",    rating:4, date:"26 Aug 2026", status:"pending",   text:"Great roast and not too salty. Would love a larger 500g pack option." },
    { id:"r3", product:"p13", name:"Ananya Rao",    rating:5, date:"26 Aug 2026", status:"published", text:"A pinch coloured my entire kheer a deep gold. Real Kashmiri saffron, you can smell it." },
    { id:"r4", product:"p01", name:"Vivaan Gupta",  rating:5, date:"25 Aug 2026", status:"pending",   text:"Crunchy and sweet, packing was sealed well. Reordering already." },
    { id:"r5", product:"p05", name:"Kabir Mehta",   rating:4, date:"24 Aug 2026", status:"published", text:"Vivid green pistachios, buttery. Shells open easily. Slightly pricey but worth it." },
    { id:"r6", product:"p10", name:"Isha Kulkarni", rating:2, date:"23 Aug 2026", status:"pending",   text:"Tasty but arrived a day late and the pack was under-filled. Please check." }
  ];

  var testimonials = [
    { q:"I've been gifting Nuvana hampers to clients for two Diwalis now. The packaging alone makes people think I spent twice as much.", who:"Kabir Mehta — Platinum member, Ahmedabad" }
  ];

  // ---- Lookups ----
  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });
  function product(id) { return byId[id]; }

  window.NUVANA = {
    brand: { name:"Nuvana", tagline:"Premium Dry Fruits & Nuts", est:"EST · 2019", phone:"+91 98200 41000" },
    fmtINR: fmtINR,
    fmtK: fmtK,
    categories: categories,
    products: products,
    product: product,
    kpis: kpis,
    revenueSeries: revenueSeries,
    ordersByMonth: ordersByMonth,
    categorySplit: categorySplit,
    topProducts: topProducts,
    orders: orders,
    customers: customers,
    reviews: reviews,
    testimonials: testimonials
  };
})();
