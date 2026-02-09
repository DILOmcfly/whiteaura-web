/* ============================================
   WhiteAura Security — Premium Interactions
   ============================================ */

(function() {
  'use strict';

  // ─── LOADER ───────────────────────────────
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initRevealAnimations();
      animateHero();
    }, 1200);
  });

  // ─── PARTICLES ────────────────────────────
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animFrame;

  const PARTICLE_CONFIG = {
    count: window.innerWidth < 768 ? 25 : 60,
    color: { r: 200, g: 196, b: 190 },     // --wa-particle
    accentColor: { r: 0, g: 85, b: 255 },   // --wa-accent
    maxSize: 3,
    minSize: 1,
    speed: 0.3,
    mouseRadius: 150,
    mouseForce: 0.02,
    connectionDistance: 120,
    connectionOpacity: 0.06,
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize) + PARTICLE_CONFIG.minSize;
      this.baseSize = this.size;
      this.vx = (Math.random() - 0.5) * PARTICLE_CONFIG.speed;
      this.vy = (Math.random() - 0.5) * PARTICLE_CONFIG.speed;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.baseOpacity = this.opacity;
    }

    update() {
      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PARTICLE_CONFIG.mouseRadius) {
        const force = (1 - dist / PARTICLE_CONFIG.mouseRadius) * PARTICLE_CONFIG.mouseForce;
        this.vx += dx * force;
        this.vy += dy * force;
        this.opacity = Math.min(1, this.baseOpacity + (1 - dist / PARTICLE_CONFIG.mouseRadius) * 0.6);
        this.size = this.baseSize + (1 - dist / PARTICLE_CONFIG.mouseRadius) * 2;
      } else {
        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
        this.size += (this.baseSize - this.size) * 0.05;
      }

      // Apply velocity with damping
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Add slight drift
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;

      // Wrap edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isNearMouse = dist < PARTICLE_CONFIG.mouseRadius;

      const c = isNearMouse ? PARTICLE_CONFIG.accentColor : PARTICLE_CONFIG.color;
      const blend = isNearMouse ? (1 - dist / PARTICLE_CONFIG.mouseRadius) : 0;
      const r = Math.round(PARTICLE_CONFIG.color.r + (PARTICLE_CONFIG.accentColor.r - PARTICLE_CONFIG.color.r) * blend);
      const g = Math.round(PARTICLE_CONFIG.color.g + (PARTICLE_CONFIG.accentColor.g - PARTICLE_CONFIG.color.g) * blend);
      const b = Math.round(PARTICLE_CONFIG.color.b + (PARTICLE_CONFIG.accentColor.b - PARTICLE_CONFIG.color.b) * blend);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PARTICLE_CONFIG.connectionDistance) {
          const opacity = (1 - dist / PARTICLE_CONFIG.connectionDistance) * PARTICLE_CONFIG.connectionOpacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 196, 190, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animateParticles);
  }

  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: PARTICLE_CONFIG.count }, () => new Particle());
    animateParticles();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    PARTICLE_CONFIG.count = window.innerWidth < 768 ? 25 : 60;
    // Adjust particle count
    while (particles.length > PARTICLE_CONFIG.count) particles.pop();
    while (particles.length < PARTICLE_CONFIG.count) particles.push(new Particle());
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  initParticles();

  // ─── CUSTOM CURSOR ────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 3 + 'px';
      cursor.style.top = e.clientY - 3 + 'px';
      cursorTrail.style.left = e.clientX - 12 + 'px';
      cursorTrail.style.top = e.clientY - 12 + 'px';
    });

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .proof-card, .team-card, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorTrail.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorTrail.classList.remove('hover');
      });
    });
  }

  // ─── NAVBAR ───────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ─── SCROLL REVEAL ────────────────────────
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-word');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ─── HERO ANIMATIONS ─────────────────────
  function animateHero() {
    const lines = document.querySelectorAll('.hero .reveal-line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), 200 + i * 200);
    });

    const words = document.querySelectorAll('.hero .reveal-word');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 100 + i * 150);
    });

    const ups = document.querySelectorAll('.hero .reveal-up');
    ups.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 600 + i * 200);
    });
  }

  // ─── STATS COUNTER ────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statNumbers.length > 0) {
    statsObserver.observe(statNumbers[0].closest('.stats-bar'));
  }

  function animateCounters() {
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    });
  }

  // ─── TERMINAL TYPING EFFECT ───────────────
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const lines = terminalBody.querySelectorAll('.terminal-line');
    let terminalRevealed = false;

    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !terminalRevealed) {
          terminalRevealed = true;
          lines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            line.style.transition = `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`;
            setTimeout(() => {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, 50);
          });
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalBody);
  }

  // ─── FORM SUBMIT ──────────────────────────
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const btn = document.getElementById('submitBtn');
      const btnText = btn.querySelector('.btn-text');
      const btnSending = btn.querySelector('.btn-sending');
      btnText.style.display = 'none';
      btnSending.style.display = 'inline';
      btn.disabled = true;
    });
  }

  // ─── SMOOTH SCROLL ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
