'use strict';

/* =============================================
   NAV SCROLL BEHAVIOR
   ============================================= */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* =============================================
   ACTIVE NAV LINK (IntersectionObserver)
   ============================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* =============================================
   SCROLL-IN ANIMATIONS
   ============================================= */
(function initScrollAnimations() {
  const els = document.querySelectorAll('.section, .edu-item, .pos-item');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  els.forEach((s) => observer.observe(s));
})();


/* =============================================
   PUBLICATION SORT TOGGLE
   ============================================= */
(function initPubSort() {
  const btnDate      = document.getElementById('pub-sort-date');
  const btnCitations = document.getElementById('pub-sort-citations');
  if (!btnDate || !btnCitations) return;

  const lists = document.querySelectorAll('.pub-list');
  const originals = Array.from(lists).map(list =>
    Array.from(list.querySelectorAll('li.pub-entry'))
  );

  function applySort(byCitations) {
    btnDate.setAttribute('aria-pressed', !byCitations);
    btnCitations.setAttribute('aria-pressed', byCitations);

    lists.forEach((list, i) => {
      const items = byCitations
        ? [...originals[i]].sort((a, b) =>
            parseInt(b.dataset.citations, 10) - parseInt(a.dataset.citations, 10))
        : [...originals[i]];
      items.forEach(li => list.appendChild(li));
    });
  }

  btnDate.addEventListener('click',      () => applySort(false));
  btnCitations.addEventListener('click', () => applySort(true));
})();
