// WhiteAura Security — Script v2 (WOW)

(() => {
  'use strict';

  // ---- Mobile nav toggle ----
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Fade-in on scroll ----
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  faders.forEach(el => observer.observe(el));

  // ---- Parallax on scroll ----
  const parallaxSections = document.querySelectorAll('.section-header');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    parallaxSections.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = center * 0.04;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });

  // ---- Service card mouse glow ----
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100);
      const y = ((e.clientY - rect.top) / rect.height * 100);
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ---- Particles Canvas ----
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse = { x: -1000, y: -1000 };
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 140;
    const MOUSE_DIST = 180;

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
          o: Math.random() * 0.4 + 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = `rgba(123, 104, 238, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        // Mouse interaction
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_DIST) {
          const force = (1 - mDist / MOUSE_DIST) * 0.03;
          p.vx += mdx * force;
          p.vy += mdy * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 104, 238, ${p.o})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => { resize(); });
    resize();
    createParticles();
    draw();
  }

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + (el.dataset.suffix || '');
          }, 20);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

})();
