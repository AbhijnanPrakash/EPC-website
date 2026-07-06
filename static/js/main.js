/* ============================================================
   ETERNAL POWER, main.js
   Simple, no libraries. Live clock, drawer, scroll header,
   reveals, project filter, form handler.
   ============================================================ */

// Configurable, swap these to change where forms send
const WHATSAPP_NUMBER = "919841888332";
const ENQUIRY_EMAIL = "siva@eternalpower.co.in";

// ------------------------------------------------------------
// Live IST clock in header top bar
// ------------------------------------------------------------
function updateClock() {
  const el = document.getElementById('clockTime');
  if (!el) return;
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (5.5 * 60 * 60 * 1000));
  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  el.textContent = `${hh}:${mm}`;
}
updateClock();
setInterval(updateClock, 30000);

// ------------------------------------------------------------
// Footer year
// ------------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ------------------------------------------------------------
// Sticky header shadow / compression on scroll
// ------------------------------------------------------------
const hdr = document.getElementById('hdr');
if (hdr) {
  const onScroll = () => {
    if (window.scrollY > 20) hdr.classList.add('is-scrolled');
    else hdr.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ------------------------------------------------------------
// Mobile drawer
// ------------------------------------------------------------
const drawer = document.getElementById('drawer');
const openBtn = document.getElementById('mobileToggle');
const closeBtn = document.getElementById('drawerClose');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
if (openBtn) openBtn.addEventListener('click', openDrawer);
if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
// Close drawer when clicking any nav link inside it
if (drawer) {
  drawer.querySelectorAll('nav a').forEach(a => a.addEventListener('click', closeDrawer));
}

// ------------------------------------------------------------
// Reveal on scroll (subtle)
// ------------------------------------------------------------
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
}

// ------------------------------------------------------------
// Project industry filter
// ------------------------------------------------------------
const filterWrap = document.getElementById('projectFilters');
if (filterWrap) {
  const cards = document.querySelectorAll('.proj-card');
  filterWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const f = btn.dataset.filter;
    filterWrap.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.industry === f;
      c.style.display = show ? '' : 'none';
    });
  });
}

// ------------------------------------------------------------
// Enquiry form › WhatsApp or email
// ------------------------------------------------------------
document.querySelectorAll('form.enquiry').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.activeElement;
    const method = btn && btn.dataset.send ? btn.dataset.send : 'whatsapp';
    const context = form.dataset.context || 'Website enquiry';
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const company = (data.get('company') || '').toString().trim();
    const msg = (data.get('message') || '').toString().trim();
    if (!name || !phone || !msg) {
      alert('Please fill in your name, phone and requirement.');
      return;
    }
    const body = [
      `Enquiry: ${context}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      company ? `Company: ${company}` : null,
      '',
      msg
    ].filter(Boolean).join('\n');

    if (method === 'email') {
      const subject = `Website enquiry, ${context}`;
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`, '_blank');
    }
  });
});

// ------------------------------------------------------------
// Number counter animation (subtle)
// ------------------------------------------------------------
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  if (isNaN(target)) return;
  const duration = 1400;
  const start = performance.now();
  const startVal = 0;
  const isInt = Number.isInteger(target);
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const v = startVal + (target - startVal) * eased;
    el.textContent = isInt ? Math.round(v).toLocaleString() : v.toFixed(2);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = isInt ? target.toLocaleString() : target;
  };
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        co.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));
}
