/* Prototype wiring. No network, no eval, no audio. Visual only. */
(function () {
  'use strict';
  var root = document.documentElement;
  var app = document.getElementById('app');
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var BARE = ['onb1', 'onb2', 'onb3', 'onb4', 'onb5', 'safety', 'player', 'studio'];
  var NAV = { today: 'today', journeys: 'journeys', jday: 'journeys', library: 'library', crew: 'crew' };
  var current = '';
  var lastFocus = null;

  function show(name, silent) {
    if (!document.querySelector('[data-screen="' + name + '"]')) name = 'onb1';
    current = name;
    screens.forEach(function (s) { s.classList.toggle('on', s.getAttribute('data-screen') === name); });
    app.setAttribute('data-view', BARE.indexOf(name) >= 0 ? 'bare' : 'tabs');
    document.querySelectorAll('.nav').forEach(function (n) {
      if (NAV[name] && n.getAttribute('data-go') === NAV[name]) n.setAttribute('aria-current', 'page');
      else n.removeAttribute('aria-current');
    });
    document.getElementById('miniplayer').hidden = !(name === 'today' && window.location.hash === '#today-playing');
    if (!silent) {
      if (window.location.hash !== '#' + name) window.history.replaceState(null, '', '#' + name);
      var main = document.getElementById('main');
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    var b = document.getElementById('themeBtn');
    var label = t === 'auto' ? 'Auto' : t === 'dark' ? 'Dark' : 'Light';
    b.textContent = 'Look: ' + label;
    b.setAttribute('aria-label', 'Change look: ' + label.toLowerCase());
  }

  function setStudio(on) {
    root.setAttribute('data-mode', on ? 'studio' : 'calm');
    var b = document.getElementById('studioBtn');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    show(on ? 'studio' : 'today');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-go]') : null;
    if (t) { show(t.getAttribute('data-go')); return; }
    var tab = e.target.closest ? e.target.closest('[data-tab]') : null;
    if (tab) { selectTab(tab); return; }
    var tc = e.target.closest ? e.target.closest('.tchip') : null;
    if (tc) {
      document.querySelectorAll('.tchip').forEach(function (c) { c.setAttribute('aria-checked', c === tc ? 'true' : 'false'); });
      return;
    }
    if (e.target.closest && e.target.closest('[data-close]')) closeSheet();
  });

  function selectTab(tab) {
    var key = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(function (b) { b.setAttribute('aria-selected', b === tab ? 'true' : 'false'); });
    document.querySelectorAll('.tabpanel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== key; });
  }

  document.getElementById('themeBtn').addEventListener('click', function () {
    var order = ['auto', 'light', 'dark'];
    var cur = root.getAttribute('data-theme') || 'auto';
    setTheme(order[(order.indexOf(cur) + 1) % 3]);
  });
  document.getElementById('studioBtn').addEventListener('click', function () {
    setStudio(root.getAttribute('data-mode') !== 'studio');
  });
  document.getElementById('backCalm').addEventListener('click', function () { setStudio(false); });

  var swaps = ['Evening Glide', 'Soft Piano Hour', 'Warm Glow'];
  var swapIdx = 0;
  document.getElementById('swapBtn').addEventListener('click', function () {
    swapIdx = (swapIdx + 1) % swaps.length;
    document.getElementById('d-title').textContent = swaps[swapIdx];
    document.getElementById('t-p').textContent = swaps[swapIdx];
  });

  document.querySelectorAll('[data-preview]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('previewStatus').textContent = 'Playing a short preview (visual only in this prototype).';
    });
  });

  var playBtn = document.getElementById('playBtn');
  playBtn.addEventListener('click', function () {
    var on = playBtn.getAttribute('aria-pressed') === 'true';
    playBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
    playBtn.textContent = on ? 'Play' : 'Pause';
    document.getElementById('playStatus').textContent = on ? 'Paused.' : 'Playing. Volume is capped for your safety.';
  });
  var fav = document.getElementById('favBtn');
  fav.addEventListener('click', function () {
    var on = fav.getAttribute('aria-pressed') === 'true';
    fav.setAttribute('aria-pressed', on ? 'false' : 'true');
    fav.textContent = on ? 'Favorite' : 'Saved';
  });
  var why = document.getElementById('whyBtn');
  why.addEventListener('click', function () {
    var open = why.getAttribute('aria-expanded') === 'true';
    why.setAttribute('aria-expanded', open ? 'false' : 'true');
    document.getElementById('whyBox').hidden = open;
  });

  function openSheet() {
    lastFocus = document.activeElement;
    var w = document.getElementById('sheetWrap');
    w.hidden = false;
    var first = w.querySelector('input,button');
    if (first) first.focus();
  }
  function closeSheet() {
    document.getElementById('sheetWrap').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.getElementById('mixBtn').addEventListener('click', openSheet);
  document.addEventListener('keydown', function (e) {
    var w = document.getElementById('sheetWrap');
    if (w.hidden) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key === 'Tab') {
      var f = Array.prototype.slice.call(w.querySelectorAll('input,button'));
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.querySelectorAll('.slider input').forEach(function (r) {
    r.addEventListener('input', function () { r.parentNode.querySelector('output').textContent = r.value; });
  });

  function greeting() {
    var h = new Date().getHours();
    return h < 12 ? 'Good morning.' : h < 17 ? 'Good afternoon.' : h < 21 ? 'Good evening.' : 'Hello, night owl.';
  }
  var qs = new URLSearchParams(window.location.search);
  if (qs.get('theme')) setTheme(qs.get('theme'));
  if (qs.get('motion') === 'off') root.setAttribute('data-motion', 'off');
  if (qs.get('greet') !== 'fixed') document.getElementById('t-today').textContent = greeting();
  if (qs.get('scale')) root.style.fontSize = qs.get('scale') + '%';
  if (qs.get('studio') === '1') { root.setAttribute('data-mode', 'studio'); document.getElementById('studioBtn').setAttribute('aria-pressed', 'true'); }

  var start = window.location.hash.replace('#', '').replace('-playing', '') || 'onb1';
  show(start, true);
  window.addEventListener('hashchange', function () {
    show(window.location.hash.replace('#', '').replace('-playing', '') || 'onb1', true);
  });
})();
