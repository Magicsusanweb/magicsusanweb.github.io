/* Magic Susan Landing Page — Main JS */

// ── Theme Toggle ──
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  let current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', current);
  updateToggleIcon(toggle, current);

  if (toggle) {
    toggle.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      toggle.setAttribute('aria-label', 'Switch to ' + (current === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon(toggle, current);
    });
  }

  function updateToggleIcon(btn, theme) {
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// ── Nav scroll shadow ──
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;

    requestAnimationFrame(() => {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 1px 12px oklch(0.2 0.04 70 / 0.10)'
        : '';
      ticking = false;
    });

    ticking = true;
  }, { passive: true });
})();

// ── Scroll to waitlist ──
function scrollToWaitlist() {
  const el = document.getElementById('waitlist');
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    const input = el.querySelector('input[autocomplete="given-name"], input[name="first_name"], input[name="FNAME"], input[type="email"]');
    if (input) input.focus({ preventScroll: true });
  }, 600);
}
window.scrollToWaitlist = scrollToWaitlist;

// ── Stripe VIP checkout ──
// Replace with your LIVE Stripe Payment Link before launch.
const STRIPE_VIP_CHECKOUT_URL = 'https://buy.stripe.com/aFa4gy9p8aKLdLXbYo8N200';


// ── Waitlist autofill + Mailchimp compatibility helpers ──
(function () {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  const firstName = form.querySelector('#first-name');
  if (firstName) {
    firstName.setAttribute('autocomplete', 'given-name');
    firstName.setAttribute('autocapitalize', 'words');
    firstName.setAttribute('spellcheck', 'false');

    // Browsers understand name="first_name" better than Mailchimp's FNAME.
    // Keep Mailchimp compatibility by creating/syncing a hidden FNAME field.
    if (firstName.getAttribute('name') === 'FNAME') {
      firstName.setAttribute('name', 'first_name');

      if (!form.querySelector('#mailchimp-fname')) {
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.id = 'mailchimp-fname';
        hidden.name = 'FNAME';
        hidden.value = firstName.value || '';
        firstName.insertAdjacentElement('afterend', hidden);
      }
    }
  }

  const email = form.querySelector('#email');
  if (email) {
    email.setAttribute('autocomplete', 'email');
    email.setAttribute('inputmode', 'email');
  }
})();

function syncMailchimpFields(form) {
  if (!form) return;

  const visibleFirstName = form.querySelector('#first-name');
  const firstNameValue = visibleFirstName ? visibleFirstName.value.trim() : '';

  const fnameHidden = form.querySelector('#mailchimp-fname, input[type="hidden"][name="FNAME"]');
  if (fnameHidden) fnameHidden.value = firstNameValue;

  const vip = form.querySelector('#vip');
  const vipHidden = document.getElementById('vip-mailchimp-value') || document.getElementById('vip-hidden') || form.querySelector('input[name="MMERGE7"]');
  if (vipHidden) vipHidden.value = vip && vip.checked ? '1' : '0';
}

function showWaitlistSuccess(form) {
  const success = document.getElementById('waitlist-success');
  const btn = form ? form.querySelector('button[type="submit"]') : null;

  if (success) {
    if (form) form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (btn) {
    btn.textContent = "You're on the list";
    btn.disabled = true;
  }
}

function submitMailchimpInBackground(form) {
  if (!form) return;

  // The HTML form already has action="...Mailchimp..." and target="mailchimp-hidden-frame".
  // Native submit bypasses this JS submit handler, so it will not loop.
  if (typeof HTMLFormElement !== 'undefined' && HTMLFormElement.prototype.submit) {
    HTMLFormElement.prototype.submit.call(form);
  } else {
    form.submit();
  }
}

// ── Waitlist form submission ──
function handleSubmit(e) {
  if (e) e.preventDefault();

  const form = document.getElementById('waitlist-form');
  if (!form) return;

  syncMailchimpFields(form);

  const btn = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  const isVip = !!form.querySelector('#vip')?.checked;

  const email = (
    data.get('EMAIL') ||
    data.get('email') ||
    ''
  ).toString().trim();

  const firstName = (
    data.get('first_name') ||
    data.get('given-name') ||
    data.get('FNAME') ||
    ''
  ).toString().trim();

  const finish = (
    data.get('MMERGE8') ||
    data.get('finish') ||
    ''
  ).toString().trim();

  if (btn) {
    btn.disabled = true;
    btn.textContent = isVip ? 'Opening VIP checkout…' : 'Saving your spot…';
  }

  // Submit to Mailchimp in the hidden iframe first so both free and VIP reservations are captured.
  submitMailchimpInBackground(form);

  if (isVip) {
    const params = new URLSearchParams();
    if (email) params.set('prefilled_email', email);

    const ref = [firstName, finish, 'vip']
      .filter(Boolean)
      .join('|')
      .replace(/[^a-zA-Z0-9|_-]/g, '-')
      .slice(0, 200);

    params.set('client_reference_id', ref || 'vip-reservation');

    const separator = STRIPE_VIP_CHECKOUT_URL.includes('?') ? '&' : '?';
    const destination = STRIPE_VIP_CHECKOUT_URL + separator + params.toString();

    // Small delay gives the hidden Mailchimp iframe a moment to start the request.
    window.setTimeout(() => {
      window.location.assign(destination);
    }, 250);
    return;
  }

  // Non-VIP: do NOT redirect to thank-you.html. That was the likely dead-page issue.
  window.setTimeout(() => showWaitlistSuccess(form), 700);
}
window.handleSubmit = handleSubmit;

// ── Attach waitlist form submit handler ──
(function () {
  const form = document.getElementById('waitlist-form');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
})();

// ── VIP checkbox → update CTA label ──
(function () {
  const vip = document.getElementById('vip');
  const form = document.getElementById('waitlist-form');
  if (!vip || !form) return;

  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;

  const defaultLabel = btn.textContent;
  vip.addEventListener('change', () => {
    btn.textContent = vip.checked ? 'Continue to $1 VIP checkout' : defaultLabel;
    btn.disabled = false;
    syncMailchimpFields(form);
  });
})();

// ── Fade-in on scroll ──
(function () {
  if (!window.IntersectionObserver) return;

  const elements = document.querySelectorAll(
    '.step, .feature-card, .finish-card, .pricing-card, .how-step, .variant-card'
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
})();

// ── Finish Switcher ──
(function () {
  const buttons = document.querySelectorAll('.finish-toggle-btn');
  const images = document.querySelectorAll('.finish-stage-img');
  const panels = document.querySelectorAll('.finish-meta-panel');

  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const finish = btn.getAttribute('data-finish');

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      images.forEach((img) => {
        img.classList.toggle('is-active', img.getAttribute('data-finish') === finish);
      });

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.getAttribute('data-finish') === finish);
      });
    });
  });
})();

// ── Footer: dynamic year + contact email ──
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const contact = document.getElementById('contact-mail');
  if (contact) {
    const email = 'labartcasarobotics@gmail.com';
    contact.href = 'mailto:' + email + '?subject=Magic%20Susan%20question';
    contact.addEventListener('click', () => {
      contact.href = 'mailto:' + email + '?subject=Magic%20Susan%20question';
    });
  }
})();

// ── Hero text rotator ──
(function rotator() {
  const cycle = document.querySelector('[data-rotator]');
  if (!cycle) return;

  const words = cycle.querySelectorAll('.hero-rotator-word');
  if (words.length < 2) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let i = 0;
  setInterval(() => {
    words[i].classList.remove('is-active');
    i = (i + 1) % words.length;
    words[i].classList.add('is-active');
  }, 2400);
})();
