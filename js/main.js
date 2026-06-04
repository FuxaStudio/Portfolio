// ================================
// PORTFOLIO LANDING PAGE — INTERACTIONS
// ================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navbar.classList.toggle('menu-active');
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navbar.classList.remove('menu-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ---- Scroll reveal with Intersection Observer ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');

  const _submitSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
  const _checkSVG  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Use current language for all status messages
      const tFn = window.i18n ? window.i18n.t.bind(window.i18n) : (k) => k;

      submitBtn.innerHTML = tFn('form.submitting');
      submitBtn.style.pointerEvents = 'none';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          submitBtn.innerHTML = `${_checkSVG} ${tFn('form.success')}`;
          contactForm.reset();
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        submitBtn.innerHTML = tFn('form.error');
      }

      setTimeout(() => {
        submitBtn.innerHTML = `${tFn('form.submit')} ${_submitSVG}`;
        submitBtn.style.pointerEvents = '';
      }, 4000);
    });
  }

  // ---- Phone input — restrict to numeric characters ----
  document.querySelectorAll('input[name="phone"]').forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9\s\+\-\(\)]/g, '');
    });
  });

  // ---- Active nav link highlight ----
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(link => {
          if (!link.classList.contains('static-active')) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--color-text-primary)';
            }
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ---- Magnetic button effect ----
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- 3D tilt on project cards ----
  const tiltCards = document.querySelectorAll('.project-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = y * -6;
      const tiltY = x * 6;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- Project Filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active state from all buttons
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = '';
          b.style.background = '';
          b.style.color = '';
          b.setAttribute('aria-pressed', 'false');
        });

        // Activate clicked button
        btn.classList.add('active');
        btn.style.borderColor = 'rgba(255,255,255,0.35)';
        btn.style.background = 'rgba(255,255,255,0.07)';
        btn.style.color = 'var(--color-text-primary)';
        btn.setAttribute('aria-pressed', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = '';
            card.classList.add('visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Contact Page specific scripts ----
  // Auto-focus first input when arriving via #form anchor
  if (window.location.hash === '#form') {
    setTimeout(() => {
      const firstInput = document.getElementById('formName');
      if (firstInput) firstInput.focus();
    }, 600);
  }

  // Smooth scroll and focus on CTA click (specific for forms)
  document.querySelectorAll('a[href="#form"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        const firstInput = document.getElementById('formName');
        if (firstInput) firstInput.focus();
      }, 600);
    });
  });

});
