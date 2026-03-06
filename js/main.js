/**
 * Gumruyan Campaign Website - Main JavaScript
 * Multi-page static site: navigation, animations, countdown, UI behaviors
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Reduced-motion flag (checked before any animation logic)          */
  /* ------------------------------------------------------------------ */
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /*  DOM Ready                                                         */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initMobileMenu();
    initCountdown();
    initAnnouncementBar();
    initScrollAnimations();
    initNavBackground();
    initDynamicYear();
    initSmoothScroll();
    initHeroFade();
    initNewsFilters();
  });

  /* ================================================================== */
  /*  1. MULTI-PAGE NAVIGATION – active link highlighting               */
  /* ================================================================== */
  function initActiveNav() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    // Normalise: strip trailing /index.html
    if (path.endsWith('/index.html')) {
      path = path.substring(0, path.length - '/index.html'.length) || '/';
    }

    var pageMap = {
      '/': 'home',
      '/index.html': 'home',
      '/meet-zhirayr.html': 'meet-zhirayr',
      '/issues.html': 'issues',
      '/events.html': 'events',
      '/news.html': 'news',
      '/armenian-community.html': 'armenian-community'
    };

    // Attempt to match the last segment (handles sub-directory deployments)
    var lastSegment = '/' + path.split('/').filter(Boolean).pop();
    var pageKey = pageMap[path] || pageMap[lastSegment] || null;

    if (!pageKey) return;

    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      // Match by filename or by a data-page attribute
      var linkPage = link.getAttribute('data-page');
      if (linkPage && linkPage === pageKey) {
        link.classList.add('active');
        return;
      }

      // Fallback: match by href path
      var hrefClean = href.replace(/^\.\//, '/').replace(/\/+$/, '') || '/';
      if (hrefClean.endsWith('/index.html')) {
        hrefClean = hrefClean.substring(0, hrefClean.length - '/index.html'.length) || '/';
      }
      var hrefKey = pageMap[hrefClean];
      if (hrefKey && hrefKey === pageKey) {
        link.classList.add('active');
      }
    });
  }

  /* ================================================================== */
  /*  2. MOBILE HAMBURGER MENU                                          */
  /* ================================================================== */
  function initMobileMenu() {
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');

    if (!navToggle || !navMenu) return;

    // On mobile, move nav-actions inside nav-menu for proper dropdown flow
    var navActions = document.querySelector('.nav-actions');
    function handleMobileActions() {
      if (window.innerWidth <= 768 && navActions && navActions.parentNode !== navMenu) {
        navMenu.appendChild(navActions);
        navActions.classList.add('nav-actions-mobile');
      } else if (window.innerWidth > 768 && navActions && navActions.classList.contains('nav-actions-mobile')) {
        var navContainer = document.querySelector('.nav-container');
        if (navContainer) {
          navContainer.insertBefore(navActions, navToggle);
        }
        navActions.classList.remove('nav-actions-mobile');
      }
    }
    handleMobileActions();
    window.addEventListener('resize', handleMobileActions);

    // Toggle menu on hamburger click
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked
    var navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    function closeMenu() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* ================================================================== */
  /*  3. COUNTDOWN TIMER – Primary Election June 2, 2026 PT            */
  /* ================================================================== */
  function initCountdown() {
    var countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    // June 2, 2026 00:00:00 Pacific Time (UTC-7 PDT)
    var targetDate = new Date('2026-06-02T00:00:00-07:00');
    var intervalId;

    function update() {
      var now = new Date();
      var diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.textContent = 'Election Day!';
        if (intervalId) clearInterval(intervalId);
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Shorter text on mobile to prevent wrapping
      if (window.innerWidth <= 480) {
        countdownEl.textContent = days + ' days until Primary Election';
      } else if (window.innerWidth <= 768) {
        countdownEl.textContent =
          days + 'd ' + hours + 'h ' + minutes + 'm until Primary';
      } else {
        countdownEl.textContent =
          days + ' days, ' +
          hours + ' hours, ' +
          minutes + ' minutes, ' +
          seconds + ' seconds until Primary Election';
      }
    }

    update();
    intervalId = setInterval(update, 1000);
  }

  /* ================================================================== */
  /*  4. ANNOUNCEMENT BAR DISMISS                                       */
  /* ================================================================== */
  function initAnnouncementBar() {
    var STORAGE_KEY = 'announcement_dismissed';

    // Auto-dismiss if previously closed this session
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      document.body.classList.add('announcement-dismissed');
    }

    // Dynamically measure announcement bar height and sync CSS variable
    var bar = document.getElementById('announcement-bar');
    if (bar && !document.body.classList.contains('announcement-dismissed')) {
      function syncBarHeight() {
        var h = bar.offsetHeight;
        document.documentElement.style.setProperty('--announcement-height', h + 'px');
      }
      syncBarHeight();
      window.addEventListener('resize', syncBarHeight);
    }

    var closeBtn = document.querySelector('.announcement-close');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', function () {
      document.body.classList.add('announcement-dismissed');
      sessionStorage.setItem(STORAGE_KEY, '1');
    });
  }

  /* ================================================================== */
  /*  5. SCROLL ANIMATIONS – IntersectionObserver                       */
  /* ================================================================== */
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    // General fade-in observer
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      fadeObserver.observe(el);
    });

    // Safety net: force-show any fade-in elements still invisible after 1.5s
    // Handles edge cases where IntersectionObserver doesn't fire
    setTimeout(function () {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 1500);

    // Staggered card animations for grids
    var cardSelectors = [
      '.credential-card',
      '.venture-card',
      '.publication-card',
      '.proof-quote',
      '.issue-card',
      '.event-card',
      '.news-card',
      '.team-card'
    ].join(', ');

    var gridObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var cards = entry.target.querySelectorAll(cardSelectors);
            cards.forEach(function (card, i) {
              card.style.opacity = '0';
              card.style.transform = 'translateY(15px)';
              card.style.transition =
                'opacity 0.4s ease ' + (i * 0.08) + 's, ' +
                'transform 0.4s ease ' + (i * 0.08) + 's';
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
                });
              });
            });
            gridObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe grid containers
    var gridContainers = document.querySelectorAll(
      '.about-credentials, .ventures-grid, .publications, .proof-grid, ' +
      '.issues-grid, .events-grid, .news-grid, .team-grid'
    );
    gridContainers.forEach(function (container) {
      gridObserver.observe(container);
    });

    // Timeline item stagger
    var timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      var timelineObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
              timelineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      timelineItems.forEach(function (item, i) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition =
          'opacity 0.5s ease ' + (i * 0.1) + 's, ' +
          'transform 0.5s ease ' + (i * 0.1) + 's';
        timelineObserver.observe(item);
      });
    }
  }

  /* ================================================================== */
  /*  6. NAV BACKGROUND – transparent on top, solid on scroll           */
  /* ================================================================== */
  function initNavBackground() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var scrollThreshold = 50;
    var ticking = false;

    function updateNav() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }

    // Also highlight active section if anchor-based nav (single-page sections)
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    function highlightActiveSection() {
      if (navLinks.length === 0) return;
      var sections = document.querySelectorAll('section[id]');
      var current = '';

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop - 100;
        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + section.offsetHeight
        ) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateNav();
          highlightActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial state
    updateNav();
    highlightActiveSection();
  }

  /* ================================================================== */
  /*  7. DYNAMIC YEAR in footer                                         */
  /* ================================================================== */
  function initDynamicYear() {
    var copyright = document.querySelector('.footer-copyright');
    if (!copyright) return;

    var year = new Date().getFullYear();
    // Preserve any existing text pattern or just set it
    var existingText = copyright.textContent.trim();
    if (existingText) {
      // Replace a 4-digit year if present, otherwise append
      copyright.textContent = existingText.replace(/\d{4}/, String(year));
    } else {
      copyright.textContent = '\u00A9 ' + year + ' Zhirayr Gumruyan. All rights reserved.';
    }
  }

  /* ================================================================== */
  /*  8. SMOOTH SCROLL for same-page anchor links                       */
  /* ================================================================== */
  function initSmoothScroll() {
    var NAV_HEIGHT = 70;

    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var topPos = target.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;

      if (prefersReducedMotion) {
        window.scrollTo(0, topPos);
      } else {
        window.scrollTo({
          top: topPos,
          behavior: 'smooth'
        });
      }
    });
  }

  /* ================================================================== */
  /*  9. NEWS CATEGORY FILTERS                                          */
  /* ================================================================== */
  function initNewsFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;

    var newsCards = document.querySelectorAll('.news-card[data-category]');
    if (newsCards.length === 0) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active button
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        var category = btn.getAttribute('data-category');

        // Show/hide cards
        newsCards.forEach(function (card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================================================== */
  /*  10. HERO FADE-IN                                                  */
  /* ================================================================== */
  function initHeroFade() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    if (prefersReducedMotion) {
      hero.style.opacity = '1';
      return;
    }

    hero.style.opacity = '0';
    setTimeout(function () {
      hero.style.transition = 'opacity 0.8s ease';
      hero.style.opacity = '1';
    }, 50);
  }
})();
