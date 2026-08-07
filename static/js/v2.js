/* ==========================================================================
   ETERNAL POWER — V2 shared behaviour
   No dependencies. Everything degrades gracefully without JS:
   the FAQ uses native <details>, the process panels render expanded,
   the project rail is a native scroll-snap container, and the form
   falls back to standard HTML validation.
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919841888332';
  var ENQUIRY_EMAIL = 'siva@eternalpower.co.in';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- Footer year */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------- Sticky header state */
  var hdr = $('#hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- Mobile drawer */
  var drawer = $('#drawer');
  var burger = $('#mobileToggle');
  var drawerClose = $('#drawerClose');
  var lastFocused = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (drawerClose) drawerClose.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer && drawer.classList.contains('open')) closeDrawer();
  });

  /* Keep focus inside the drawer while it is open */
  if (drawer) {
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
      var items = $$('a[href], button:not([disabled])', drawer);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------ Scroll reveals */
  var revealables = $$('.v2-rv');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -48px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- Statistic counters */
  /* Years must not be group-separated ("2,012"), so opt them out with data-plain */
  function formatCount(el, value) {
    var decimals = el.dataset.decimals | 0;
    if (decimals) return value.toFixed(decimals);
    var rounded = Math.round(value);
    return el.hasAttribute('data-plain') ? String(rounded) : rounded.toLocaleString('en-IN');
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var duration = 1300;
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatCount(el, target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = formatCount(el, parseFloat(el.dataset.count));
    });
  } else {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ------------------------------------------------------------ Process timeline */
  var procTrack = $('#procTrack');
  if (procTrack) {
    var steps = $$('.v2-proc-step', procTrack);
    var panels = $$('.v2-proc-panel');
    var fill = $('#procFill');

    function selectStep(index, moveFocus) {
      steps.forEach(function (step, i) {
        var active = i === index;
        step.setAttribute('aria-selected', active ? 'true' : 'false');
        step.setAttribute('tabindex', active ? '0' : '-1');
      });
      panels.forEach(function (panel, i) { panel.hidden = i !== index; });
      if (fill && steps.length > 1) {
        fill.style.width = 'calc((84% / ' + (steps.length - 1) + ') * ' + index + ')';
      }
      if (moveFocus) steps[index].focus();
    }

    steps.forEach(function (step, i) {
      step.addEventListener('click', function () { selectStep(i); });
      step.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % steps.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + steps.length) % steps.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = steps.length - 1;
        if (next === null) return;
        e.preventDefault();
        selectStep(next, true);
      });
    });

    selectStep(0);
  }

  /* ---------------------------------------------------------- Projects carousel */
  var rail = $('#projRail');
  if (rail) {
    var prev = $('#projPrev');
    var next = $('#projNext');

    function pageSize() {
      var card = rail.firstElementChild;
      if (!card) return rail.clientWidth;
      var gap = parseFloat(getComputedStyle(rail).columnGap) || 24;
      return card.getBoundingClientRect().width + gap;
    }
    function syncButtons() {
      var maxScroll = rail.scrollWidth - rail.clientWidth - 1;
      if (prev) prev.disabled = rail.scrollLeft <= 0;
      if (next) next.disabled = rail.scrollLeft >= maxScroll;
    }
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -pageSize(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: pageSize(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    rail.addEventListener('scroll', syncButtons, { passive: true });
    window.addEventListener('resize', syncButtons);
    syncButtons();
  }

  /* --------------------------------------------------- FAQ: one panel open at a time */
  var faq = $('#faqList');
  if (faq) {
    var items = $$('details', faq);
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) { if (other !== item) other.open = false; });
      });
    });
  }

  /* ------------------------------------------------------------ Consultation form */
  $$('form.v2-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var submitter = e.submitter || form.querySelector('[type="submit"]');
      var method = (submitter && submitter.dataset.send) || 'whatsapp';
      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      var name = [get('firstName'), get('lastName')].filter(Boolean).join(' ');
      var lines = [
        'Enquiry: ' + (form.dataset.context || 'Homepage consultation'),
        'Name: ' + name,
        'Phone: ' + get('phone'),
        get('email') ? 'Email: ' + get('email') : null,
        get('company') ? 'Company: ' + get('company') : null,
        get('requirement') ? 'Requirement: ' + get('requirement') : null,
        '',
        get('message')
      ].filter(function (l) { return l !== null; });

      var body = lines.join('\n');

      if (method === 'email') {
        window.location.href = 'mailto:' + ENQUIRY_EMAIL +
          '?subject=' + encodeURIComponent('Website enquiry — ' + name) +
          '&body=' + encodeURIComponent(body);
      } else {
        window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
      }
    });
  });
})();
