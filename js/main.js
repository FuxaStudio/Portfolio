// ================================
// PORTFOLIO LANDING PAGE — INTERACTIONS
// ================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Shared mouse tracking ----
  let mouseX = -500, mouseY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hide on touch devices
  const isTouchDevice = 'ontouchstart' in window;

  // ---- Interactive Starfield ----
  (function initStarfield() {
    const canvas = document.getElementById('heroStars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    const STAR_COUNT = 180;
    const CURSOR_RADIUS = 120;       // repulsion zone
    const CURSOR_FORCE = 8;          // push strength
    const RETURN_SPEED = 0.03;       // spring-back speed
    const FRICTION = 0.92;           // velocity damping
    const LINE_DISTANCE = 100;       // max distance for constellation lines
    const LINE_OPACITY = 0.12;

    let stars = [];
    let w, h;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function createStar() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        originX: 0,
        originY: 0,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.1,
        hue: Math.random() < 0.3 ? 260 : (Math.random() < 0.5 ? 220 : 190),
      };
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const s = createStar();
        s.originX = s.x;
        s.originY = s.y;
        stars.push(s);
      }
    }

    function update(time) {
      const heroRect = hero.getBoundingClientRect();
      const mx = mouseX - heroRect.left;
      const my = mouseY - heroRect.top;
      const cursorInHero = mx >= 0 && mx <= w && my >= 0 && my <= h && !isTouchDevice;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Gentle drift
        s.originX += s.driftX;
        s.originY += s.driftY;

        // Wrap around edges
        if (s.originX < -10) s.originX = w + 10;
        if (s.originX > w + 10) s.originX = -10;
        if (s.originY < -10) s.originY = h + 10;
        if (s.originY > h + 10) s.originY = -10;

        // Cursor repulsion
        if (cursorInHero) {
          const dx = s.x - mx;
          const dy = s.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_RADIUS && dist > 0) {
            const force = (CURSOR_RADIUS - dist) / CURSOR_RADIUS * CURSOR_FORCE;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        // Spring back to origin
        s.vx += (s.originX - s.x) * RETURN_SPEED;
        s.vy += (s.originY - s.y) * RETURN_SPEED;

        // Apply friction
        s.vx *= FRICTION;
        s.vy *= FRICTION;

        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Twinkle
        s.currentOpacity = s.opacity * (0.6 + 0.4 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      // Draw constellation lines between nearby stars
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_DISTANCE) {
            const opacity = (1 - dist / LINE_DISTANCE) * LINE_OPACITY;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(139, 130, 230, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = s.currentOpacity || s.opacity;

        // Glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 60%, 75%, ${alpha * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 50%, 90%, ${alpha})`;
        ctx.fill();
      }
    }

    function loop(time) {
      update(time);
      draw(time);
      requestAnimationFrame(loop);
    }

    resize();
    initStars();
    requestAnimationFrame(loop);

    window.addEventListener('resize', () => {
      const oldW = w;
      const oldH = h;
      resize();
      
      if (oldW > 0 && oldH > 0) {
        const scaleX = w / oldW;
        const scaleY = h / oldH;
        stars.forEach(s => {
          s.originX *= scaleX;
          s.originY *= scaleY;
          s.x *= scaleX;
          s.y *= scaleY;
        });
      }
    });
  })();

  // ---- Interactive Geometry Background for Projects Page ----
  (function initProjectsBackground() {
    const canvas = document.getElementById('projectsBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    const SHAPE_COUNT = 40;
    let shapes = [];
    let w, h;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function createShape() {
      const types = ['circle', 'triangle', 'square', 'plus'];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 20 + 10,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2, // upward drift bias
        opacity: Math.random() * 0.15 + 0.05,
        parallaxOffset: Math.random() * 0.5 + 0.1,
        hue: Math.random() < 0.5 ? 260 : (Math.random() < 0.5 ? 220 : 190)
      };
    }

    function initShapes() {
      shapes = [];
      for (let i = 0; i < SHAPE_COUNT; i++) {
        shapes.push(createShape());
      }
    }

    function update() {
      const heroRect = hero.getBoundingClientRect();
      const mx = mouseX - heroRect.left;
      const my = mouseY - heroRect.top;
      const cursorInHero = mx >= 0 && mx <= w && my >= 0 && my <= h && !isTouchDevice;

      shapes.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        if (s.y < -50) s.y = h + 50;
        if (s.x < -50) s.x = w + 50;
        if (s.x > w + 50) s.x = -50;
        if (s.y > h + 50) s.y = -50;

        s.drawX = s.x;
        s.drawY = s.y;

        // Apply mouse parallax
        if (cursorInHero) {
          const dx = (mx - w/2);
          const dy = (my - h/2);
          s.drawX -= dx * s.parallaxOffset * 0.1;
          s.drawY -= dy * s.parallaxOffset * 0.1;
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      shapes.forEach(s => {
        ctx.save();
        ctx.translate(s.drawX, s.drawY);
        ctx.rotate(s.rotation);
        
        ctx.strokeStyle = `hsla(${s.hue}, 70%, 75%, ${s.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        if (s.type === 'circle') {
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        } else if (s.type === 'square') {
          ctx.rect(-s.size/2, -s.size/2, s.size, s.size);
        } else if (s.type === 'triangle') {
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.866, s.size * 0.5);
          ctx.lineTo(-s.size * 0.866, s.size * 0.5);
          ctx.closePath();
        } else if (s.type === 'plus') {
          ctx.moveTo(-s.size/2, 0);
          ctx.lineTo(s.size/2, 0);
          ctx.moveTo(0, -s.size/2);
          ctx.lineTo(0, s.size/2);
        }
        
        ctx.stroke();
        ctx.restore();
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    resize();
    initShapes();
    requestAnimationFrame(loop);

    window.addEventListener('resize', () => {
      const oldW = w;
      const oldH = h;
      resize();

      if (oldW > 0 && oldH > 0) {
        const scaleX = w / oldW;
        const scaleY = h / oldH;
        shapes.forEach(s => {
          s.x *= scaleX;
          s.y *= scaleY;
        });
      }
    });
  })();

  // ---- Navbar scroll effect + scroll progress ----
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
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navbar.classList.toggle('menu-active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navbar.classList.remove('menu-active');
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

  // ---- Parallax effect on hero orbs ----
  const orbs = document.querySelectorAll('.hero-orb');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      orbs.forEach((orb, i) => {
        const speed = 0.15 + i * 0.05;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  }, { passive: true });

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
      
      const tiltX = y * -6; // degrees
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
        // Remove active class and styles from all buttons
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = '';
          b.style.background = '';
          b.style.color = '';
        });
        
        // Add active style to clicked button
        btn.classList.add('active');
        btn.style.borderColor = 'rgba(255,255,255,0.35)';
        btn.style.background = 'rgba(255,255,255,0.07)';
        btn.style.color = 'var(--color-text-primary)';

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = '';
            // ensure it's visible if it was hidden before reveal
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

  // ==== Interactive Network Background ====
  (function initNetworkBackground() {
    const canvas = document.getElementById('contactNetworkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('contact');
    if (!hero) return;

    let width, height;
    let particles = [];
    const mouseRadius = 180;

    function resize() {
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const density = window.innerWidth < 768 ? 20000 : 12000;
      const numParticles = Math.floor((width * height) / density);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    }

    function update() {
      ctx.clearRect(0, 0, width, height);
      
      const heroRect = hero.getBoundingClientRect();
      const isMouseInHero = mouseX >= heroRect.left && mouseX <= heroRect.right && 
                            mouseY >= heroRect.top && mouseY <= heroRect.bottom;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (isMouseInHero) {
          const mx = mouseX - heroRect.left;
          const my = mouseY - heroRect.top;
          const distance = Math.sqrt(Math.pow(mx - p.x, 2) + Math.pow(my - p.y, 2));

          if (distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius;
            p.x -= ((mx - p.x) / distance) * force * 2;
            p.y -= ((my - p.y) / distance) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (distance / 110);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(update);
    }

    window.addEventListener('resize', resize);
    resize();
    update();
  })();

});
