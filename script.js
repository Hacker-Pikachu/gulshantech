// ===========================================================
// Particle network background
// ===========================================================
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const viewTop = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (a.y < viewTop - 50 || a.y > viewBottom + 50) continue;

      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 0, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }
})();

// ===========================================================
// Cursor glow (desktop / hover-capable devices only)
// ===========================================================
if (window.matchMedia('(hover: hover)').matches) {
  const cursorGlow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

// ===========================================================
// Typewriter effect (hero tagline)
// ===========================================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'I grow ideas the way I grow crops.',
    'B.Tech CSE student at LPU.',
    'Building Smart Agriculture solutions.',
    'One careful iteration at a time.',
  ];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 30 : 55);
  }
  tick();
})();

// ===========================================================
// 3D tilt effect on project cards
// ===========================================================
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--ry', `${x * 14}deg`);
    card.style.setProperty('--rx', `${-y * 14}deg`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

// ===========================================================
// Footer year
// ===========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ===========================================================
// Theme toggle (dark / light), persisted in localStorage
// ===========================================================
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.setAttribute('data-theme', 'light');
}

function updateThemeIcon() {
  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-leaf"></i>'
    : '<i class="fa-solid fa-seedling"></i>';
}
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  if (next === 'dark') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon();
});

// ===========================================================
// Mobile nav toggle
// ===========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ===========================================================
// Navbar background on scroll + scroll progress bar
// ===========================================================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  navbar.classList.toggle('scrolled', scrollTop > 20);
  scrollProgress.style.width = progress + '%';
  backToTop.classList.toggle('visible', scrollTop > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================================================
// Active nav link highlighting based on section in view
// ===========================================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// ===========================================================
// Reveal-on-scroll animations
// ===========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ===========================================================
// Skill bar fill animation
// ===========================================================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const level = fill.getAttribute('data-level') || 0;
      fill.style.width = level + '%';
      observer.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===========================================================
// Animated stat counters (About section)
// ===========================================================
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const isDecimal = String(target).includes('.');
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * progress;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(stat => statObserver.observe(stat));

// ===========================================================
// Certificate lightbox
// ===========================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    lightboxImg.src = card.getAttribute('data-full');
    lightboxImg.alt = card.getAttribute('data-caption') || '';
    lightboxCaption.textContent = card.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===========================================================
// Contact form validation
// ===========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setError(fieldName, message) {
  const errorEl = contactForm.querySelector(`.error-msg[data-for="${fieldName}"]`);
  const inputEl = contactForm.querySelector(`[name="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.toggle('invalid', Boolean(message));
}

function validateForm(data) {
  let valid = true;

  if (!data.name.trim()) {
    setError('name', 'Please enter your name.');
    valid = false;
  } else {
    setError('name', '');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email.trim())) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('email', '');
  }

  if (!data.message.trim() || data.message.trim().length < 10) {
    setError('message', 'Message should be at least 10 characters.');
    valid = false;
  } else {
    setError('message', '');
  }

  return valid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: contactForm.name.value,
    email: contactForm.email.value,
    message: contactForm.message.value,
  };

  if (!validateForm(data)) {
    formStatus.textContent = '';
    return;
  }

  // NOTE: There is no backend wired up yet, so this just confirms locally.
  // To actually receive messages, connect this form to a service like
  // Formspree (https://formspree.io) or EmailJS, or open the user's mail
  // client with a mailto link, then submit the request there instead of
  // e.preventDefault() above.
  formStatus.textContent = `Thanks, ${data.name.split(' ')[0]}! Your message is ready to send — connect a form service to deliver it.`;
  contactForm.reset();
});
