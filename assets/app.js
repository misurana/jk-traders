/* ============================================================
   app.js — hash router + mount + offline guard
   Renders StoreApp or AdminApp based on the URL hash.
   Loaded last; depends on all other assets/*.js.
   ============================================================ */
(function () {
  "use strict";
  var React = window.React, ReactDOM = window.ReactDOM;
  var rootEl = document.getElementById("root");

  /* ---- Offline guard ----
     React/ReactDOM/htm load from a CDN. If the first open is offline,
     those globals are missing and window.html was never bound. Show a
     calm, actionable message instead of a blank screen. */
  if (!React || !ReactDOM || !window.html) {
    if (rootEl) {
      rootEl.innerHTML =
        '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">' +
          '<div style="text-align:center;max-width:440px;font-family:\'Manrope\',system-ui,sans-serif;color:#6E6557;">' +
            '<div style="width:52px;height:52px;border-radius:15px;margin:0 auto 18px;background:linear-gradient(160deg,#235240,#143026);"></div>' +
            '<div style="font-family:\'Fraunces\',Georgia,serif;font-size:22px;color:#143026;font-weight:600;">Couldn’t load the prototype</div>' +
            '<p style="margin-top:12px;font-size:14px;line-height:1.6;">This build pulls React from a CDN the first time it opens, so it needs an internet connection. ' +
            'Connect and refresh the page, and it will run offline afterwards.</p>' +
          '</div>' +
        '</div>';
    }
    return;
  }

  var html = window.html;
  var useState = React.useState, useEffect = React.useEffect;

  /* ---- Hash → route object ----
     #/                    → store home
     #/shop               → store shop (all)
     #/shop/almonds       → store shop, category=almonds
     #/admin              → admin dashboard
     #/admin/orders       → admin orders (products|customers|categories|reviews|settings)
  */
  function parseHash() {
    var raw = (window.location.hash || "").replace(/^#\/?/, "");
    var parts = raw.split("/").filter(Boolean);
    if (parts[0] === "admin") {
      return { section: "admin", adminPage: parts[1] || "dashboard" };
    }
    if (parts[0] === "shop") {
      return { section: "store", page: "shop", category: parts[1] || "all" };
    }
    return { section: "store", page: "home", category: "all" };
  }

  function navigate(hash) {
    if (window.location.hash === hash) {
      window.scrollTo(0, 0);
    } else {
      window.location.hash = hash;
    }
  }

  function Root() {
    var hs = useState(parseHash());
    var route = hs[0], setRoute = hs[1];
    useEffect(function () {
      function onHash() { setRoute(parseHash()); window.scrollTo(0, 0); }
      window.addEventListener("hashchange", onHash);
      return function () { window.removeEventListener("hashchange", onHash); };
    }, []);

    if (route.section === "admin") {
      return html`<${window.Admin.AdminApp} route=${route} navigate=${navigate} />`;
    }
    return html`<${window.Store.StoreApp} route=${route} navigate=${navigate} />`;
  }

  var boot = document.getElementById("boot");
  if (boot && boot.parentNode) boot.parentNode.removeChild(boot);

  ReactDOM.createRoot(rootEl).render(html`<${Root} />`);
})();
