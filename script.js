/* ============================================
   RAMSUDARSHAN MAURYA — script.js
   JSON se poori website update hogi!
   ============================================ */

/* ============================================
   LOADING STATE MANAGEMENT
   ============================================ */
const loader = document.getElementById('loader');

function hideLoader() {
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500); // Smooth transition
  }
}

function showError(message) {
  if (loader) {
    loader.innerHTML = `
      <div style="text-align: center; color: #e80000; font-family: 'Orbitron', monospace;">
        <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
        <h2 style="margin-bottom: 10px;">Failed to Load Content</h2>
        <p style="color: #666;">${message}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 30px; background: #e80000; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 700;">Retry</button>
      </div>
    `;
  }
}

/* ============================================
   STEP 1 — data.json load karo
   Sab kuch yahan se shuru hota hai
   ============================================ */
fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {

    /* JSON load ho gaya — sab sections build karo */
    buildAbout(data.about);
    buildSkills(data.skills);
    buildProjects(data.projects);
    buildCourses(data.courses);
    buildEducation(data.education);
    buildContact(data.contact);
    buildShopFilters();

    /* Animations init karo AFTER content build */
    initAnimations();
    initSkillBars();
    initCounters();

    /* Hide loader after everything is loaded */
    hideLoader();

  })
  .catch(error => {
    console.error('data.json load nahi hua:', error);
    showError('Please check your internet connection or contact support.');
  });


/* ============================================
   ABOUT SECTION BUILD
   ============================================ */
function buildAbout(about) {

  /* --- Cards --- */
  const grid = document.querySelector('.about-grid');
  if (grid) {
    grid.innerHTML = '';
    about.cards.forEach(card => {
      grid.innerHTML += `
        <div class="about-card fade-in">
          <div class="about-icon">${card.icon}</div>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
        </div>
      `;
    });
  }

  /* --- Stats --- */
  const statsDiv = document.querySelector('.about-stats');
  if (statsDiv) {
    statsDiv.innerHTML = '';
    about.stats.forEach(stat => {
      statsDiv.innerHTML += `
        <div class="stat">
          <span class="stat-num" data-target="${stat.number}">0</span>
          <span class="stat-label">${stat.label}</span>
        </div>
      `;
    });
  }
}


/* ============================================
   SKILLS SECTION BUILD
   ============================================ */
function buildSkills(skills) {

  const grid = document.querySelector('.skills-grid');
  if (!grid) return;

  grid.innerHTML = '';

  skills.forEach(category => {

    /* Har skill item banao */
    let itemsHTML = '';
    category.items.forEach(item => {
      itemsHTML += `
        <div class="skill-item">
          <span>${item.name}</span>
          <div class="skill-bar">
            <div class="skill-fill" data-width="${item.level}"></div>
          </div>
        </div>
      `;
    });

    /* Category card banao */
    grid.innerHTML += `
      <div class="skill-category fade-in">
        <h3>${category.category}</h3>
        ${itemsHTML}
      </div>
    `;
  });
}


/* ============================================
   PROJECTS SECTION BUILD — Filter ke saath
   ============================================ */
function buildProjects(projects) {

  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  // Yeh function filter ke hisaab se cards render karega
  function renderCards(filter) {
    grid.innerHTML = '';

    // 'all' ho toh sab dikhao, warna sirf matching tag wale
    const list = filter === 'all'
      ? projects
      : projects.filter(p => p.tag === filter);

    list.forEach(project => {
      let techHTML = '';
      project.tech.forEach(t => { techHTML += `<span>${t}</span>`; });

      grid.innerHTML += `
        <div class="project-card fade-in">
          <div class="project-icon">${project.icon}</div>
          <div class="project-tag">${project.tag}</div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">${techHTML}</div>
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">${project.linkText}</a>
        </div>
      `;
    });

    // Naye cards pe fade-in animation lagao
    initAnimations();
  }

  // Pehle sab projects dikhao
  renderCards('all');

  // Filter button click hone par cards update karo
  const projectButtons = document.querySelectorAll('.projects .filter-btn');
  projectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Pehle active class sab se hatao
      projectButtons.forEach(b => b.classList.remove('active'));
      // Clicked button ko active karo
      btn.classList.add('active');
      // Us filter ke hisaab se cards dikhao
      renderCards(btn.getAttribute('data-filter'));
    });
  });
}


/* ============================================
   COURSES SECTION BUILD
   ============================================ */
function buildCourses(courses) {

  const grid = document.querySelector('.courses-grid');
  if (!grid) return;

  function renderCards(filter) {
    grid.innerHTML = '';

    const list = filter === 'all'
      ? courses
      : courses.filter(course => course.label === filter);

    list.forEach(course => {

    /* Status check */
    const statusText = course.status === 'Coming Soon'
      ? '🎥 Coming Soon'
      : `🎥 ${course.status}`;

    /* Button text */
    const btnText = course.status === 'Coming Soon'
      ? 'Subscribe →'
      : 'Watch Now →';

    /* Thumbnail — agar videoId hai to YouTube thumbnail */
    const thumbStyle = course.videoId
      ? `style="background-image: url('https://img.youtube.com/vi/${course.videoId}/maxresdefault.jpg'); background-size: cover; background-position: center;"`
      : '';

      grid.innerHTML += `
      <div class="course-card fade-in">
        <div class="course-thumb" ${thumbStyle}>
          <div class="play-btn">▶</div>
          <div class="course-label">${course.label}</div>
        </div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span>${statusText}</span>
          <span>🆓 ${course.price}</span>
        </div>
        <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="btn btn-course">${btnText}</a>
      </div>
    `;
    });

    initAnimations();
  }

  renderCards('all');

  const courseButtons = document.querySelectorAll('.courses .filter-btn');
  courseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      courseButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.getAttribute('data-filter'));
    });
  });
}


/* ============================================
   EDUCATION SECTION BUILD
   ============================================ */
function buildEducation(education) {

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  function getEducationType(item) {
    const title = item.title.toLowerCase();
    const org = item.organization.toLowerCase();
    const tags = item.tags.join(' ').toLowerCase();

    if (title.includes('b.tech') || title.includes('degree')) return 'Degree';
    if (title.includes('intern') || org.includes('technologies')) return 'Internship';
    if (title.includes('training') || org.includes('academy')) return 'Training';
    if (title.includes('research') || tags.includes('research') || tags.includes('ijrpr')) return 'Research';
    if (title.includes('prize') || tags.includes('prize') || tags.includes('winner') || tags.includes('robotics')) return 'Achievement';
    return 'Other';
  }

  function renderCards(filter) {
    timeline.innerHTML = '';

    const list = filter === 'all'
      ? education
      : education.filter(item => getEducationType(item) === filter);

    list.forEach(item => {

    /* Tags banao */
    let tagsHTML = '';
    item.tags.forEach(tag => {
      tagsHTML += `<span>${tag}</span>`;
    });

      timeline.innerHTML += `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-year">${item.year}</div>
          <h3>${item.title}</h3>
          <h4>${item.organization}</h4>
          <p>${item.description}</p>
          <div class="timeline-tags">${tagsHTML}</div>
        </div>
      </div>
    `;
    });

    initAnimations();
  }

  renderCards('all');

  const educationButtons = document.querySelectorAll('.education .filter-btn');
  educationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      educationButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.getAttribute('data-filter'));
    });
  });
}


/* ============================================
   SHOP SECTION FILTER
   ============================================ */
function buildShopFilters() {
  const buttons = document.querySelectorAll('.shop .filter-btn');
  const cards = document.querySelectorAll('.shop .shop-card');

  if (!buttons.length || !cards.length) return;

  function renderCards(filter) {
    cards.forEach(card => {
      const type = card.getAttribute('data-type');
      card.style.display = filter === 'all' || type === filter ? '' : 'none';
    });
  }

  renderCards('all');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.getAttribute('data-filter'));
    });
  });
}


/* ============================================
   CONTACT SECTION BUILD
   ============================================ */
function buildContact(contact) {

  const emailEl = document.getElementById('contact-email');
  if (emailEl) {
    emailEl.href        = `mailto:${contact.email}`;
    emailEl.textContent = contact.email;
  }

  const linkedinEl = document.getElementById('contact-linkedin');
  if (linkedinEl) {
    linkedinEl.href        = contact.linkedin;
    linkedinEl.textContent = contact.linkedin.replace('https://', '');
  }

  const githubEl = document.getElementById('contact-github');
  if (githubEl) {
    githubEl.href        = contact.github;
    githubEl.textContent = contact.github.replace('https://', '');
  }

  const locationEl = document.getElementById('contact-location');
  if (locationEl) locationEl.textContent = contact.location;

  const btnLinkedin = document.getElementById('btn-linkedin');
  const btnGithub   = document.getElementById('btn-github-c');
  const btnResume   = document.getElementById('btn-resume');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  if (btnLinkedin) btnLinkedin.href = contact.linkedin;
  if (btnGithub)   btnGithub.href   = contact.github;
  if (btnResume)   btnResume.href   = contact.resume;
  if (btnWhatsapp) btnWhatsapp.href = contact.whatsapp;
}


/* ============================================
   NAVBAR — Scroll shadow + Active link
   ============================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(232,0,0,0.15)'
      : '0 2px 20px rgba(232,0,0,0.12)';
  }
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  let current    = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('nav-active');
    }
  });
}


/* ============================================
   HAMBURGER — Mobile menu
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}


/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
const phrases = [
  'Embedded Systems Engineer',
  'IoT Developer',
  'PCB Designer',
  'Robotics Enthusiast',
  'Bare Metal C Programmer',
  'STM32 & ESP32 Expert',
  'Open to Work 🚀'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typeEl    = document.getElementById('typewriter');

function typeWriter() {
  if (!typeEl) return;

  const current = phrases[phraseIndex];

  typeEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typeWriter, 1500);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting   = false;
    phraseIndex  = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeWriter, isDeleting ? 40 : 80);
}

typeWriter();


/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target   = parseInt(counter.getAttribute('data-target'));
    const step     = target / (1500 / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target + '+';
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
}


/* ============================================
   SKILL BARS ANIMATION
   ============================================ */
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-fill').forEach(fill => observer.observe(fill));
}


/* ============================================
   FADE-IN ANIMATIONS
   ============================================ */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}


/* ============================================
   PROJECT CARD 3D TILT
   ============================================ */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.project-card').forEach(card => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left  - rect.width  / 2;
    const y     = e.clientY - rect.top   - rect.height / 2;

    const inside =
      e.clientX >= rect.left   &&
      e.clientX <= rect.right  &&
      e.clientY >= rect.top    &&
      e.clientY <= rect.bottom;

    card.style.transform = inside
      ? `perspective(1000px) rotateX(${(y / rect.height) * 8}deg) rotateY(${(x / rect.width) * -8}deg) translateY(-8px)`
      : '';
  });
});


/* ============================================
   CONTACT FORM
   ============================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn     = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending... ⏳';
    btn.disabled    = true;

    setTimeout(() => {
      btn.textContent      = 'Message Sent! ✅';
      btn.style.background = '#00c853';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent      = 'Send Message 🚀';
        btn.style.background = '';
        btn.disabled         = false;
      }, 3000);
    }, 1500);
  });
}


/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});


/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML     = '↑';
scrollBtn.id            = 'scrollTop';
scrollBtn.style.cssText = `
  position: fixed; bottom: 30px; right: 30px;
  width: 48px; height: 48px; border-radius: 50%;
  border: none; background: linear-gradient(135deg, #e80000, #ff4444);
  color: white; font-size: 1.3rem; font-weight: 900;
  cursor: pointer; opacity: 0; transition: all 0.3s ease;
  z-index: 9998; box-shadow: 0 4px 20px rgba(232,0,0,0.35);
`;
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  scrollBtn.style.opacity = window.scrollY > 400 ? '1' : '0';
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================
   FOOTER YEAR — Auto update
   ============================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================
   PARTICLE BACKGROUND
   - Hero section mein 70 red dots float karte hain
   - Mouse ke paas aao toh dots door hote hain
   - Paas wale dots ke beech lines banti hain
   ============================================ */
(function () {

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Canvas ka size hero section ke barabar set karo
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize); // resize hone par update karo

  // Mouse ki position track karo
  let mx = null, my = null;

  // Hero section pe mousemove listen karo
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => {
      mx = null;
      my = null;
    });
  }

  // Ek particle object banao
  function makeParticle() {
    return {
      x  : Math.random() * canvas.width,   // random x position
      y  : Math.random() * canvas.height,  // random y position
      vx : (Math.random() - 0.5) * 0.5,   // horizontal speed
      vy : (Math.random() - 0.5) * 0.5,   // vertical speed
      r  : Math.random() * 2 + 1,          // dot ka size
      a  : Math.random() * 0.5 + 0.2      // dot ki opacity
    };
  }

  // 70 particles banao
  const pts = Array.from({ length: 70 }, makeParticle);

  // Animation loop
  function draw() {
    // Pehle canvas clear karo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pts.forEach(p => {

      // Position update karo
      p.x += p.vx;
      p.y += p.vy;

      // Border pe bounce karo
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse ke 80px ke andar aao toh door bhago
      if (mx !== null) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          p.x += (dx / d) * 2;
          p.y += (dy / d) * 2;
        }
      }

      // Red dot draw karo
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 0, 0, ${p.a})`;
      ctx.fill();
    });

    // 110px se paas wale particles ke beech line draw karo
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          // Door hone par line fade hogi
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(232, 0, 0, ${(1 - dist / 110) * 0.3})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // Agli frame ke liye dobara call karo
    requestAnimationFrame(draw);
  }

  draw(); // animation shuru karo

})();
