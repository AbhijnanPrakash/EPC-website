/* ==========================================================================
   ETERNAL POWER — Services page behaviour
   Companion to static/js/v2.js, which already handles the header, drawer,
   scroll reveals and counters. This file adds only the phase navigation.

   Without JS the buttons remain in-page anchors to each phase's first card,
   so the section stays fully usable.
   ========================================================================== */
(function () {
  'use strict';

  var nav = document.getElementById('svPhases');
  var grid = document.getElementById('svGrid');
  if (!nav || !grid) return;

  var buttons = Array.prototype.slice.call(nav.querySelectorAll('[data-phase]'));
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-phase]'));
  if (!buttons.length || !cards.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setCurrent(phase) {
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-current', btn.dataset.phase === phase ? 'true' : 'false');
    });
  }

  /* Click / activate → bring that phase's first card into view */
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var phase = btn.dataset.phase;
      var target = cards.filter(function (c) { return c.dataset.phase === phase; })[0];
      setCurrent(phase);
      if (!target) return;
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center'
      });
    });
  });

  /* Scrolling through the grid keeps the indicator in sync */
  if ('IntersectionObserver' in window) {
    var visible = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target, entry.isIntersecting);
      });
      // The topmost visible card decides the current phase
      for (var i = 0; i < cards.length; i++) {
        if (visible.get(cards[i])) { setCurrent(cards[i].dataset.phase); return; }
      }
    }, { threshold: 0.5 });
    cards.forEach(function (card) { io.observe(card); });
  }
})();
