'use strict';

/* ═══════════════════════════════════════════
   CORE UI  — funciona aunque GSAP no cargue
═══════════════════════════════════════════ */

// ── Scroll progress bar ──────────────────────
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}, { passive: true });

// ── Navbar blur al hacer scroll ──────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Menú móvil ───────────────────────────────
function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('hamburger-icon');
  if (menu) menu.classList.remove('open');
  if (icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
}
window.closeMobileMenu = closeMobileMenu; // accesible desde onclick=""

const hamburger = document.getElementById('hamburger-btn');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    if (icon) {
      icon.innerHTML = isOpen
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  });
}

// Cerrar menú al pulsar cualquier enlace del menú móvil
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ── Smooth scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

// ── Formulario ───────────────────────────────
window.handleFormSubmit = function (e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('form-success');
  if (!success) return;

  const doSwap = () => {
    form.style.display = 'none';
    success.classList.remove('hidden');
    success.style.opacity = '0';
    requestAnimationFrame(() => {
      success.style.transition = 'opacity 0.4s ease';
      success.style.opacity = '1';
    });
  };

  if (typeof gsap !== 'undefined') {
    gsap.to(form, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: doSwap });
  } else {
    form.style.transition = 'opacity 0.3s';
    form.style.opacity = '0';
    setTimeout(doSwap, 300);
  }
};

/* ═══════════════════════════════════════════
   GSAP ANIMATIONS — degradación elegante
═══════════════════════════════════════════ */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // GSAP no cargó: mostrar todos los elementos ocultos
    document.querySelectorAll(
      '.hero-badge,.hero-line-1,.hero-line-2,.hero-line-3,.hero-sub,.hero-ctas,.hero-trust,.hero-illustration-wrap,.float-badge-1,.float-badge-2,.float-badge-3'
    ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Ocultar hero elements antes de animar ──
  gsap.set([
    '.hero-badge', '.hero-line-1', '.hero-line-2', '.hero-line-3',
    '.hero-sub', '.hero-ctas', '.hero-trust',
    '.hero-illustration-wrap', '.float-badge-1', '.float-badge-2', '.float-badge-3'
  ], { opacity: 0 });

  // ── 1. Hero entrance timeline ───────────────
  // Los scripts están al final del <body>: DOMContentLoaded ya se disparó.
  // Usamos readyState + rAF para ejecutar siempre en el siguiente frame.
  function runHeroTimeline() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .to('.hero-badge',            { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 0.15)
      .from('.hero-badge',          { y: -16 }, '<')
      .to('.hero-line-1',           { opacity: 1, y: 0, duration: 0.60 }, 0.35)
      .from('.hero-line-1',         { y: 30 }, '<')
      .to('.hero-line-2',           { opacity: 1, y: 0, duration: 0.60 }, 0.50)
      .from('.hero-line-2',         { y: 30 }, '<')
      .to('.hero-line-3',           { opacity: 1, y: 0, duration: 0.60 }, 0.65)
      .from('.hero-line-3',         { y: 30 }, '<')
      .to('.hero-sub',              { opacity: 1, y: 0, duration: 0.55 }, 0.82)
      .from('.hero-sub',            { y: 18 }, '<')
      .to('.hero-ctas',             { opacity: 1, y: 0, duration: 0.50 }, 0.96)
      .from('.hero-ctas',           { y: 16 }, '<')
      .to('.hero-trust',            { opacity: 1, duration: 0.45 }, 1.08)
      .to('.hero-illustration-wrap',{ opacity: 1, x: 0, duration: 0.75, ease: 'power2.out' }, 0.40)
      .from('.hero-illustration-wrap', { x: 50 }, '<')
      .to('.float-badge-1',         { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }, 0.90)
      .from('.float-badge-1',       { scale: 0.7 }, '<')
      .to('.float-badge-2',         { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }, 1.05)
      .from('.float-badge-2',       { scale: 0.7 }, '<')
      .to('.float-badge-3',         { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }, 1.18)
      .from('.float-badge-3',       { scale: 0.7 }, '<');
  }

  // Lanzar: si el DOM ya cargó (script al final de body) → rAF; si no → esperar evento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runHeroTimeline);
  } else {
    requestAnimationFrame(runHeroTimeline);
  }

  // ── 2. Parallax blobs ───────────────────────
  gsap.to('.hero-blob-1', { y: -80, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  gsap.to('.hero-blob-2', { y: -50, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.8 } });

  // ── 3. Stats counters ───────────────────────
  function animateCounter(el, target, dur) {
    const obj = { val: 0 };
    gsap.to(obj, { val: target, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(obj.val); } });
  }
  ScrollTrigger.create({
    trigger: '.stats-section', start: 'top 80%', once: true,
    onEnter: () => {
      const s1 = document.getElementById('stat-1');
      const s2 = document.getElementById('stat-2');
      const s3 = document.getElementById('stat-3');
      if (s1) animateCounter(s1, 100, 1.6);
      if (s2) animateCounter(s2, 98,  1.6);
      if (s3) animateCounter(s3, 3,   1.2);
    }
  });
  gsap.from('.stat-item', { opacity: 0, y: 26, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.stats-section', start: 'top 80%', once: true } });

  // ── 4. Section headers ──────────────────────
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });

  // ── 5. Service cards ─────────────────────────
  // Sin stagger en Y: evita el efecto escalera y el conflicto GSAP/CSS transform.
  // Las tres cards se revelan juntas con una leve subida sincronizada.
  gsap.fromTo('.service-card',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.65, stagger: 0, ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '#servicios .grid', start: 'top 78%', once: true }
    }
  );

  // ── 6. Portfolio cards (desde los lados) ────
  gsap.fromTo('.portfolio-left',
    { opacity: 0, x: -55 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.portfolio-left',  start: 'top 82%', once: true } }
  );
  gsap.fromTo('.portfolio-right',
    { opacity: 0, x: 55 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.portfolio-right', start: 'top 82%', once: true } }
  );

  // ── 7. Pricing cards ────────────────────────
  gsap.fromTo('.pricing-side-left',
    { opacity: 0, x: -50, scale: 0.97 },
    { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#precios .grid', start: 'top 78%', once: true } }
  );
  gsap.fromTo('.pricing-popular',
    { opacity: 0, y: 45, scale: 0.93 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1, ease: 'back.out(1.3)', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#precios .grid', start: 'top 78%', once: true } }
  );
  gsap.fromTo('.pricing-side-right',
    { opacity: 0, x: 50, scale: 0.97 },
    { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#precios .grid', start: 'top 78%', once: true } }
  );

  // ── 8. Trust section ────────────────────────
  gsap.fromTo('.trust-card',
    { opacity: 0, scale: 0.95, y: 28 },
    { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.trust-section', start: 'top 78%', once: true } }
  );
  gsap.fromTo('.trust-feature',
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.14, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.trust-section', start: 'top 75%', once: true } }
  );

  // ── 9. Contact card ─────────────────────────
  gsap.fromTo('.contact-card',
    { opacity: 0, y: 48 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.contact-card', start: 'top 82%', once: true } }
  );

})();
