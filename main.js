'use strict';

/* =============================================
   THEME TOGGLE
   ============================================= */
(function initThemeToggle() {
  const STORAGE_KEY = 'cv-theme';
  const root = document.documentElement;

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_KEY, 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    }
  });
})();


/* =============================================
   ACTIVE NAV LINK (IntersectionObserver)
   ============================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.side-nav a');
  if (!sections.length || !navLinks.length) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  const visible = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      let bestId = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      if (bestId) setActive(bestId);
    },
    { threshold: [0.1, 0.3, 0.6], rootMargin: '-10% 0px -20% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* =============================================
   PUBLICATION SORT TOGGLE
   ============================================= */
(function initPubSort() {
  const btnDate = document.getElementById('pub-sort-date');
  const btnCitations = document.getElementById('pub-sort-citations');
  if (!btnDate || !btnCitations) return;

  const lists = document.querySelectorAll('.pub-list');
  const originals = Array.from(lists).map((list) =>
    Array.from(list.querySelectorAll('li.pub-entry'))
  );

  // Prefer the live badge text (kept current by the weekly citation
  // update workflow) over the static data-citations attribute.
  function citationCount(li) {
    const badge = li.querySelector('.pub-citations');
    if (badge) {
      const n = parseInt(badge.textContent, 10);
      if (!Number.isNaN(n)) return n;
    }
    return parseInt(li.dataset.citations, 10) || 0;
  }

  function applySort(byCitations) {
    btnDate.setAttribute('aria-pressed', String(!byCitations));
    btnCitations.setAttribute('aria-pressed', String(byCitations));

    lists.forEach((list, i) => {
      const items = byCitations
        ? [...originals[i]].sort((a, b) => citationCount(b) - citationCount(a))
        : [...originals[i]];
      items.forEach((li) => list.appendChild(li));
    });
  }

  btnDate.addEventListener('click', () => applySort(false));
  btnCitations.addEventListener('click', () => applySort(true));
})();
