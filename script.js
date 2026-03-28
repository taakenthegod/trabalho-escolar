/* ============================================================
   MUNDOS ALÉM DO HORIZONTE — JavaScript
   ============================================================ */

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

// ---- NAVBAR scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- NAV TOGGLE (mobile) ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- INTERSECTION OBSERVER — Reveal on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Add reveal class to elements
function addReveal(selector, delay = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${delay + i * 0.05}s`;
    revealObserver.observe(el);
  });
}

addReveal('.info-card', 0);
addReveal('.timeline-item', 0.05);
addReveal('.curiosity-card', 0.03);
addReveal('.food-card', 0.04);
addReveal('.famous-card', 0.03);
addReveal('.culture-card', 0.04);
addReveal('.history-card', 0.05);
addReveal('.block-title', 0);
addReveal('.section-header', 0);

// ---- POPULATION BAR ANIMATION ----
const popBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.pop-bar-fill');
      fills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
          fill.style.width = targetWidth;
        }, 200);
      });
      popBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.pop-card').forEach(card => {
  // Reset initial width
  card.querySelectorAll('.pop-bar-fill').forEach(fill => {
    fill._targetWidth = fill.style.width;
    fill.style.width = '0';
  });
  popBarObserver.observe(card);
});

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- PARALLAX on hero orbs ----
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  const orb3 = document.querySelector('.orb3');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * 0.1}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrollY * -0.08}px)`;
});

// ---- HOVER effects on famous cards (rank glow) ----
document.querySelectorAll('.famous-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const rank = card.querySelector('.famous-rank');
    if (rank) rank.style.opacity = '0.6';
  });
  card.addEventListener('mouseleave', () => {
    const rank = card.querySelector('.famous-rank');
    if (rank) rank.style.opacity = '';
  });
});

// ---- STAGGERED reveal for timeline items ----
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        });
      });
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.timeline').forEach(tl => {
  tl.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
  });
  timelineObserver.observe(tl);
});

// ---- Number counter animation for pop numbers ----
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  const isDecimal = String(target).includes('.');
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const value = parseFloat(el.textContent.replace(',', '.'));
      if (!isNaN(value)) {
        animateCounter(el, value);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.pop-big').forEach(el => counterObserver.observe(el));

// ---- Active nav link based on scroll position ----
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--text)';
    }
  });
});

// ---- Ripple effect on cards ----
document.querySelectorAll('.curiosity-card, .food-card, .culture-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      transform: scale(0);
      animation: rippleAnim 0.5s linear;
      left: ${e.clientX - rect.left - 25}px;
      top: ${e.clientY - rect.top - 25}px;
      width: 50px; height: 50px;
      pointer-events: none;
      z-index: 10;
    `;
    this.style.position = 'relative';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Add ripple CSS keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(8); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ---- Typewriter effect for section subtitles (optional) ----
function typewriter(el, text, speed = 30) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// ---- Flag hover tooltip ----
document.querySelectorAll('.flag-card').forEach(card => {
  card.addEventListener('click', () => {
    const flag = card.querySelector('.flag-emoji').textContent;
    const name = card.querySelector('span:last-child').textContent;
    // Scroll to section
    const sectionMap = {
      '🇿🇦': '#africa',
      '🇦🇺': '#australia',
      '🇳🇿': '#nz'
    };
    const target = document.querySelector(sectionMap[flag]);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

console.log('🌍 Mundos Além do Horizonte — carregado com sucesso!');
