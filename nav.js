(function () {
  var IG = 'https://instagram.com/adgmerenguevault';
  var p = window.location.pathname;
  var isHome = p === '/' || p === '' || p === '/index.html';
  var isColl = /^\/collection/.test(p);
  var isFS   = /^\/for-sale/.test(p);
  var isSold = /^\/sold/.test(p);

  // Translation helper — falls back to default strings if i18n.js hasn't loaded
  var T = window.MV_T || function (k) {
    var D = {
      'nav.home': 'HOME', 'nav.collection': 'COLLECTION', 'nav.forsale': 'FOR SALE',
      'nav.sold': 'SOLD', 'nav.cta': 'BUY · SELL · TRADE',
      'nav.navigation': 'Navigation', 'nav.tagline': 'THE WHITE SIDE OF FOOTBALL',
    };
    return D[k] || k;
  };

  var B = "font-family:'Inter',sans-serif;font-size:11px;letter-spacing:.15em;text-transform:uppercase;";

  function lnk(href, label, col, w, active) {
    var s = B + 'color:' + col + ';font-weight:' + w + ';';
    if (active) {
      return '<span style="' + s + 'border-bottom:1px solid ' + col + ';padding-bottom:2px;">' + label + '</span>';
    }
    return '<a href="' + href + '" style="' + s + 'text-decoration:none;transition:color .2s;">' + label + '</a>';
  }

  // ── Mobile drawer link (large, stacked) ──
  function mlnk(href, label, col, active) {
    var base = "display:flex;align-items:center;justify-content:space-between;" +
      "font-family:'Inter',sans-serif;font-size:17px;font-weight:700;letter-spacing:.12em;" +
      "text-transform:uppercase;text-decoration:none;padding:18px 4px;" +
      "border-bottom:1px solid #161616;color:" + col + ";";
    var arrow = active
      ? '<span style="font-size:11px;color:' + col + ';">●</span>'
      : '<span style="font-size:18px;color:#3A3A3A;">→</span>';
    if (active) base += 'background:linear-gradient(90deg,rgba(255,255,255,.04),transparent);';
    return '<a href="' + href + '" class="mv-mlink" style="' + base + '">' +
      '<span>' + label + '</span>' + arrow + '</a>';
  }

  // ── Language switcher pills ──
  var LANGS = ['en', 'it', 'es', 'de'];
  var curLang = window.MV_LANG || 'en';

  function langPillsDesktop() {
    return '<div id="mv-lang" style="display:flex;align-items:center;gap:3px;margin-left:10px;padding-left:14px;border-left:1px solid #2A2A2A;">' +
      LANGS.map(function (l) {
        var active = l === curLang;
        var s = "font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;" +
          "padding:5px 7px;border-radius:2px;cursor:pointer;border:none;line-height:1;" +
          (active
            ? 'background:rgba(201,162,75,.14);color:#C9A24B;box-shadow:0 0 0 1px #C9A24B;'
            : 'background:none;color:rgba(255,255,255,.32);box-shadow:0 0 0 1px rgba(255,255,255,.14);');
        return '<button data-setlang="' + l + '" style="' + s + '">' + l.toUpperCase() + '</button>';
      }).join('') +
    '</div>';
  }

  function langPillsMobile() {
    return '<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:18px 0 6px;">' +
      LANGS.map(function (l) {
        var active = l === curLang;
        var s = "font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;" +
          "padding:8px 14px;border-radius:3px;cursor:pointer;border:none;flex:1;" +
          (active
            ? 'background:rgba(201,162,75,.14);color:#C9A24B;box-shadow:0 0 0 1px #C9A24B;'
            : 'background:#111;color:rgba(255,255,255,.4);box-shadow:0 0 0 1px rgba(255,255,255,.1);');
        return '<button data-setlang="' + l + '" style="' + s + '">' + l.toUpperCase() + '</button>';
      }).join('') +
    '</div>';
  }

  // ── Injected styles: everything responsive lives here so desktop is untouched ──
  var style = document.createElement('style');
  style.id = 'mv-nav-style';
  style.textContent =
    '#mv-burger{display:none;}' +
    '#mv-drawer{position:fixed;top:0;left:0;bottom:0;width:min(82vw,340px);z-index:1002;' +
      'background:#0B0B0C;border-right:1px solid #1C1C1C;box-shadow:24px 0 60px rgba(0,0,0,.7);' +
      'transform:translateX(-100%);transition:transform .34s cubic-bezier(.22,.7,.2,1);' +
      'display:flex;flex-direction:column;padding:22px 22px 28px;overflow-y:auto;' +
      '-webkit-overflow-scrolling:touch;}' +
    '#mv-drawer.open{transform:translateX(0);}' +
    '#mv-overlay{position:fixed;inset:0;z-index:1001;background:rgba(0,0,0,.55);' +
      'backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .3s ease;}' +
    '#mv-overlay.open{opacity:1;pointer-events:auto;}' +
    '.mv-mlink:active{background:rgba(255,255,255,.05)!important;}' +
    '@media (max-width:900px){' +
      '#mv-nav{padding:0 18px!important;height:62px!important;}' +
      '#mv-nav #nav-links{display:none!important;}' +
      '#mv-burger{display:inline-flex!important;}' +
      '#mv-nav img{height:40px!important;}' +
    '}' +
    '@media (min-width:901px){' +
      '#mv-drawer,#mv-overlay{display:none!important;}' +
    '}';
  document.head.appendChild(style);

  // ── Top bar ──
  var nav = document.createElement('nav');
  nav.id = 'mv-nav';
  nav.setAttribute('style',
    'position:fixed;top:0;left:0;right:0;z-index:200;height:72px;' +
    'display:flex;align-items:center;justify-content:space-between;padding:0 40px;' +
    'background:#0A0A0A;border-bottom:1px solid #1A1A1A;box-shadow:0 8px 32px rgba(0,0,0,.6);'
  );
  nav.innerHTML =
    '<a href="/" style="display:block;line-height:0;">' +
      '<img src="/logo.png" alt="ADG Merengue Vault" style="height:48px;width:auto;display:block;">' +
    '</a>' +
    '<div id="nav-links" style="display:flex;align-items:center;gap:24px;">' +
      lnk('/', T('nav.home'), '#A1A1AA', '600', isHome) +
      lnk('/collection/', T('nav.collection'), '#C8A75B', '700', isColl) +
      lnk('/for-sale/', T('nav.forsale'), '#16A34A', '700', isFS) +
      lnk('/sold/', T('nav.sold'), '#DC2626', '700', isSold) +
      '<a href="' + IG + '" target="_blank" rel="noopener" style="background:#C8A75B;color:#0A0A0A;' + B +
        'font-weight:700;letter-spacing:.12em;padding:10px 20px;text-decoration:none;border-radius:2px;transition:background .2s;">' +
        T('nav.cta') +
      '</a>' +
      langPillsDesktop() +
    '</div>' +
    // hamburger (mobile only)
    '<button id="mv-burger" aria-label="Apri menu" aria-expanded="false" ' +
      'style="background:none;border:0;cursor:pointer;width:42px;height:42px;align-items:center;' +
      'justify-content:center;flex-direction:column;gap:5px;padding:0;margin-right:-6px;">' +
      '<span class="mv-bar" style="display:block;width:24px;height:2px;background:#EDEDED;border-radius:2px;transition:transform .3s,opacity .3s;"></span>' +
      '<span class="mv-bar" style="display:block;width:24px;height:2px;background:#EDEDED;border-radius:2px;transition:transform .3s,opacity .3s;"></span>' +
      '<span class="mv-bar" style="display:block;width:24px;height:2px;background:#EDEDED;border-radius:2px;transition:transform .3s,opacity .3s;"></span>' +
    '</button>';

  // ── Drawer + overlay ──
  var overlay = document.createElement('div');
  overlay.id = 'mv-overlay';

  var drawer = document.createElement('aside');
  drawer.id = 'mv-drawer';
  drawer.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
      '<img src="/logo.png" alt="ADG Merengue Vault" style="height:36px;width:auto;mix-blend-mode:screen;">' +
      '<button id="mv-close" aria-label="Chiudi menu" style="background:none;border:0;color:#8A8A8A;' +
        'font-size:30px;line-height:1;cursor:pointer;padding:4px 6px;">×</button>' +
    '</div>' +
    '<p style="font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;' +
      'color:#5A5A5A;margin:6px 2px 14px;">' + T('nav.navigation') + '</p>' +
    '<nav style="display:flex;flex-direction:column;">' +
      mlnk('/', T('nav.home'), '#EDEDED', isHome) +
      mlnk('/collection/', T('nav.collection'), '#C8A75B', isColl) +
      mlnk('/for-sale/', T('nav.forsale'), '#16A34A', isFS) +
      mlnk('/sold/', T('nav.sold'), '#DC2626', isSold) +
    '</nav>' +
    langPillsMobile() +
    '<a href="' + IG + '" target="_blank" rel="noopener" ' +
      'style="margin-top:12px;display:block;text-align:center;background:#C8A75B;color:#0A0A0A;' +
      "font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;" +
      'padding:15px;text-decoration:none;border-radius:3px;">' + T('nav.cta') + '</a>' +
    '<a href="' + IG + '" target="_blank" rel="noopener" ' +
      "style=\"margin-top:14px;display:flex;align-items:center;gap:8px;justify-content:center;color:#7A7A7A;" +
      "font-family:'Inter',sans-serif;font-size:12px;letter-spacing:.06em;text-decoration:none;\">" +
      '<span style="font-size:15px;">◎</span> @adgmerenguevault</a>' +
    '<div style="flex:1;"></div>' +
    '<p style="font-family:\'Space Mono\',monospace;font-size:10px;letter-spacing:.15em;color:#3A3A3A;' +
      'text-align:center;margin-top:20px;">' + T('nav.tagline') + '</p>';

  // ── Toggle logic ──
  function setOpen(open) {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    var burger = document.getElementById('mv-burger');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    var bars = document.querySelectorAll('#mv-burger .mv-bar');
    if (bars.length === 3) {
      bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      bars[1].style.opacity = open ? '0' : '1';
      bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  }

  function wire() {
    var burger = document.getElementById('mv-burger');
    if (burger) burger.addEventListener('click', function () { setOpen(!drawer.classList.contains('open')); });
    overlay.addEventListener('click', function () { setOpen(false); });
    var close = document.getElementById('mv-close');
    if (close) close.addEventListener('click', function () { setOpen(false); });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && drawer.classList.contains('open')) setOpen(false);
    });
    // Wire language pills (both desktop nav and mobile drawer) via event listeners
    nav.querySelectorAll('[data-setlang]').forEach(function (btn) {
      btn.addEventListener('click', function () { if (window.MV_setLang) window.MV_setLang(btn.getAttribute('data-setlang')); });
    });
    drawer.querySelectorAll('[data-setlang]').forEach(function (btn) {
      btn.addEventListener('click', function () { if (window.MV_setLang) window.MV_setLang(btn.getAttribute('data-setlang')); });
    });
  }

  function mount() {
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    wire();
  }

  var cs = document.currentScript;
  if (cs && cs.parentNode) {
    cs.parentNode.insertBefore(nav, cs);
  } else if (document.body) {
    document.body.insertBefore(nav, document.body.firstChild);
  }
  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (!nav.parentNode) document.body.insertBefore(nav, document.body.firstChild);
      mount();
    });
  }
})();
