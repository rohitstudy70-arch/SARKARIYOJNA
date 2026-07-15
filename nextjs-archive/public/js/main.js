// All Sarkari Yojana - Main JavaScript

(function () {
  'use strict';

  // ===================== HAMBURGER MENU =====================
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ===================== FAQ ACCORDION =====================
  document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = question.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-question').forEach((q) => {
        q.classList.remove('active');
        q.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        question.classList.add('active');
        answer.classList.add('open');
      }
    });
  });

  // ===================== SMOOTH SCROLL =====================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===================== STICKY HEADER SHADOW =====================
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(5,42,120,0.14)'
        : '0 2px 8px rgba(5,42,120,0.08)';
    }, { passive: true });
  }

  // ===================== ACTIVE NAV LINK =====================
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
      link.classList.add('active');
    }
  });

  // ===================== SCHEME SEARCH (category pages) =====================
  const searchInput = document.getElementById('scheme-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.scheme-card').forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.closest('.scheme-card-wrap') 
          ? (card.closest('.scheme-card-wrap').style.display = text.includes(q) ? '' : 'none')
          : (card.style.display = text.includes(q) ? '' : 'none');
      });
    });
  }

  // ===================== COUNTER ANIMATION =====================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');
    }, 16);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach((el) => observer.observe(el));
  }

  // ===================== BACK TO TOP =====================
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.style.opacity = window.scrollY > 400 ? '1' : '0';
      btt.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===================== RELATED YOJANA (scheme detail pages) =====================
  const relatedEl = document.getElementById('related-schemes');
  if (relatedEl && window.SCHEMES) {
    const currentId = relatedEl.dataset.current;
    const cat       = relatedEl.dataset.cat;
    const stateslug = relatedEl.dataset.state;

    // Filter: same category OR same state, but not current scheme
    let related = window.SCHEMES.filter(function (s) {
      return s.id !== currentId && (s.categorySlug === cat || s.stateSlug === stateslug);
    });

    // Fisher-Yates shuffle for variety on each load
    for (var i = related.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = related[i]; related[i] = related[j]; related[j] = tmp;
    }
    related = related.slice(0, 5);

    if (related.length) {
      relatedEl.innerHTML = '<ul class="related-schemes-list">' +
        related.map(function (s) {
          return '<li class="related-scheme-item">' +
            '<span class="rs-icon">&#128203;</span>' +
            '<a href="' + s.pageUrl + '">' + (s.hindiName || s.name) + '</a>' +
            '</li>';
        }).join('') +
      '</ul>';
    } else {
      relatedEl.innerHTML = '';
    }
  }

})();
