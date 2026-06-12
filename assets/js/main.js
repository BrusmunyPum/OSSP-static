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
    'industry-detail.html': 'industries.html',
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
      // Ignore bare "#" links because querySelector('#') throws.
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
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(id, msg) {
      const field = document.getElementById(id);
      if (!field) return;
      field.classList.toggle('input-error', !!msg);
      let err = field.parentElement.querySelector('.field-error');
      if (msg) {
        if (!err) {
          err = document.createElement('span');
          err.className = 'field-error';
          field.parentElement.appendChild(err);
        }
        err.textContent = msg;
      } else if (err) {
        err.remove();
      }
    }

    function validateForm() {
      let valid = true;
      const firstName = contactForm.querySelector('#firstName');
      const lastName  = contactForm.querySelector('#lastName');
      const email     = contactForm.querySelector('#email');
      const message   = contactForm.querySelector('#message');

      if (!firstName || !firstName.value.trim()) {
        setFieldError('firstName', 'First name is required.');
        valid = false;
      } else { setFieldError('firstName', ''); }

      if (!lastName || !lastName.value.trim()) {
        setFieldError('lastName', 'Last name is required.');
        valid = false;
      } else { setFieldError('lastName', ''); }

      if (!email || !email.value.trim()) {
        setFieldError('email', 'Email address is required.');
        valid = false;
      } else if (!EMAIL_RE.test(email.value.trim())) {
        setFieldError('email', 'Please enter a valid email address.');
        valid = false;
      } else { setFieldError('email', ''); }

      if (!message || !message.value.trim()) {
        setFieldError('message', 'Please enter your message.');
        valid = false;
      } else { setFieldError('message', ''); }

      return valid;
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm()) return;

      let note = contactForm.querySelector('.form-success');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-success';
        note.setAttribute('role', 'status');
        note.style.cssText = 'margin-top:16px;padding:12px 16px;background:#e7f6ec;color:#1c6b3d;border-radius:6px;font-size:0.9rem;';
        contactForm.appendChild(note);
      }
      note.textContent = 'Thank you! Your message has been received. Our team will contact you shortly.';
      contactForm.reset();
      contactForm.querySelectorAll('.input-error').forEach(function(el) { el.classList.remove('input-error'); });
      contactForm.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
    });

    // Clear individual field errors on input
    ['firstName', 'lastName', 'email', 'message'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', function() { setFieldError(id, ''); });
    });
  }

});
