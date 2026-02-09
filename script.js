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

  const isMobileDevice = window.innerWidth < 768;
  const PARTICLE_CONFIG = {
    count: isMobileDevice ? 25 : 60,
    color: { r: 200, g: 196, b: 190 },     // --wa-particle
    accentColor: { r: 0, g: 85, b: 255 },   // --wa-accent
    maxSize: isMobileDevice ? 2.5 : 3,
    minSize: 1,
    speed: 0.3,
    mouseRadius: isMobileDevice ? 0 : 150,
    mouseForce: isMobileDevice ? 0 : 0.02,
    connectionDistance: isMobileDevice ? 80 : 120,
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

  // ─── PARALLAX PHOTOS ─────────────────────
  const parallaxDiego = document.getElementById('parallaxDiego');
  const parallaxAura = document.getElementById('parallaxAura');
  const parallaxContainer = document.getElementById('parallaxPhotos');

  if (parallaxDiego && parallaxAura) {
    const heroEl = document.getElementById('hero');
    const aboutEl = document.getElementById('about');
    const isMobile = window.innerWidth < 768;

    // SVG filter for dissolve effect
    const svgFilter = document.getElementById('dissolveFilter');
    const feDisplacement = svgFilter ? svgFilter.querySelector('feDisplacementMap') : null;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      const aboutTop = aboutEl.offsetTop;
      const triggerStart = heroBottom * 0.3;
      const triggerEnd = aboutTop + 300;
      const range = triggerEnd - triggerStart;

      if (scrollY < triggerStart || scrollY > triggerEnd + 400) {
        parallaxDiego.style.opacity = '0';
        parallaxAura.style.opacity = '0';
        return;
      }

      // Progress 0→1 through the scroll range
      const rawProgress = Math.min(1, Math.max(0, (scrollY - triggerStart) / range));
      // Ease in-out
      const progress = rawProgress < 0.5
        ? 2 * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      // Fade out after the range
      let fadeOut = 1;
      if (scrollY > triggerEnd) {
        fadeOut = Math.max(0, 1 - (scrollY - triggerEnd) / 400);
      }

      // Opacity: 0 → 0.55
      const opacity = progress * 0.55 * fadeOut;

      // Position: from off-screen to center-ish
      const startOffsetX = isMobile ? 30 : 45; // % from edge
      const endOffsetX = isMobile ? 5 : 15;
      const offsetX = startOffsetX - (startOffsetX - endOffsetX) * progress;

      parallaxDiego.style.opacity = opacity;
      parallaxAura.style.opacity = opacity;

      if (isMobile) {
        // Simpler: just fade in, centered
        parallaxDiego.style.left = `-${offsetX}%`;
        parallaxAura.style.right = `-${offsetX}%`;
      } else {
        parallaxDiego.style.left = `${-startOffsetX + (startOffsetX + endOffsetX) * progress}%`;
        parallaxAura.style.right = `${-startOffsetX + (startOffsetX + endOffsetX) * progress}%`;
      }

      // Dissolve effect via SVG filter — scale goes from 80 (max distortion) to 0
      const dissolveScale = Math.round(80 * (1 - progress));
      if (feDisplacement) {
        feDisplacement.setAttribute('scale', dissolveScale);
      }

      // Apply filter only while dissolving
      if (dissolveScale > 1) {
        parallaxDiego.style.filter = 'url(#dissolveFilter)';
        parallaxAura.style.filter = 'url(#dissolveFilter)';
      } else {
        parallaxDiego.style.filter = 'none';
        parallaxAura.style.filter = 'none';
      }

      // Slight vertical parallax
      const yShift = (1 - progress) * 20;
      parallaxDiego.style.transform = `translateY(calc(-50% + ${yShift}px))`;
      parallaxAura.style.transform = `translateY(calc(-50% - ${yShift}px))`;
    }

    // Show/hide the fixed container based on scroll position
    function updateParallaxVisibility() {
      const scrollY = window.scrollY;
      const aboutBottom = aboutEl.offsetTop + aboutEl.offsetHeight;
      parallaxContainer.style.display = scrollY > aboutBottom ? 'none' : '';
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        updateParallax();
        updateParallaxVisibility();
      });
    }, { passive: true });

    // Initial call
    updateParallax();
  }

  // ─── LANGUAGE SELECTOR ────────────────────
  const i18nData = {
    en: {
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.process': 'Process',
      'nav.results': 'Results',
      'nav.contact': 'Contact',
      'hero.label': 'ETHICAL SECURITY RESEARCH',
      'hero.title1': 'Finding vulnerabilities',
      'hero.title2html': 'before they <em>find you.</em>',
      'hero.sub': 'Human expertise meets AI intelligence — continuous security research that never sleeps.',
      'hero.cta1': 'Get in Touch',
      'hero.cta2': 'Explore Services',
      'stats.vulns': 'Vulnerabilities Found',
      'stats.labs': 'PortSwigger Labs',
      'stats.coverage': 'Research Coverage',
      'stats.disclosure': 'Responsible Disclosure',
      'about.label': '01 — About',
      'about.titlehtml': 'We don\'t just find<br>vulnerabilities.<br><em>We eliminate them.</em>',
      'about.lead': 'WhiteAura Security is an ethical security research firm built on a unique synergy: a skilled human researcher and a dedicated AI partner working in continuous cycles.',
      'about.p1html': 'While traditional firms rely solely on human hours, we operate a <strong>continuous research pipeline</strong> — combining creative intuition with AI-driven analysis, automation, and around-the-clock coverage.',
      'about.p2html': 'Every vulnerability we find is reported ethically, documented thoroughly, and verified before delivery. We follow <strong>responsible disclosure</strong> principles. Always.',
      'team.diego.role': 'Lead Security Researcher',
      'team.diego.desc': 'Automation specialist turned security researcher. Web application testing, logic flaw analysis, and DeFi protocol auditing. Drives strategy and creative attack paths.',
      'team.aura.role': 'AI Research Partner — 24/7',
      'team.aura.desc': 'Specialized in DOM analysis, API testing, code review, and automated reconnaissance. Continuous monitoring, report generation, and scalable research capacity.',
      'services.label': '02 — Services',
      'services.title': 'What We Do',
      'services.desc': 'Targeted security research across web, API, and blockchain.',
      'services.s1.titlehtml': 'Bug Bounty<br>Research',
      'services.s1.desc': 'Active participation in leading bug bounty programs. Hunting critical vulnerabilities across web applications, APIs, and mobile platforms. Every finding backed by detailed, reproducible proof of concept.',
      'services.s2.titlehtml': 'Web Application<br>Security',
      'services.s2.desc': 'Comprehensive assessments covering OWASP Top 10 and beyond — access control flaws, injection attacks, authentication bypasses, business logic vulnerabilities, and server misconfigurations.',
      'services.s3.titlehtml': 'DeFi & Smart<br>Contract Auditing',
      'services.s3.desc': 'Security review of decentralized protocols, smart contracts, and blockchain integrations. Economic attack vectors, oracle manipulation risks, and access control vulnerabilities in on-chain systems.',
      'method.label': '03 — Process',
      'method.title': 'Our Methodology',
      'method.desc': 'A structured, repeatable approach — from reconnaissance to remediation.',
      'method.s1.title': 'Reconnaissance',
      'method.s1.desc': 'Asset discovery, subdomain enumeration, technology fingerprinting. Custom-built recon tools for maximum coverage.',
      'method.s2.title': 'Mapping',
      'method.s2.desc': 'Full application mapping — endpoints, roles, data flows, authentication mechanisms, and undocumented API surfaces.',
      'method.s3.title': 'Analysis',
      'method.s3.desc': 'Systematic vulnerability assessment: OWASP methodology, logic flaws, access control, injection, authentication bypass.',
      'method.s4.title': 'Exploitation',
      'method.s4.desc': 'Controlled proof-of-concept development. Demonstrate real impact without causing damage.',
      'method.s5.title': 'Reporting',
      'method.s5.desc': 'Clear, actionable reports with severity ratings, reproduction steps, remediation guidance, and verification of fixes.',
      'proof.label': '04 — Results',
      'proof.title': 'Built on Real Findings',
      'proof.c1.title': 'PortSwigger Academy',
      'proof.c1.desc': 'All labs completed — comprehensive mastery across every web security vulnerability class.',
      'proof.c2.title': 'DeFi Protocol Vulnerability',
      'proof.c2.desc': 'Identified and responsibly disclosed a real vulnerability in Drift Protocol — a live DeFi platform with millions in TVL.',
      'proof.c3.title': 'Reconnaissance Tooling',
      'proof.c3.desc': 'Purpose-built tools: subdomain enumeration, tech fingerprinting, header analysis, IDOR detection, and more.',
      'contact.label': '05 — Contact',
      'contact.titlehtml': 'Let\'s secure<br>your perimeter.',
      'contact.sub': 'Have a project in mind, need a security assessment, or want to discuss responsible disclosure? We typically respond within 24 hours.',
      'contact.form.name': 'Name',
      'contact.form.message': 'Message',
      'contact.form.send': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.note': 'We typically respond within 24 hours. All communications are confidential.',
    },
    es: {
      'nav.about': 'Nosotros',
      'nav.services': 'Servicios',
      'nav.process': 'Metodología',
      'nav.results': 'Resultados',
      'nav.contact': 'Contacto',
      'hero.label': 'INVESTIGACIÓN DE SEGURIDAD ÉTICA',
      'hero.title1': 'Encontramos vulnerabilidades',
      'hero.title2html': 'antes de que <em>te encuentren.</em>',
      'hero.sub': 'Expertise humano e inteligencia artificial — investigación de seguridad continua que nunca duerme.',
      'hero.cta1': 'Contactar',
      'hero.cta2': 'Servicios',
      'stats.vulns': 'Vulnerabilidades Encontradas',
      'stats.labs': 'Labs PortSwigger',
      'stats.coverage': 'Cobertura de Investigación',
      'stats.disclosure': 'Divulgación Responsable',
      'about.label': '01 — Nosotros',
      'about.titlehtml': 'No solo encontramos<br>vulnerabilidades.<br><em>Las eliminamos.</em>',
      'about.lead': 'WhiteAura Security es una firma de investigación de seguridad ética construida sobre una sinergia única: un investigador humano experimentado y un partner de IA dedicado trabajando en ciclos continuos.',
      'about.p1html': 'Mientras las firmas tradicionales dependen solo de horas humanas, nosotros operamos un <strong>pipeline de investigación continuo</strong> — combinando intuición creativa con análisis impulsado por IA, automatización y cobertura las 24 horas.',
      'about.p2html': 'Cada vulnerabilidad que encontramos se reporta éticamente, se documenta a fondo y se verifica antes de la entrega. Seguimos principios de <strong>divulgación responsable</strong>. Siempre.',
      'team.diego.role': 'Investigador de Seguridad Principal',
      'team.diego.desc': 'Especialista en automatización convertido en investigador de seguridad. Testing de aplicaciones web, análisis de fallos lógicos y auditoría de protocolos DeFi. Dirige la estrategia y rutas de ataque creativas.',
      'team.aura.role': 'Partner de IA — 24/7',
      'team.aura.desc': 'Especializada en análisis DOM, testing de APIs, revisión de código y reconocimiento automatizado. Monitoreo continuo, generación de reportes y capacidad de investigación escalable.',
      'services.label': '02 — Servicios',
      'services.title': 'Qué Hacemos',
      'services.desc': 'Investigación de seguridad dirigida en web, API y blockchain.',
      'services.s1.titlehtml': 'Bug Bounty<br>Research',
      'services.s1.desc': 'Participación activa en programas de bug bounty líderes. Cazando vulnerabilidades críticas en aplicaciones web, APIs y plataformas móviles. Cada hallazgo respaldado por pruebas de concepto detalladas y reproducibles.',
      'services.s2.titlehtml': 'Seguridad de<br>Aplicaciones Web',
      'services.s2.desc': 'Evaluaciones integrales cubriendo OWASP Top 10 y más — fallos de control de acceso, ataques de inyección, bypasses de autenticación, vulnerabilidades de lógica de negocio y misconfiguraciones de servidor.',
      'services.s3.titlehtml': 'Auditoría DeFi &<br>Smart Contracts',
      'services.s3.desc': 'Revisión de seguridad de protocolos descentralizados, smart contracts e integraciones blockchain. Vectores de ataque económico, riesgos de manipulación de oráculos y vulnerabilidades de control de acceso en sistemas on-chain.',
      'method.label': '03 — Proceso',
      'method.title': 'Nuestra Metodología',
      'method.desc': 'Un enfoque estructurado y repetible — desde el reconocimiento hasta la remediación.',
      'method.s1.title': 'Reconocimiento',
      'method.s1.desc': 'Descubrimiento de activos, enumeración de subdominios, fingerprinting tecnológico. Herramientas de reconocimiento personalizadas para máxima cobertura.',
      'method.s2.title': 'Mapeo',
      'method.s2.desc': 'Mapeo completo de la aplicación — endpoints, roles, flujos de datos, mecanismos de autenticación y superficies de API no documentadas.',
      'method.s3.title': 'Análisis',
      'method.s3.desc': 'Evaluación sistemática de vulnerabilidades: metodología OWASP, fallos lógicos, control de acceso, inyección, bypass de autenticación.',
      'method.s4.title': 'Explotación',
      'method.s4.desc': 'Desarrollo controlado de pruebas de concepto. Demostrar impacto real sin causar daño.',
      'method.s5.title': 'Reportes',
      'method.s5.desc': 'Reportes claros y accionables con clasificación de severidad, pasos de reproducción, guía de remediación y verificación de correcciones.',
      'proof.label': '04 — Resultados',
      'proof.title': 'Construido sobre Hallazgos Reales',
      'proof.c1.title': 'PortSwigger Academy',
      'proof.c1.desc': 'Todos los labs completados — dominio completo en cada clase de vulnerabilidad de seguridad web.',
      'proof.c2.title': 'Vulnerabilidad en Protocolo DeFi',
      'proof.c2.desc': 'Identificamos y divulgamos responsablemente una vulnerabilidad real en Drift Protocol — una plataforma DeFi en producción con millones en TVL.',
      'proof.c3.title': 'Herramientas de Reconocimiento',
      'proof.c3.desc': 'Herramientas a medida: enumeración de subdominios, fingerprinting tecnológico, análisis de headers, detección de IDOR y más.',
      'contact.label': '05 — Contacto',
      'contact.titlehtml': 'Aseguremos<br>tu perímetro.',
      'contact.sub': '¿Tienes un proyecto en mente, necesitas una evaluación de seguridad o quieres discutir divulgación responsable? Normalmente respondemos en 24 horas.',
      'contact.form.name': 'Nombre',
      'contact.form.message': 'Mensaje',
      'contact.form.send': 'Enviar Mensaje',
      'contact.form.sending': 'Enviando...',
      'contact.form.note': 'Normalmente respondemos en 24 horas. Todas las comunicaciones son confidenciales.',
    }
  };

  let currentLang = 'en';
  const langToggle = document.getElementById('langToggle');

  function setLanguage(lang) {
    currentLang = lang;
    const data = i18nData[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!data[key]) return;
      if (key.endsWith('html')) {
        el.innerHTML = data[key];
      } else {
        el.textContent = data[key];
      }
    });
    // Update active lang indicator
    langToggle.querySelectorAll('.lang-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'es' : 'en');
    });
    // Set initial state
    setLanguage('en');
  }

})();
