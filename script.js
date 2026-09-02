// Preloader
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const text = document.getElementById('preloaderText');
  const messages = ['Loading assets...', 'Initializing particles...', 'Preparing interface...', 'Almost ready...', 'Welcome!'];
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      text.textContent = messages[messages.length - 1];
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        document.querySelectorAll('.reveal').forEach((el, i) => {
          if (isInViewport(el)) setTimeout(() => el.classList.add('is-visible'), i * 100);
        });
      }, 800);
    } else {
      fill.style.width = progress + '%';
      const msgIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 2);
      text.textContent = messages[msgIndex] || 'Loading...';
    }
  }, 120);
  document.body.style.overflow = 'hidden';
})();

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// Custom cursor with trail
(function initCustomCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  const glow = document.getElementById('cursorGlow');
  const trailCount = 5;
  const trails = [];
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.width = (6 - i) + 'px';
    trail.style.height = (6 - i) + 'px';
    trail.style.opacity = 0.3 - (i * 0.05);
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    glow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  function animateCursor() {
    if (document.hidden) { requestAnimationFrame(animateCursor); return; }
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    let prevX = dotX, prevY = dotY;
    trails.forEach((trail, i) => {
      trail.x += (prevX - trail.x) * (0.3 - i * 0.05);
      trail.y += (prevY - trail.y) * (0.3 - i * 0.05);
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
      trail.el.style.transform = 'translate(-50%, -50%)';
      prevX = trail.x;
      prevY = trail.y;
    });
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .magnetic, input, textarea, .card, .project-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
})();

// Toast
const Toast = {
  container: document.getElementById('toastContainer'),
  show(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const titles = { success: 'Success', error: 'Error', info: 'Info', warning: 'Warning' };
    toast.innerHTML = `<i class="fa-solid ${icons[type]} toast-icon ${type}"></i><div class="toast-content"><div class="toast-title">${title || titles[type]}</div><div class="toast-message">${message}</div></div><button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 5000);
  }
};

// Text scramble
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#________';
    this.originalText = el.textContent;
    this.frame = 0;
    this.queue = [];
    this.isAnimating = false;
  }
  setText(text) {
    const length = Math.max(this.originalText.length, text.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = this.originalText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    if (!this.isAnimating) { this.isAnimating = true; this.frame = 0; this.update(); }
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end } = this.queue[i];
      let char = this.queue[i].char;
      if (this.frame >= end) { complete++; output += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; }
        output += `<span style="color: var(--magenta)">${char}</span>`;
      } else { output += from; }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) { this.isAnimating = false; this.resolve(); }
    else { this.frame++; requestAnimationFrame(() => this.update()); }
  }
  randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}

(function initScramble() {
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const fx = new TextScramble(el);
    const original = el.textContent;
    el.addEventListener('mouseenter', () => fx.setText(original));
  });
})();

// Magnetic buttons
(function initMagnetic() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

// Particles
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 180 };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  }
  function createParticles() {
    const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2.5 + 0.5, opacity: Math.random() * 0.5 + 0.3,
    }));
  }
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX + window.scrollX;
    mouse.y = e.clientY + window.scrollY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  let frameCount = 0;
  function step() {
    if (document.hidden) { requestAnimationFrame(step); return; }
    frameCount++;
    if (frameCount % 2 !== 0) { requestAnimationFrame(step); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const viewTop = window.scrollY - 100;
    const viewBottom = viewTop + window.innerHeight + 200;
    particles.forEach(p => {
      if (mouse.x != null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx -= (dx / dist) * force * 0.6;
          p.vy -= (dy / dist) * force * 0.6;
        }
      }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.98; p.vy *= 0.98;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (a.y < viewTop - 100 || a.y > viewBottom + 100) continue;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${a.opacity})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const alpha = 0.25 * (1 - dist / 160);
          ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  resize(); createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
  if (!prefersReducedMotion) requestAnimationFrame(step);
})();

// Parallax
(function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.speed) || 0.05;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// Typewriter
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = ['Innovating with code inspired by creativity.', 'B.Tech CSE student at LPU.', 'Building Smart Agriculture solutions.', 'Creative developer & problem solver.'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) { el.textContent = phrases[0]; return; }
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) { deleting = true; setTimeout(tick, 2500); return; }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 30 : 50);
  }
  tick();
})();

// 3D tilt
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--ry', `${x * 15}deg`);
    card.style.setProperty('--rx', `${-y * 15}deg`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('portfolio-theme');
const favicon = document.getElementById('dynamicFavicon');

function updateFavicon(isLight) {
  const bg = isLight ? 'eef0fb' : '0a0a0f';
  const cyan = isLight ? '%23007a7a' : '%2300ffff';
  const magenta = isLight ? '%23a300a3' : '%23ff00ff';
  const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='${cyan}'/%3E%3Cstop offset='100%25' stop-color='${magenta}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='22' fill='%23${bg}'/%3E%3Ctext x='50' y='68' font-size='58' font-family='Arial, sans-serif' font-weight='700' text-anchor='middle' fill='url(%23g)'%3EG%3C/text%3E%3C/svg%3E`;
  favicon.href = svg;
}

if (savedTheme) {
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.setAttribute('data-theme', 'light');
}

function updateThemeIcon() {
  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-leaf"></i>' : '<i class="fa-solid fa-seedling"></i>';
  updateFavicon(isLight);
}
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  if (next === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', 'light');
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon();
  Toast.show(`Switched to ${next} mode`, 'info', 'Theme');
});

// Mobile nav
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

// Navbar scroll behavior
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
let lastScrollTop = 0;

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  navbar.classList.toggle('scrolled', scrollTop > 30);
  scrollProgress.style.width = progress + '%';
  backToTop.classList.toggle('visible', scrollTop > 500);
  if (scrollTop > lastScrollTop && scrollTop > 200) navbar.classList.add('hidden');
  else navbar.classList.remove('hidden');
  lastScrollTop = scrollTop;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// Active nav links
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => { link.classList.toggle('active', link.getAttribute('href') === `#${id}`); });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
sections.forEach(section => navObserver.observe(section));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('is-visible'); }, index * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Skill bars
const skillBars = document.querySelectorAll('.skill-bar');
const skillFills = document.querySelectorAll('.skill-fill');
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('is-visible'); }, index * 150);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillBarObserver.observe(bar));

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

// Radar chart
(function drawRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  const skills = [{ name: 'Python', value: 0.6 }, { name: 'Java', value: 0.4 }, { name: 'Web Dev', value: 0.5 }, { name: 'Database', value: 0.3 }];
  const centerX = size / 2, centerY = size / 2, radius = 100;
  const angleStep = (Math.PI * 2) / skills.length;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    const r = (radius / 4) * i;
    for (let j = 0; j <= skills.length; j++) {
      const angle = j * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < skills.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(x, y); ctx.stroke();
    const labelX = centerX + Math.cos(angle) * (radius + 28);
    const labelY = centerY + Math.sin(angle) * (radius + 28);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() || '#00ffff';
    ctx.font = '12px JetBrains Mono'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(skills[i].name, labelX, labelY);
  }
  ctx.beginPath();
  for (let i = 0; i < skills.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * skills[i].value;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.fill();
  ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(0, 255, 255, 0.5)'; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
  for (let i = 0; i < skills.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * skills[i].value;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff'; ctx.shadowColor = 'rgba(255, 0, 255, 0.6)'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2; ctx.stroke();
  }
})();

// Stat counters
const statNums = document.querySelectorAll('.stat-num');
function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const isDecimal = String(target).includes('.');
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const value = target * easeOut;
    el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => { if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); } });
}, { threshold: 0.5 });
statNums.forEach(stat => statObserver.observe(stat));

// Project filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    projectCards.forEach(card => {
      if (card.classList.contains('placeholder-card')) return;
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.6s var(--easing-out) forwards';
      } else { card.classList.add('hidden'); }
    });
  });
});

// Flip cards
(function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(flipped));
    });
  });
})();

// Project modal
(function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const backdrop = document.getElementById('projectModalBackdrop');
  const closeBtn = document.getElementById('projectModalClose');
  const titleEl = document.getElementById('projectModalTitle');
  const descEl = document.getElementById('projectModalDesc');
  const iconEl = document.getElementById('projectModalIcon');
  const tagsEl = document.getElementById('projectModalTags');
  const linksEl = document.getElementById('projectModalLinks');

  function openProjectModal(card) {
    const title = card.querySelector('h3')?.textContent.trim() || 'Project';
    const shortDesc = card.querySelector('.project-content p')?.textContent.trim() || '';
    const details = card.getAttribute('data-details') || shortDesc;
    const iconClass = card.querySelector('.project-icon i')?.className || 'fa-solid fa-diagram-project';
    const tags = Array.from(card.querySelectorAll('.tag-row .tag')).map(t => t.textContent.trim());
    const links = Array.from(card.querySelectorAll('.project-link')).map(a => ({
      href: a.getAttribute('href'), label: a.getAttribute('aria-label') || 'View',
      icon: a.querySelector('i')?.className || 'fa-solid fa-link',
    }));
    titleEl.textContent = title;
    descEl.textContent = details;
    iconEl.innerHTML = `<i class="${iconClass}"></i>`;
    tagsEl.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
    linksEl.innerHTML = links.map(l => `<a href="${l.href}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost magnetic"><i class="${l.icon}"></i> ${l.label}</a>`).join('');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeProjectModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  document.querySelectorAll('.project-card:not(.placeholder-card)').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card));
    card.querySelectorAll('.project-link').forEach(link => { link.addEventListener('click', (e) => e.stopPropagation()); });
    const viewMoreBtn = card.querySelector('.project-view-more');
    if (viewMoreBtn) { viewMoreBtn.addEventListener('click', (e) => { e.stopPropagation(); openProjectModal(card); }); }
  });
  [backdrop, closeBtn].forEach(el => el.addEventListener('click', closeProjectModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeProjectModal(); });
})();

// Certificate slider
const certSlider = document.getElementById('certSlider');
const certPrev = document.getElementById('certPrev');
const certNext = document.getElementById('certNext');
const certDots = document.getElementById('certDots');
if (certSlider && certPrev && certNext) {
  const certCards = certSlider.querySelectorAll('.cert-card');
  let currentCert = 0;
  certCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
    dot.addEventListener('click', () => goToCert(i));
    certDots.appendChild(dot);
  });
  function goToCert(index) {
    currentCert = index;
    const card = certCards[index];
    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    updateDots();
  }
  function updateDots() {
    const dots = certDots.querySelectorAll('.cert-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentCert));
  }
  certPrev.addEventListener('click', () => { currentCert = Math.max(0, currentCert - 1); goToCert(currentCert); });
  certNext.addEventListener('click', () => { currentCert = Math.min(certCards.length - 1, currentCert + 1); goToCert(currentCert); });
  certSlider.addEventListener('scroll', () => {
    const scrollLeft = certSlider.scrollLeft;
    const cardWidth = certCards[0].offsetWidth + 24;
    currentCert = Math.round(scrollLeft / cardWidth);
    updateDots();
  }, { passive: true });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentLightboxIndex = 0;
const certData = [];
document.querySelectorAll('.cert-card').forEach((card, index) => {
  certData.push({ src: card.getAttribute('data-full'), caption: card.getAttribute('data-caption') || '' });
  card.addEventListener('click', () => { currentLightboxIndex = index; openLightbox(); });
});
function openLightbox() {
  const data = certData[currentLightboxIndex];
  lightboxImg.src = data.src; lightboxImg.alt = data.caption; lightboxCaption.textContent = data.caption;
  lightbox.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.src = ''; document.body.style.overflow = ''; }
function nextLightbox() { currentLightboxIndex = (currentLightboxIndex + 1) % certData.length; openLightbox(); }
function prevLightbox() { currentLightboxIndex = (currentLightboxIndex - 1 + certData.length) % certData.length; openLightbox(); }
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});


// Hero photo lightbox
(function initHeroPhotoLightbox() {
  const heroPhotoBtn = document.getElementById('heroPhotoBtn');
  if (!heroPhotoBtn) return;
  heroPhotoBtn.addEventListener('click', () => {
    const src = heroPhotoBtn.getAttribute('data-full');
    const caption = heroPhotoBtn.getAttribute('data-caption') || '';
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Hide nav arrows for single image
    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
  });
  // Restore nav arrows when lightbox closes
  const originalCloseLightbox = closeLightbox;
  closeLightbox = function() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    lightboxPrev.style.display = '';
    lightboxNext.style.display = '';
  };
})();

// CV modal
const cvModal = document.getElementById('cvModal');
const cvModalBackdrop = document.getElementById('cvModalBackdrop');
const cvModalClose = document.getElementById('cvModalClose');
const cvModalDismiss = document.getElementById('cvModalDismiss');
function openCvModal() { cvModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCvModal() { cvModal.classList.remove('open'); document.body.style.overflow = ''; }
[cvModalBackdrop, cvModalClose, cvModalDismiss].forEach(el => { el.addEventListener('click', closeCvModal); });
['cvDownload', 'cvDownloadHero', 'cvDownloadAbout'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(btn.href, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            Toast.show('CV download started!', 'success', 'Download');
            const link = document.createElement('a');
            link.href = btn.href; link.download = '';
            document.body.appendChild(link); link.click(); link.remove();
          } else { openCvModal(); }
        })
        .catch(() => openCvModal());
    });
  }
});

// Contact form
const contactForm = document.getElementById('contactForm');
function setError(fieldName, message) {
  const errorEl = contactForm.querySelector(`.error-msg[data-for="${fieldName}"]`);
  const inputEl = contactForm.querySelector(`[name="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.toggle('invalid', Boolean(message));
}
function validateForm(data) {
  let valid = true;
  if (!data.name.trim()) { setError('name', 'Please enter your name.'); valid = false; }
  else { setError('name', ''); }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email.trim())) { setError('email', 'Please enter a valid email address.'); valid = false; }
  else { setError('email', ''); }
  if (!data.message.trim() || data.message.trim().length < 10) { setError('message', 'Message should be at least 10 characters.'); valid = false; }
  else { setError('message', ''); }
  return valid;
}
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.submit-btn');
  const data = { name: contactForm.name.value, email: contactForm.email.value, subject: contactForm.subject?.value || '', message: contactForm.message.value };
  if (!validateForm(data)) { Toast.show('Please fix the errors in the form.', 'error', 'Validation'); return; }
  submitBtn.classList.add('loading');
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    Toast.show(`Thanks, ${data.name.split(' ')[0]}! Your message has been sent.`, 'success', 'Message Sent');
    contactForm.reset();
  }, 1800);
});
contactForm.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    const errorEl = contactForm.querySelector(`.error-msg[data-for="${input.name}"]`);
    if (errorEl) errorEl.textContent = '';
  });
});

// Copy email
(function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.getAttribute('data-copy');
    try { await navigator.clipboard.writeText(email); }
    catch (err) {
      const temp = document.createElement('textarea');
      temp.value = email; temp.style.position = 'fixed'; temp.style.opacity = '0';
      document.body.appendChild(temp); temp.select(); document.execCommand('copy'); temp.remove();
    }
    btn.classList.add('copied'); btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    Toast.show('Email address copied to clipboard.', 'success', 'Copied');
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
  });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }
});

// Console easter egg
console.log('%c Gulshan Kumar Portfolio ', 'background: linear-gradient(90deg, #00ffff, #ff00ff); color: #0a0a0f; font-size: 22px; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-shadow: none;');
console.log('%c Built with curiosity, code, and a lot of coffee. ', 'color: #00ffff; font-size: 14px; font-family: monospace;');
console.log('%c Want to see how it works? Check the source! ', 'color: #ff00ff; font-size: 12px; font-family: monospace;');
