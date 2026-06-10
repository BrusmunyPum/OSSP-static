/* ============================================
   Hero Slider
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(slideInterval);
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(index);
      startAutoPlay();
    });
  });

  // Arrow navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const heroSection = document.querySelector('.hero');

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        stopAutoPlay();
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoPlay();
      }
    }, { passive: true });
  }

  // Start
  startAutoPlay();
});

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('[data-industries-carousel]');
  if (!carousel) return;

  const viewport = carousel.querySelector('.industries-viewport');
  const track = carousel.querySelector('.industries-strip');
  const prevBtn = carousel.querySelector('.industries-arrow.prev');
  const nextBtn = carousel.querySelector('.industries-arrow.next');
  const originalItems = Array.from(track.children);
  if (!originalItems.length) return;

  const cloneCount = Math.min(3, originalItems.length);
  let index = cloneCount;
  let step = 0;
  let autoplay;

  function getGap() {
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '6');
    return Number.isFinite(gap) ? gap : 6;
  }

  function rebuildTrack() {
    while (track.children.length > originalItems.length) {
      track.removeChild(track.lastElementChild);
    }

    const leading = originalItems.slice(-cloneCount).map(function (item) {
      return item.cloneNode(true);
    });
    const trailing = originalItems.slice(0, cloneCount).map(function (item) {
      return item.cloneNode(true);
    });

    leading.reverse().forEach(function (item) {
      track.insertBefore(item, track.firstElementChild);
    });
    trailing.forEach(function (item) {
      track.appendChild(item);
    });
  }

  function measure() {
    const tile = track.querySelector('.industry-tile');
    if (!tile) return;
    step = tile.getBoundingClientRect().width + getGap();
  }

  function setPosition(animate) {
    track.style.transition = animate ? 'transform 0.7s ease' : 'none';
    track.style.transform = 'translateX(' + (-index * step) + 'px)';
  }

  function nextSlide() {
    measure();
    index += 1;
    setPosition(true);
  }

  function prevSlide() {
    measure();
    index -= 1;
    setPosition(true);
  }

  function resetAutoPlay() {
    clearInterval(autoplay);
    autoplay = setInterval(nextSlide, 3600);
  }

  rebuildTrack();
  measure();
  setPosition(false);

  track.addEventListener('transitionend', function () {
    if (index >= originalItems.length + cloneCount) {
      index = cloneCount;
      setPosition(false);
    }
    if (index < cloneCount) {
      index = originalItems.length + cloneCount - 1;
      setPosition(false);
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      clearInterval(autoplay);
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      clearInterval(autoplay);
      nextSlide();
      resetAutoPlay();
    });
  }

  if (viewport) {
    viewport.addEventListener('mouseenter', function () {
      clearInterval(autoplay);
    });
    viewport.addEventListener('mouseleave', function () {
      resetAutoPlay();
    });
  }

  window.addEventListener('resize', function () {
    measure();
    setPosition(false);
  });

  resetAutoPlay();
});

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('[data-services-carousel]');
  if (!carousel) return;

  const viewport = carousel.querySelector('.services-viewport');
  const track = carousel.querySelector('.services-track');
  const prevBtn = carousel.querySelector('.services-arrow.prev');
  const nextBtn = carousel.querySelector('.services-arrow.next');
  const originalSlides = Array.from(track.children);
  if (!originalSlides.length) return;

  let current = 1;
  let slideWidth = 0;
  let autoplay;

  function rebuildTrack() {
    while (track.children.length > originalSlides.length) {
      track.removeChild(track.lastElementChild);
    }

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    track.insertBefore(lastClone, track.firstElementChild);
    track.appendChild(firstClone);
  }

  function measure() {
    if (!viewport) return;
    slideWidth = viewport.getBoundingClientRect().width;
  }

  function setPosition(animate) {
    track.style.transition = animate ? 'transform 0.7s ease' : 'none';
    track.style.transform = 'translateX(' + (-current * slideWidth) + 'px)';
  }

  function goNext() {
    measure();
    current += 1;
    setPosition(true);
  }

  function goPrev() {
    measure();
    current -= 1;
    setPosition(true);
  }

  function resetAutoPlay() {
    clearInterval(autoplay);
    autoplay = setInterval(goNext, 4400);
  }

  rebuildTrack();
  measure();
  setPosition(false);

  track.addEventListener('transitionend', function () {
    if (current >= originalSlides.length + 1) {
      current = 1;
      setPosition(false);
    }

    if (current <= 0) {
      current = originalSlides.length;
      setPosition(false);
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      clearInterval(autoplay);
      goPrev();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      clearInterval(autoplay);
      goNext();
      resetAutoPlay();
    });
  }

  if (viewport) {
    viewport.addEventListener('mouseenter', function () {
      clearInterval(autoplay);
    });

    viewport.addEventListener('mouseleave', function () {
      resetAutoPlay();
    });
  }

  window.addEventListener('resize', function () {
    measure();
    setPosition(false);
  });

  resetAutoPlay();
});
