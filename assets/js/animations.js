/* ============================================
   Animation Engine — scroll reveals + counters
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. Auto-tag elements with data-anim ───
  // Instead of manually adding data-anim to every HTML element,
  // we auto-detect common selectors and tag them.

  const animMap = [
    // Homepage
    { sel: '.hero-content, .products-hero-content, .services-hero-content, .industries-hero-content, .strength-hero-content, .knowledge-hero, .article-hero, .contact-hero, .product-detail-hero, .support-hero', anim: 'fade-up' },
    { sel: '.feature-links-header',        anim: 'fade-up' },
    { sel: '.feature-link',                anim: 'fade-up', stagger: true },
    { sel: '.consult-card',                anim: 'zoom-in' },
    { sel: '.about-showcase-content',      anim: 'fade-up' },
    { sel: '.about-stat',                  anim: 'fade-up', stagger: true },
    { sel: '.section-head',                anim: 'fade-up' },
    { sel: '.product-card',                anim: 'fade-up', stagger: true },
    { sel: '.services-carousel',           anim: 'zoom-in' },
    { sel: '.industries-showcase .section-head', anim: 'fade-up' },
    { sel: '.industries-carousel',         anim: 'fade-up' },
    { sel: '.development-layout .section-head', anim: 'fade-left' },
    { sel: '.development-image',           anim: 'fade-right' },
    { sel: '.process-image',               anim: 'fade-left' },
    { sel: '.process-heading',             anim: 'fade-right' },
    { sel: '.step-card',                   anim: 'fade-up', stagger: true },
    { sel: '.success-card',                anim: 'fade-up' },
    { sel: '.testimonials-head',           anim: 'fade-up' },
    { sel: '.testimonial-card',            anim: 'fade-up', stagger: true },
    { sel: '.partners-title',              anim: 'fade-up' },
    { sel: '.partner-logo',                anim: 'fade-up', stagger: true },
    { sel: '.cta-strip-item',              anim: 'fade-up', stagger: true },

    // About page
    { sel: '.about-intro-title-row',       anim: 'fade-up' },
    { sel: '.about-intro-content',         anim: 'fade-up' },
    { sel: '.about-us-image',              anim: 'fade-left' },
    { sel: '.about-us-text',               anim: 'fade-right' },
    { sel: '.about-details-heading',       anim: 'fade-up' },
    { sel: '.about-details-desc',          anim: 'fade-up' },
    { sel: '.details-table',               anim: 'fade-up' },
    { sel: '.mission-image',               anim: 'fade-left' },
    { sel: '.mission-org',                 anim: 'fade-up' },
    { sel: '.mission-society',             anim: 'fade-right' },
    { sel: '.dev-header',                  anim: 'fade-up' },
    { sel: '.dev-desc',                    anim: 'fade-up' },
    { sel: '.dev-card',                    anim: 'fade-up', stagger: true },
    { sel: '.membership-header',           anim: 'fade-left' },
    { sel: '.motto-heading',               anim: 'fade-up' },
    { sel: '.motto-tabs',                  anim: 'fade-up' },
    { sel: '.work-heading',                anim: 'fade-up' },
    { sel: '.work-tabs',                   anim: 'fade-up' },
    { sel: '.partnership-text',            anim: 'fade-left' },
    { sel: '.partnership-puzzle',          anim: 'fade-right' },
    { sel: '.products-image',              anim: 'fade-left' },
    { sel: '.products-text',               anim: 'fade-right' },
    { sel: '.more-title',                  anim: 'fade-up' },
    { sel: '.more-content',                anim: 'fade-up' },
    { sel: '.commitment-card',             anim: 'fade-up', stagger: true },

    // Products page
    { sel: '.products-hero-content',       anim: 'fade-up' },
    { sel: '.products-grid-section .section-header', anim: 'fade-up' },
    { sel: '.pg-card',                     anim: 'fade-up', stagger: true },
    { sel: '.category-block',              anim: 'fade-up', stagger: true },

    // Product detail
    { sel: '.product-images',              anim: 'fade-left' },
    { sel: '.product-info',                anim: 'fade-right' },
    { sel: '.product-spec-row',            anim: 'fade-up', stagger: true },
    { sel: '.product-cta-row',             anim: 'fade-up' },
    { sel: '.related-head',                anim: 'fade-up' },
    { sel: '.related-card',                anim: 'fade-up', stagger: true },

    // Services / Industries / Strength pages
    { sel: '.services-list-head, .industries-list-head, .strength-feature-head, .strength-map-head', anim: 'fade-up' },
    { sel: '.service-card, .service-step, .training-section .section-head, .training-card', anim: 'fade-up', stagger: true },
    { sel: '.industry-card, .industry-overview-image, .industry-overview-text, .challenge-card, .industry-product-card', anim: 'fade-up', stagger: true },
    { sel: '.strength-image',              anim: 'fade-left' },
    { sel: '.strength-copy',               anim: 'fade-right' },
    { sel: '.strength-card, .map-item, .partner-logo-card, .philosophy-values article', anim: 'fade-up', stagger: true },

    // Knowledge / article pages
    { sel: '.article-card',                anim: 'fade-up', stagger: true },
    { sel: '.sidebar-widget',              anim: 'fade-left', stagger: true },
    { sel: '.article-content',             anim: 'fade-up' },
    { sel: '.article-cover, .article-body h2, .article-body p, .related-articles .article-card', anim: 'fade-up', stagger: true },

    // Support / sharing detail pages
    { sel: '.support-panel',               anim: 'fade-up' },
    { sel: '.support-sidebar',             anim: 'fade-left' },
    { sel: '.policy-card, .faq-item, .training-card, .gallery-card, .job-card', anim: 'fade-up', stagger: true },

    // Contact page
    { sel: '.contact-info-card',           anim: 'fade-up', stagger: true },
    { sel: '.contact-form-wrapper',        anim: 'fade-left' },
    { sel: '.contact-info-side',           anim: 'fade-right' },
    { sel: '.contact-map-card',            anim: 'fade-up' },
    { sel: '.office-card',                 anim: 'fade-up', stagger: true },
    { sel: '.contact-bottom-note',         anim: 'fade-up' },

    // Footer columns
    { sel: '.footer-col',                  anim: 'fade-up', stagger: true },
  ];

  animMap.forEach(function (rule) {
    var elements = document.querySelectorAll(rule.sel);
    elements.forEach(function (el, i) {
      // Don't override if already has data-anim
      if (el.hasAttribute('data-anim')) return;
      el.setAttribute('data-anim', rule.anim);
      if (rule.stagger) {
        el.setAttribute('data-delay', String(Math.min(i + 1, 7)));
      }
    });
  });


  // ─── 2. Intersection Observer for [data-anim] ───
  var animEls = document.querySelectorAll('[data-anim]');

  if ('IntersectionObserver' in window && animEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback
    animEls.forEach(function (el) { el.classList.add('in-view'); });
  }


  // ─── 3. Legacy .fade-in support ───
  var legacyEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if ('IntersectionObserver' in window && legacyEls.length) {
    var legacyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          legacyIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    legacyEls.forEach(function (el) { legacyIO.observe(el); });
  } else {
    legacyEls.forEach(function (el) { el.classList.add('visible'); });
  }


  // ─── 4. Counter Animation ───
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var step = target / (duration / 16);
    var current = 0;

    function tick() {
      current += step;
      if (current >= target) {
        el.textContent = prefix + target + suffix;
        return;
      }
      el.textContent = prefix + Math.floor(current) + suffix;
      requestAnimationFrame(tick);
    }
    tick();
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }


  // ─── 5. Smooth parallax-lite on scroll (hero) ───
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    var heroImg = heroSection.querySelector('.hero-floating-img');
    var heroBg  = heroSection.querySelector('.hero-slide.active img');

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var heroH   = heroSection.offsetHeight;
      if (scrollY > heroH) return; // past hero, skip

      // Floating product image — subtle upward shift
      if (heroImg) {
        heroImg.style.transform = 'translateY(calc(-50% - ' + (scrollY * 0.08) + 'px))';
      }
    }, { passive: true });
  }


  // ─── 6. Typed-effect for hero title (optional) ───
  // No-op — keep the static title for reliability


});
