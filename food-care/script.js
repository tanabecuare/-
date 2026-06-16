'use strict';

/* ============================================================
   Tab Switching
   ============================================================ */
(function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      // Update panels
      tabPanels.forEach(panel => {
        const isTarget = panel.id === `panel-${target}`;
        panel.classList.toggle('active', isTarget);
        if (isTarget) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      // Trigger scroll animations for newly visible cards
      observeCards();
    });
  });
})();

/* ============================================================
   Mobile Navigation Toggle
   ============================================================ */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('globalNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    }
  });

  // Close nav when a link inside it is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   FAQ Accordion
   ============================================================ */
(function initFaq() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer     = document.getElementById(btn.getAttribute('aria-controls'));

      // Close all others
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(other.getAttribute('aria-controls'));
          if (otherAnswer) collapseAnswer(otherAnswer);
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      if (answer) {
        if (isExpanded) {
          collapseAnswer(answer);
        } else {
          expandAnswer(answer);
        }
      }
    });
  });

  function expandAnswer(el) {
    el.removeAttribute('hidden');
    el.style.maxHeight = '0';
    el.style.overflow  = 'hidden';
    el.style.transition = 'max-height .3s ease';
    requestAnimationFrame(() => {
      el.style.maxHeight = el.scrollHeight + 'px';
    });
    el.addEventListener('transitionend', () => {
      el.style.maxHeight = '';
      el.style.overflow  = '';
    }, { once: true });
  }

  function collapseAnswer(el) {
    el.style.maxHeight  = el.scrollHeight + 'px';
    el.style.overflow   = 'hidden';
    el.style.transition = 'max-height .3s ease';
    requestAnimationFrame(() => {
      el.style.maxHeight = '0';
    });
    el.addEventListener('transitionend', () => {
      el.setAttribute('hidden', '');
      el.style.maxHeight  = '';
      el.style.overflow   = '';
      el.style.transition = '';
    }, { once: true });
  }
})();

/* ============================================================
   Scroll Animation (Intersection Observer)
   ============================================================ */
let cardObserver;

function observeCards() {
  if (cardObserver) cardObserver.disconnect();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll(
    '.tab-panel:not([hidden]) .feature-card, ' +
    '.tab-panel:not([hidden]) .care-card, ' +
    '.tab-panel:not([hidden]) .brand-category, ' +
    '.faq-item'
  );

  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => cardObserver.observe(card));
}

// Initial observe
document.addEventListener('DOMContentLoaded', observeCards);

/* ============================================================
   Sticky header height: update CSS variable for tab offset
   ============================================================ */
(function updateHeaderVar() {
  function setVar() {
    const header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty(
        '--header-h', header.offsetHeight + 'px'
      );
    }
  }
  setVar();
  window.addEventListener('resize', setVar);
})();
