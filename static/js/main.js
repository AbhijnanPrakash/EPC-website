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

// ------------------------------------------------------------
// EPC Assist — sitewide chat panel (mock now, LLM-ready later)
// ------------------------------------------------------------
(function initEpcChat() {
  if (document.getElementById('epcChatRoot')) return;

  const STORAGE_KEY = 'epc-chat-v1';
  const SEEN_KEY = 'epc-chat-seen';

  const DEFAULT_CHIPS = [
    { id: 'quote', label: 'Get a quote' },
    { id: 'ups', label: 'UPS sizing' },
    { id: 'amc', label: 'AMC support' },
    { id: 'engineer', label: 'Talk to engineer' }
  ];

  const FOLLOWUP_CHIPS = [
    { id: 'quote', label: 'Request a quote' },
    { id: 'whatsapp', label: 'WhatsApp us' },
    { id: 'call', label: 'Call now' },
    { id: 'ups', label: 'UPS sizing' }
  ];

  function siteHref(path) {
    const p = location.pathname.replace(/\\/g, '/');
    if (/\/(products|services|solutions)\//.test(p)) return '../' + path;
    return path;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function linkify(text) {
    return escapeHtml(text)
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function mockReply(text) {
    const t = text.toLowerCase();
    if (/quote|price|cost|budget|enquiry|enquir/.test(t)) {
      return {
        text: 'Happy to help with a quote. Share your load (kVA), backup time, and site location — or jump straight into the enquiry form / WhatsApp.',
        actions: [
          { label: 'Enquiry form', href: siteHref('contact.html#enquiry') },
          { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I would like a quote.')}` }
        ],
        chips: FOLLOWUP_CHIPS
      };
    }
    if (/ups|kva|sizing|backup|battery|runtime/.test(t)) {
      return {
        text: 'For UPS sizing we usually need: critical load (kW/kVA), desired backup minutes, single-phase or three-phase, and whether it is IT, healthcare, or industrial. Tell me those and I can outline a range.',
        actions: [
          { label: 'UPS products', href: siteHref('products/ups-systems.html') },
          { label: 'Get a quote', href: siteHref('contact.html#enquiry') }
        ],
        chips: FOLLOWUP_CHIPS
      };
    }
    if (/amc|maintenance|service|contract/.test(t)) {
      return {
        text: 'We offer comprehensive and non-comprehensive AMCs for UPS of any make, plus BMS and electrical panels. 24×7 monitoring is available for AMC customers.',
        actions: [
          { label: 'AMC details', href: siteHref('services/amc.html') },
          { label: 'WhatsApp AMC', href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I need AMC support.')}` }
        ],
        chips: FOLLOWUP_CHIPS
      };
    }
    if (/engineer|call|phone|human|talk|speak/.test(t)) {
      return {
        text: 'You can reach our team Mon–Sat, 9:30 AM – 6:30 PM. Emergency breakdown support is available round the clock for AMC customers.',
        actions: [
          { label: 'Call +91 98418 88332', href: 'tel:+919841888332' },
          { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I would like to speak with an engineer.')}` }
        ],
        chips: FOLLOWUP_CHIPS
      };
    }
    if (/whatsapp|wa\b/.test(t)) {
      return {
        text: 'Sure — open WhatsApp and we will continue there.',
        actions: [
          { label: 'Open WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I have a question.')}` }
        ],
        chips: DEFAULT_CHIPS
      };
    }
    return {
      text: 'I can help with quotes, UPS sizing, AMC, or connecting you to an engineer. Pick a quick option below, or type your requirement.',
      actions: [
        { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I have a question.')}` },
        { label: 'Call', href: 'tel:+919841888332' }
      ],
      chips: DEFAULT_CHIPS
    };
  }

  /**
   * LLM-ready hook. Swap the body to fetch('/api/chat') later.
   * @param {string} text
   * @returns {Promise<{text:string, actions?:Array, chips?:Array}>}
   */
  async function sendChatMessage(text) {
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 350));
    return mockReply(text);
  }
  window.epcSendChatMessage = sendChatMessage;

  function loadState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') || { open: false, messages: [] };
    } catch (_) {
      return { open: false, messages: [] };
    }
  }
  function saveState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        open: state.open,
        messages: state.messages.slice(-40)
      }));
    } catch (_) { /* ignore */ }
  }

  const root = document.createElement('div');
  root.id = 'epcChatRoot';
  root.className = 'epc-chat-root';
  root.innerHTML = `
    <div class="epc-chat-overlay" data-epc-chat-close tabindex="-1" aria-hidden="true"></div>
    <button type="button" class="epc-chat-launcher" id="epcChatLauncher" aria-controls="epcChatPanel" aria-expanded="false" aria-label="Open EPC Assist chat">
      <span class="epc-chat-pulse" aria-hidden="true"></span>
      <svg class="epc-chat-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
      <svg class="epc-chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <aside class="epc-chat-panel" id="epcChatPanel" role="dialog" aria-modal="true" aria-labelledby="epcChatTitle" aria-hidden="true">
      <div class="epc-chat-header">
        <div class="epc-chat-brand">
          <span class="epc-chat-avatar" aria-hidden="true">EPC</span>
          <div>
            <div class="epc-chat-title" id="epcChatTitle">EPC Assist</div>
            <div class="epc-chat-status">Online · usually replies in seconds</div>
          </div>
        </div>
        <button type="button" class="epc-chat-close" data-epc-chat-close aria-label="Close chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="epc-chat-messages" id="epcChatMessages" aria-live="polite"></div>
      <div class="epc-chat-chips" id="epcChatChips"></div>
      <form class="epc-chat-composer" id="epcChatForm">
        <textarea class="epc-chat-input" id="epcChatInput" rows="1" placeholder="Ask about UPS, AMC, or a quote…" aria-label="Message"></textarea>
        <button type="submit" class="epc-chat-send" id="epcChatSend" aria-label="Send message" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>
    </aside>
  `;
  document.body.appendChild(root);

  const launcher = document.getElementById('epcChatLauncher');
  const panel = document.getElementById('epcChatPanel');
  const messagesEl = document.getElementById('epcChatMessages');
  const chipsEl = document.getElementById('epcChatChips');
  const form = document.getElementById('epcChatForm');
  const input = document.getElementById('epcChatInput');
  const sendBtn = document.getElementById('epcChatSend');

  let state = loadState();
  let busy = false;

  if (sessionStorage.getItem(SEEN_KEY)) root.classList.add('has-seen');

  function setOpen(open) {
    state.open = open;
    root.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    launcher.setAttribute('aria-label', open ? 'Close EPC Assist chat' : 'Open EPC Assist chat');
    if (open) {
      sessionStorage.setItem(SEEN_KEY, '1');
      root.classList.add('has-seen');
      setTimeout(() => input.focus(), 280);
    }
    saveState(state);
  }

  function renderChips(chips) {
    const list = chips && chips.length ? chips : DEFAULT_CHIPS;
    chipsEl.innerHTML = list.map((c) =>
      `<button type="button" class="epc-chat-chip" data-chip="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`
    ).join('');
  }

  function appendMessage(msg) {
    const wrap = document.createElement('div');
    wrap.className = `epc-chat-msg is-${msg.role}`;
    let html = `<div class="epc-chat-bubble">${linkify(msg.text)}</div>`;
    if (msg.actions && msg.actions.length) {
      html += `<div class="epc-chat-actions">${msg.actions.map((a) =>
        `<a class="epc-chat-action" href="${escapeHtml(a.href)}"${/^https?:|tel:|mailto:/.test(a.href) && a.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(a.label)}</a>`
      ).join('')}</div>`;
    }
    wrap.innerHTML = html;
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping(show) {
    const existing = messagesEl.querySelector('.epc-chat-typing');
    if (existing) existing.remove();
    if (!show) return;
    const el = document.createElement('div');
    el.className = 'epc-chat-typing';
    el.setAttribute('aria-label', 'Assistant is typing');
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function seedGreeting() {
    if (state.messages.length) return;
    const greeting = {
      role: 'bot',
      text: 'Hi — I am EPC Assist. I can help with quotes, UPS sizing, AMC, or connecting you to an engineer. What do you need?',
      actions: []
    };
    state.messages.push(greeting);
    appendMessage(greeting);
    renderChips(DEFAULT_CHIPS);
    saveState(state);
  }

  function restoreMessages() {
    messagesEl.innerHTML = '';
    if (!state.messages.length) {
      seedGreeting();
      return;
    }
    state.messages.forEach(appendMessage);
    const lastBot = [...state.messages].reverse().find((m) => m.role === 'bot');
    renderChips((lastBot && lastBot.chips) || DEFAULT_CHIPS);
  }

  async function handleUserText(raw) {
    const text = (raw || '').trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;

    // Special chip shortcuts that navigate immediately
    if (text.toLowerCase() === 'whatsapp us' || text.toLowerCase() === 'whatsapp') {
      const userMsg = { role: 'user', text: 'WhatsApp us' };
      state.messages.push(userMsg);
      appendMessage(userMsg);
      saveState(state);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eternal Power, I have a question.')}`, '_blank');
      busy = false;
      updateSendEnabled();
      return;
    }
    if (text.toLowerCase() === 'call now') {
      const userMsg = { role: 'user', text: 'Call now' };
      state.messages.push(userMsg);
      appendMessage(userMsg);
      saveState(state);
      window.location.href = 'tel:+919841888332';
      busy = false;
      updateSendEnabled();
      return;
    }

    const userMsg = { role: 'user', text };
    state.messages.push(userMsg);
    appendMessage(userMsg);
    saveState(state);
    input.value = '';
    autoResize();
    showTyping(true);

    try {
      const reply = await sendChatMessage(text);
      showTyping(false);
      const botMsg = {
        role: 'bot',
        text: reply.text,
        actions: reply.actions || [],
        chips: reply.chips || DEFAULT_CHIPS
      };
      state.messages.push(botMsg);
      appendMessage(botMsg);
      renderChips(botMsg.chips);
      saveState(state);
    } catch (_) {
      showTyping(false);
      const botMsg = {
        role: 'bot',
        text: 'Something went wrong on my side. Please try WhatsApp or call us directly.',
        actions: [
          { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}` },
          { label: 'Call', href: 'tel:+919841888332' }
        ]
      };
      state.messages.push(botMsg);
      appendMessage(botMsg);
      saveState(state);
    }

    busy = false;
    updateSendEnabled();
  }

  function updateSendEnabled() {
    sendBtn.disabled = busy || !input.value.trim();
  }

  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  const CHIP_TEXT = {
    quote: 'I need a quote',
    ups: 'Help me with UPS sizing',
    amc: 'Tell me about AMC support',
    engineer: 'I want to talk to an engineer',
    whatsapp: 'WhatsApp us',
    call: 'Call now'
  };

  launcher.addEventListener('click', () => setOpen(!state.open));
  root.querySelectorAll('[data-epc-chat-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.open) setOpen(false);
  });

  chipsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-chip]');
    if (!btn || busy) return;
    const id = btn.dataset.chip;
    handleUserText(CHIP_TEXT[id] || btn.textContent);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserText(input.value);
  });

  input.addEventListener('input', () => {
    updateSendEnabled();
    autoResize();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserText(input.value);
    }
  });

  restoreMessages();
  if (state.open) setOpen(true);
  updateSendEnabled();
})();
