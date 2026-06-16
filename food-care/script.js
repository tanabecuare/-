'use strict';

/* ============================================================
   Hamburger Menu (SP)
   ============================================================ */
(function() {
  var btn     = document.getElementById('hb-menu');
  var nav     = document.querySelector('.sp-g-nav');
  var overlay = document.querySelector('.overlay');

  if (!btn || !nav) return;

  function open() {
    btn.classList.add('is-open');
    nav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    btn.classList.remove('is-open');
    nav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function() {
    btn.classList.contains('is-open') ? close() : open();
  });

  if (overlay) overlay.addEventListener('click', close);

  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', close);
  });
})();

/* ============================================================
   Accordion (hb_menu) — SP nav sub items
   ============================================================ */
(function() {
  document.querySelectorAll('.hb_menu__click').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      var list = trigger.nextElementSibling;
      if (!list) return;
      var isOpen = list.style.display === 'block';
      list.style.display = isOpen ? 'none' : 'block';
    });
  });
})();

/* ============================================================
   Smooth scroll for anchor links
   ============================================================ */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var header = document.getElementById('header');
      var offset = header ? header.offsetHeight + 8 : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth'
      });
    });
  });
})();

/* ============================================================
   Footer accordion (group sections)
   ============================================================ */
(function() {
  document.querySelectorAll('.dt_q.arrow').forEach(function(dt) {
    var dd = dt.nextElementSibling;
    if (!dd) return;
    dd.style.display = 'none';
    dt.addEventListener('click', function() {
      var isOpen = dd.style.display === 'block';
      dd.style.display = isOpen ? 'none' : 'block';
      dt.classList.toggle('active', !isOpen);
    });
  });
})();
