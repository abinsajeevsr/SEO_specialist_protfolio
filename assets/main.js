(function () {
  'use strict';

  // Set JS-ready class on <html>
  document.documentElement.classList.add('js');
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery && motionQuery.matches) {
    document.documentElement.classList.add('reduced-motion');
  }

  // Mobile navigation drawer toggle (checkbox + class sync + keyboard & outside click)
  var mobileNavCheck = document.getElementById('mobile-nav-check');
  var mobileMenu = document.getElementById('mobile-menu');
  var navToggle = document.querySelector('.nav-toggle');

  if (mobileMenu) {
    // Inject backdrop if not already in DOM
    var backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    var isMenuOpen = function () {
      return (mobileNavCheck && mobileNavCheck.checked) ||
        mobileMenu.classList.contains('is-open') ||
        document.body.classList.contains('nav-open');
    };

    var setMenuState = function (open) {
      if (mobileNavCheck) {
        mobileNavCheck.checked = open;
      }
      if (open) {
        mobileMenu.classList.add('is-open');
        document.body.classList.add('nav-open');
      } else {
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    };

    var closeMobileMenu = function () {
      setMenuState(false);
    };

    var toggleMobileMenu = function () {
      setMenuState(!isMenuOpen());
    };

    if (navToggle) {
      navToggle.setAttribute('aria-controls', 'mobile-menu');
      navToggle.setAttribute('aria-expanded', 'false');

      navToggle.addEventListener('click', function (e) {
        e.preventDefault();
        toggleMobileMenu();
      });

      navToggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMobileMenu();
        }
      });
    }

    if (mobileNavCheck) {
      mobileNavCheck.addEventListener('change', function () {
        setMenuState(mobileNavCheck.checked);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMobileMenu();
      });
    }

    var links = mobileMenu.querySelectorAll('a');
    for (var l = 0; l < links.length; l++) {
      links[l].addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && isMenuOpen()) {
        closeMobileMenu();
        if (navToggle) navToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (isMenuOpen()) {
        if (navToggle && (navToggle === e.target || navToggle.contains(e.target))) {
          return;
        }
        if (!mobileMenu.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close mobile drawer when window resizes to desktop width (> 1024px)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && isMenuOpen()) {
        closeMobileMenu();
      }
    });
  }

  // SEO tools train pause handling when off-screen or tab hidden
  var toolsTrain = document.querySelector('.tools-train-strip');
  if (toolsTrain) {
    var isTrainVisible = true;
    var updateTrainPause = function () {
      if (!isTrainVisible || document.hidden) {
        toolsTrain.classList.add('is-paused');
      } else {
        toolsTrain.classList.remove('is-paused');
      }
    };
    if ('IntersectionObserver' in window) {
      var trainObserver = new IntersectionObserver(function (entries) {
        isTrainVisible = entries[0].isIntersecting;
        updateTrainPause();
      }, { threshold: 0.05 });
      trainObserver.observe(toolsTrain);
    }
    document.addEventListener('visibilitychange', updateTrainPause);
  }

  // Services dropdown keyboard, hover, and outside click management
  var details = document.querySelector('.nav-dropdown details');
  if (details) {
    var summary = details.querySelector('summary');
    var navDropdown = document.querySelector('.nav-dropdown');
    var hoverTimer;

    details.addEventListener('toggle', function () {
      details.classList.toggle('is-open', details.open);
    });

    if (navDropdown && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      navDropdown.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        details.setAttribute('open', '');
        details.classList.add('is-open');
      });
      navDropdown.addEventListener('mouseleave', function () {
        hoverTimer = setTimeout(function () {
          if (!details.contains(document.activeElement)) {
            details.removeAttribute('open');
            details.classList.remove('is-open');
          }
        }, 180);
      });
    }

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && details.hasAttribute('open')) {
        details.removeAttribute('open');
        details.classList.remove('is-open');
        if (summary) summary.focus();
      }
    });

    details.addEventListener('focusout', function (e) {
      if (!details.contains(e.relatedTarget)) {
        details.removeAttribute('open');
        details.classList.remove('is-open');
      }
    });

    document.addEventListener('click', function (e) {
      if (details.hasAttribute('open') && !details.contains(e.target)) {
        details.removeAttribute('open');
        details.classList.remove('is-open');
      }
    });

    if (window.location.pathname.indexOf('/seo-services') !== -1) {
      var navDropdownLi = document.querySelector('.nav-dropdown');
      if (navDropdownLi) {
        navDropdownLi.classList.add('is-current');
        if (summary && !summary.hasAttribute('aria-current')) {
          summary.setAttribute('aria-current', 'page');
        }
      }
    }
  }

  // Profile avatar touch popup
  var avatar = document.querySelector('.hero__avatar-interactive');
  if (avatar) {
    avatar.addEventListener('click', function () {
      avatar.classList.toggle('is-active');
    });
    document.addEventListener('click', function (e) {
      if (!avatar.contains(e.target)) avatar.classList.remove('is-active');
    });
  }

  // Hero breathing ring pause handling when off-screen or tab hidden
  var heroRing = document.querySelector('.hero__ring');
  var heroSection = document.querySelector('.hero');
  if (heroRing && heroSection) {
    var isHeroVisible = true;
    var updateRingPause = function () {
      if (!isHeroVisible || document.hidden) {
        heroRing.classList.add('is-paused');
      } else {
        heroRing.classList.remove('is-paused');
      }
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        isHeroVisible = entries[0].isIntersecting;
        updateRingPause();
      }, { threshold: 0.05 }).observe(heroSection);
    }

    document.addEventListener('visibilitychange', updateRingPause);
  }

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Intro text reveal on scroll
  var introSection = document.querySelector('.intro');
  var introContent = document.querySelector('.intro__content');
  if (introSection && introContent && 'IntersectionObserver' in window) {
    if (!motionQuery || !motionQuery.matches) {
      introContent.classList.add('is-reveal-ready');
      var introObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          introContent.classList.add('is-revealed');
          introObserver.disconnect();
        }
      }, { threshold: 0.08 });
      introObserver.observe(introSection);
    }
  }

  // SEO Services carousel controls
  var servicesViewport = document.querySelector('.services__viewport');
  var servicesPrev = document.querySelector('[data-services-prev]');
  var servicesNext = document.querySelector('[data-services-next]');

  if (servicesViewport && servicesPrev && servicesNext) {
    var isTicking = false;

    var getScrollStep = function () {
      var item = servicesViewport.querySelector('.service-tab');
      if (!item) return servicesViewport.clientWidth;
      var track = servicesViewport.querySelector('.services__track');
      var gap = 20;
      if (track) {
        var computedGap = parseFloat(window.getComputedStyle(track).gap);
        if (!isNaN(computedGap)) gap = computedGap;
      }
      var itemWidth = item.offsetWidth;
      var w = window.innerWidth;
      var visibleCount = 1;
      if (w >= 1025) {
        visibleCount = 3;
      } else if (w >= 560) {
        visibleCount = 2;
      }
      return (itemWidth + gap) * visibleCount;
    };

    var updateControls = function () {
      var maxScroll = servicesViewport.scrollWidth - servicesViewport.clientWidth;
      var atStart = servicesViewport.scrollLeft <= 2;
      var atEnd = servicesViewport.scrollLeft >= maxScroll - 2;

      servicesPrev.disabled = atStart;
      servicesPrev.setAttribute('aria-disabled', atStart ? 'true' : 'false');

      servicesNext.disabled = atEnd;
      servicesNext.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
      isTicking = false;
    };

    var onScroll = function () {
      if (!isTicking) {
        window.requestAnimationFrame(updateControls);
        isTicking = true;
      }
    };

    var scrollByAmount = function (offset) {
      var prefersReduced = motionQuery && motionQuery.matches;
      servicesViewport.scrollBy({
        left: offset,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    };

    servicesPrev.addEventListener('click', function () {
      scrollByAmount(-getScrollStep());
    });

    servicesNext.addEventListener('click', function () {
      scrollByAmount(getScrollStep());
    });

    servicesViewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateControls);

    servicesViewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollByAmount(-getScrollStep());
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollByAmount(getScrollStep());
      }
    });

    servicesViewport.addEventListener('focusin', function (e) {
      var targetTab = e.target.closest('.service-tab');
      if (targetTab) {
        var tabLeft = targetTab.offsetLeft;
        var tabRight = tabLeft + targetTab.offsetWidth;
        var viewLeft = servicesViewport.scrollLeft;
        var viewRight = viewLeft + servicesViewport.clientWidth;
        if (tabLeft < viewLeft) {
          servicesViewport.scrollTo({ left: tabLeft, behavior: 'smooth' });
        } else if (tabRight > viewRight) {
          servicesViewport.scrollTo({ left: tabRight - servicesViewport.clientWidth, behavior: 'smooth' });
        }
      }
    });

    servicesViewport.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        var maxScroll = servicesViewport.scrollWidth - servicesViewport.clientWidth;
        var canScrollRight = servicesViewport.scrollLeft < maxScroll - 2;
        var canScrollLeft = servicesViewport.scrollLeft > 2;
        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
          e.preventDefault();
          servicesViewport.scrollBy({
            left: e.deltaY,
            behavior: 'auto'
          });
        }
      }
    }, { passive: false });

    updateControls();
  }

  // Quick enquiry triggers
  var form = document.getElementById('contact-form');
  if (form) {
    var btnMail = document.getElementById('btn-send-mail');
    var btnWa = document.getElementById('btn-send-wa');
    var val = function (id) {
      var field = document.getElementById(id);
      return field ? field.value.trim() : '';
    };

    if (btnMail) {
      btnMail.addEventListener('click', function (e) {
        var name = val('form-name'), email = val('form-email'), site = val('form-website'), msg = val('form-message');
        if (!name || !email || !msg) return;
        e.preventDefault();
        var body = 'Hi Abin,\n\nName: ' + name + '\nEmail: ' + email + '\nWebsite: ' + (site || 'N/A') + '\n\n' + msg;
        window.location.href = 'mailto:abinsajeevsr04@gmail.com?subject=' + encodeURIComponent('SEO enquiry from ' + name) + '&body=' + encodeURIComponent(body);
      });
    }
    if (btnWa) {
      btnWa.addEventListener('click', function (e) {
        var name = val('form-name'), site = val('form-website'), msg = val('form-message');
        if (!name || !msg) return;
        e.preventDefault();
        var txt = 'Hi Abin, I am ' + name + '.\nWebsite: ' + (site || 'N/A') + '\nNote: ' + msg;
        window.open('https://wa.me/918590313359?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      });
    }
  }

  // Back to top floating button
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    var isTopTicking = false;
    var updateBackToTop = function () {
      var show = window.scrollY > window.innerHeight;
      backToTop.classList.toggle('is-visible', show);
      isTopTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!isTopTicking) {
        window.requestAnimationFrame(updateBackToTop);
        isTopTicking = true;
      }
    }, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      var prefersReduced = motionQuery && motionQuery.matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
      var topEl = document.getElementById('top') || document.body;
      if (topEl) {
        if (!topEl.hasAttribute('tabindex')) {
          topEl.setAttribute('tabindex', '-1');
        }
        topEl.focus({ preventScroll: true });
      }
    });
  }

  // FAQ accordion aria-expanded synchronization
  var faqItems = document.querySelectorAll('details.faq-item');
  for (var f = 0; f < faqItems.length; f++) {
    (function (item) {
      var sum = item.querySelector('summary');
      if (!sum) return;
      sum.setAttribute('aria-expanded', item.open ? 'true' : 'false');
      item.addEventListener('toggle', function () {
        sum.setAttribute('aria-expanded', item.open ? 'true' : 'false');
      });
    })(faqItems[f]);
  }
})();