// ============================================
//   RAMSUDARSHAN MAURYA — Portfolio JS
//   script.js
// ============================================

// ============================================
// 1. NAVBAR — Scroll & Hamburger
// ============================================
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.remove('nav-active');
    if (a.getAttribute('href') === `#${current}`) {
    a.classList.add('nav-active');
  } 
  });
});

// ============================================
// 2. TYPEWRITER EFFECT
// ============================================
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Embedded Systems Engineer',
  'IoT Developer',
  'PCB Designer',
  'Robotics Enthusiast',
  'Bare Metal C Programmer',
  'STM32 & ESP32 Expert',
  'Open to Work 🚀'
];

let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let typeSpeed  = 90;

function typeWriter() {
  const current = phrases[phraseIdx];

  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    typeSpeed = 50;
  } else {
    typewriterEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    typeSpeed = 90;
  }

  if (!isDeleting && charIdx === current.length) {
    isDeleting = true;
    typeSpeed = 1500; // pause before deleting
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typeSpeed = 400;
  }

  setTimeout(typeWriter, typeSpeed);
}

typeWriter();

// ============================================
// 3. COUNTER ANIMATION (About Stats)
// ============================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// ============================================
// 4. SKILL BAR ANIMATION
// ============================================
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width + '%';
  });
}

// ============================================
// 5. INTERSECTION OBSERVER — Scroll Animations
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Counters
      if (entry.target.classList.contains('about-stats')) {
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      }

      // Skill bars
      if (entry.target.classList.contains('skills-grid')) {
        animateSkillBars();
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in to all animatable elements
const animateTargets = [
  '.about-card',
  '.about-stats',
  '.skill-category',
  '.project-card',
  '.shop-card',
  '.course-card',
  '.timeline-item',
  '.contact-info',
  '.contact-form',
  '.skills-grid'
];

animateTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
});

// ============================================
// 6. CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Animate button
    btn.textContent = 'Sending... ⏳';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent! ✅';
      btn.style.background = 'linear-gradient(135deg, #00e676, #00e5ff)';
      btn.style.opacity = '1';

      // Reset form
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ============================================
// 7. SMOOTH SCROLL for all anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// 8. HERO SECTION — Entrance Animation
// ============================================
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(40px)';
    heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }
});

// ============================================
// 9. PROJECT CARD — Tilt Effect on hover
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const midX  = rect.width  / 2;
    const midY  = rect.height / 2;
    const rotX  = ((y - midY) / midY) * 5;
    const rotY  = ((x - midX) / midX) * -5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ============================================
// 10. SCROLL TO TOP BUTTON
// ============================================
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff2d2d, #ff7a00, #ffd600, #00e676, #00e5ff, #2979ff, #d500f9);
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBtn.addEventListener('mouseenter', () => {
  scrollBtn.style.transform = 'scale(1.15) translateY(-3px)';
  scrollBtn.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
});
scrollBtn.addEventListener('mouseleave', () => {
  scrollBtn.style.transform = '';
  scrollBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
});

// ============================================
// 11. FOOTER YEAR AUTO-UPDATE
// ============================================
const footerYear = document.querySelector('.footer p');
if (footerYear) {
  footerYear.innerHTML = footerYear.innerHTML.replace('2025', new Date().getFullYear());
}

// ============================================
// Done! Console log
// ============================================
console.log('%c🚀 Ramsudarshan Maurya Portfolio Loaded!', 
  'color: #ff7a00; font-size: 16px; font-weight: bold;');
console.log('%c⚡ Embedded Systems & IoT Engineer', 
  'color: #2979ff; font-size: 13px;');
