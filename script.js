/* =============================================
   SENYO TAB — JAVASCRIPT
   ============================================= */

// ======================== CUSTOM CURSOR ========================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let rafId;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  const ease = 0.15;
  ringX += (mouseX - ringX) * ease;
  ringY += (mouseY - ringY) * ease;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  rafId = requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousedown', () => {
  cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
  cursorRing.style.transform = 'translate(-50%, -50%) scale(0.85)';
});
document.addEventListener('mouseup', () => {
  cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '1';
});

// ======================== NAV SCROLL ========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ======================== FADE-UP ON SCROLL ========================
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// Immediately show hero elements (they're in viewport)
setTimeout(() => {
  const heroEls = document.querySelectorAll('.hero .fade-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 100 + 200);
  });
}, 50);

// ======================== 3D TABLET MOUSE TILT ========================
const tabletWrapper = document.getElementById('tabletWrapper');
const tabletScene = document.getElementById('tabletScene');
let tabletRafId;
let targetRX = 0, targetRY = 0;
let currentRX = 0, currentRY = 0;

function lerp(a, b, t) { return a + (b - a) * t; }

document.addEventListener('mousemove', (e) => {
  const rect = tabletScene.getBoundingClientRect();
  if (!rect.width) return;

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);

  targetRY = dx * 18;
  targetRX = -dy * 12;
});

function animateTablet() {
  currentRX = lerp(currentRX, targetRX, 0.06);
  currentRY = lerp(currentRY, targetRY, 0.06);

  if (tabletWrapper) {
    tabletWrapper.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY + -8}deg)`;
  }
  tabletRafId = requestAnimationFrame(animateTablet);
}
animateTablet();

// Reset on mouse leave
tabletScene.addEventListener('mouseleave', () => {
  targetRX = 0;
  targetRY = 0;
});

// ======================== WRITING ANIMATION ========================
const writingPath = document.getElementById('writingPath');
let writingAnimated = false;

const writingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !writingAnimated) {
      writingAnimated = true;
      setTimeout(() => {
        writingPath.classList.add('animate');
      }, 400);
      writingObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const writingSection = document.getElementById('writingSvg');
if (writingSection) writingObserver.observe(writingSection);

// ======================== MODAL SYSTEM ========================
function openModal(type) {
  const modal = document.getElementById(type === 'interest' ? 'interestModal' : 'feedbackModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset form state
  const form = modal.querySelector('.modal-form');
  const success = modal.querySelector('.modal-success');
  if (form) form.classList.remove('hide');
  if (success) success.classList.remove('show');
}

function closeModal(type) {
  const modal = document.getElementById(type === 'interest' ? 'interestModal' : 'feedbackModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ======================== FORM SUBMISSIONS ========================
function submitInterest() {
  const email = document.getElementById('iEmail');
  if (!email || !email.value.trim()) {
    shakeInput(email);
    return;
  }
  if (!validateEmail(email.value.trim())) {
    shakeInput(email);
    return;
  }

  // Build mailto
  const name = document.getElementById('iName').value.trim();
  const message = document.getElementById('iMessage').value.trim();
  const subject = encodeURIComponent('Senyo Tab — Early Interest');
  let body = `Hello Senyo Team,\n\nI'm interested in the Senyo Tab!\n\n`;
  if (name) body += `Name: ${name}\n`;
  body += `Email: ${email.value.trim()}\n`;
  if (message) body += `\nWhat would make Senyo Tab perfect for me:\n${message}\n`;
  const mailtoLink = `mailto:senyoindia@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;

  // Show success
  showSuccess('interestModal');
  // Trigger mailto
  setTimeout(() => { window.location.href = mailtoLink; }, 600);
}

function submitFeedback() {
  const msg = document.getElementById('fMessage');
  if (!msg || !msg.value.trim()) {
    shakeInput(msg);
    return;
  }

  const subject = encodeURIComponent('Senyo Tab — Feedback');
  const body = encodeURIComponent(`Feedback:\n\n${msg.value.trim()}`);
  const mailtoLink = `mailto:senyoindia@gmail.com?subject=${subject}&body=${body}`;

  showSuccess('feedbackModal');
  setTimeout(() => { window.location.href = mailtoLink; }, 600);
}

function showSuccess(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const form = modal.querySelector('.modal-form');
  const success = modal.querySelector('.modal-success');
  form.classList.add('hide');
  success.classList.add('show');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInput(el) {
  if (!el) return;
  el.style.borderColor = '#ef4444';
  el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 1800);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ======================== SMOOTH SCROLL FOR NAV LINKS ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ======================== PARTICLE GLOW TRAIL ========================
const particles = [];
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9990;opacity:0.6;';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let lastParticleTime = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastParticleTime > 35) {
    lastParticleTime = now;
    particles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.5,
      size: Math.random() * 2.5 + 0.5,
      opacity: 0.5,
      hue: Math.random() > 0.5 ? 210 : 270
    });
    if (particles.length > 40) particles.shift();
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.opacity -= 0.022; p.size *= 0.97;
    if (p.opacity <= 0) { particles.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity})`;
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ======================== MODE PILLS INTERACTION ========================
document.querySelectorAll('.mode-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.boxShadow = '0 0 16px rgba(96,165,250,0.2)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

// ======================== HERO TEXT STAGGER ON LOAD ========================
window.addEventListener('DOMContentLoaded', () => {
  // Minor stagger enhancement already handled above
  // Ensure scroll starts at top
  window.scrollTo(0, 0);
});

// ======================== RESIZE HANDLER ========================
window.addEventListener('resize', () => {
  // Cursor canvas handled above
}, { passive: true });
