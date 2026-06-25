// Smooth inertia scroll for physical mouse wheels (deltaMode === 1 = line mode).
// Trackpads already send pixel-level events (deltaMode === 0) — we skip those.
// Skips scroll inside lightbox / any scrollable container so it doesn't interfere.
(function () {
  var tgt = 0, cur = 0, raf = 0;

  function sync() { tgt = cur = window.scrollY; }
  sync();

  // Keep in sync when user clicks anchor links / programmatic scrolls
  window.addEventListener('scroll', function () { if (!raf) sync(); }, { passive: true });

  document.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return; // pinch-zoom — never intercept
    if (e.deltaMode !== 1) return; // 0 = pixel (trackpad, already smooth), 2 = page (mouse page-up/dn)

    // Skip if the event originates inside a scrollable element (lightbox, drawer, etc.)
    var el = e.target;
    while (el && el !== document.body) {
      var s = getComputedStyle(el);
      var oy = s.overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return;
      el = el.parentElement;
    }

    e.preventDefault();
    var max = document.body.scrollHeight - window.innerHeight;
    tgt = Math.max(0, Math.min(tgt + e.deltaY * 38, max));
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: false });

  function step() {
    cur += (tgt - cur) * 0.13;
    window.scrollTo(0, cur);
    if (Math.abs(tgt - cur) > 0.5) {
      raf = requestAnimationFrame(step);
    } else {
      cur = tgt;
      raf = 0;
    }
  }
})();
