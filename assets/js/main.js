/* ============================================
   Main JavaScript - Shared functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      navToggle.classList.remove('active');
      mainNav.classList.remove('active');
      this.classList.remove('active');
      document.body.style.overflow = '';
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
        }
      }
    });
  });

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // --- Scroll to Top Button ---
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

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
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
