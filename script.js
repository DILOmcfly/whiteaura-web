// WhiteAura Security — Script

(() => {
  'use strict';

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close mobile nav on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // Fade-in on scroll (IntersectionObserver)
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(el => observer.observe(el));

  // Navbar background on scroll
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.style.borderBottomColor = window.scrollY > 10
          ? 'rgba(0,0,0,0.06)'
          : 'transparent';
        ticking = false;
      });
      ticking = true;
    }
  });
})();
