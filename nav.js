(function () {
  var IG = 'https://instagram.com/adgmerenguevault';
  var p = window.location.pathname;
  var isHome = p === '/' || p === '' || p === '/index.html';
  var isColl = /^\/collection/.test(p);
  var isFS   = /^\/for-sale/.test(p);
  var isSold = /^\/sold/.test(p);

  var B = "font-family:'Inter',sans-serif;font-size:11px;letter-spacing:.15em;text-transform:uppercase;";

  function lnk(href, label, col, w, active) {
    var s = B + 'color:' + col + ';font-weight:' + w + ';';
    if (active) {
      return '<span style="' + s + 'border-bottom:1px solid ' + col + ';padding-bottom:2px;">' + label + '</span>';
    }
    return '<a href="' + href + '" style="' + s + 'text-decoration:none;transition:color .2s;">' + label + '</a>';
  }

  var nav = document.createElement('nav');
  nav.id = 'mv-nav';
  nav.setAttribute('style',
    'position:fixed;top:0;left:0;right:0;z-index:200;height:72px;' +
    'display:flex;align-items:center;justify-content:space-between;padding:0 40px;' +
    'background:#0A0A0A;border-bottom:1px solid #1A1A1A;box-shadow:0 8px 32px rgba(0,0,0,.6);'
  );
  nav.innerHTML =
    '<a href="/" style="display:block;line-height:0;">' +
      '<img src="/logo.png" alt="ADG Merengue Vault" style="height:40px;width:auto;mix-blend-mode:screen;display:block;">' +
    '</a>' +
    '<div id="nav-links" style="display:flex;align-items:center;gap:24px;">' +
      lnk('/', 'HOME', '#A1A1AA', '600', isHome) +
      lnk('/collection/', 'COLLECTION', '#C8A75B', '700', isColl) +
      lnk('/for-sale/', 'FOR SALE', '#16A34A', '700', isFS) +
      lnk('/sold/', 'SOLD', '#DC2626', '700', isSold) +
      '<a href="' + IG + '" target="_blank" rel="noopener" style="background:#C8A75B;color:#0A0A0A;' + B +
        'font-weight:700;letter-spacing:.12em;padding:10px 20px;text-decoration:none;border-radius:2px;transition:background .2s;">' +
        'BUY · SELL · TRADE' +
      '</a>' +
    '</div>';

  var cs = document.currentScript;
  if (cs && cs.parentNode) {
    cs.parentNode.insertBefore(nav, cs);
  } else if (document.body) {
    document.body.insertBefore(nav, document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.insertBefore(nav, document.body.firstChild);
    });
  }
})();
