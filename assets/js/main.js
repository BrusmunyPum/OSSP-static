/* ============================================
   Main JavaScript - Shared functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  function setMenu(open) {
    if (!navToggle || !mainNav) return;
    navToggle.classList.toggle('active', open);
    mainNav.classList.toggle('active', open);
    if (navOverlay) navOverlay.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', function() {
      setMenu(!mainNav.classList.contains('active'));
    });

    // Keyboard support — the toggle is a <div role="button">, so it
    // needs Enter/Space handled manually to be operable without a mouse.
    navToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setMenu(!mainNav.classList.contains('active'));
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      setMenu(false);
    });
  }

  // --- Mobile Dropdown Toggle ---
  const dropdownParents = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');
  dropdownParents.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown')) {
          dropdown.classList.toggle('active');
          this.classList.toggle('open', dropdown.classList.contains('active'));
        }
      }
    });
  });

  // --- Sticky Header + Scroll-to-Top (single throttled listener) ---
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  let scrollScheduled = false;

  function onScrollFrame() {
    scrollScheduled = false;
    const y = window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
  }

  window.addEventListener('scroll', function() {
    if (!scrollScheduled) {
      scrollScheduled = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  onScrollFrame(); // set initial state on load

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active Page Highlighting ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownLinks = document.querySelectorAll('.dropdown-link');

  document.querySelectorAll('.nav-link.active, .dropdown-link.active').forEach(link => {
    link.classList.remove('active');
  });

  function pageFromHref(href) {
    if (!href || href === '#') return '';
    return href.split('#')[0] || 'index.html';
  }

  navLinks.forEach(link => {
    const hrefPage = pageFromHref(link.getAttribute('href'));
    if (hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  dropdownLinks.forEach(link => {
    const hrefPage = pageFromHref(link.getAttribute('href'));
    if (hrefPage === currentPage) {
      link.classList.add('active');
      const parentItem = link.closest('.nav-item.has-dropdown');
      const parentLink = parentItem ? parentItem.querySelector('.nav-link') : null;
      if (parentLink) parentLink.classList.add('active');
    }
  });

  const activeGroups = {
    'product-detail.html': 'products.html',
    'industry-detail.html': 'industries.html',
    'distribution-system.html': 'services.html',
    'partner.html': 'services.html',
    'strategic-partnership.html': 'services.html',
    'article-detail.html': 'knowledge.html'
  };

  if (activeGroups[currentPage]) {
    const parent = document.querySelector('.nav-link[href="' + activeGroups[currentPage] + '"]');
    if (parent) parent.classList.add('active');
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Ignore bare "#" placeholders — querySelector('#') throws.
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact form (no backend wired: graceful client-side handling) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      let note = contactForm.querySelector('.form-success');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-success';
        note.setAttribute('role', 'status');
        note.style.marginTop = '16px';
        note.style.padding = '12px 16px';
        note.style.background = '#e7f6ec';
        note.style.color = '#1c6b3d';
        note.style.borderRadius = '6px';
        note.style.fontSize = '0.9rem';
        contactForm.appendChild(note);
      }
      note.textContent = 'Thank you! Your message has been received. Our team will contact you shortly.';
      contactForm.reset();
    });
  }

});
