(function () {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const STAR_COUNT = 180;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight,
    r:       Math.random() * 0.9 + 0.2,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  const MAX_SHOOTERS = 6;
  const shooters = [];

  function spawnShooter() {
    const fromTop  = Math.random() > 0.4;
    const x        = fromTop ? Math.random() * W : 0;
    const y        = fromTop ? 0 : Math.random() * H * 0.6;

    const angle    = (Math.random() * 18 + 30) * (Math.PI / 180); 
    const speed    = Math.random() * 520 + 280;  
    const length   = Math.random() * 120 + 60;   
    const opacity  = Math.random() * 0.55 + 0.3;
    const width    = Math.random() * 1.2 + 0.4;

    shooters.push({ x, y, angle, speed, length, opacity, width, life: 1.0 });
  }

  let spawnTimer = 0;
  const SPAWN_INTERVAL = 1.4; 

  let last = performance.now();

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
      ctx.fill();
    });

    spawnTimer += dt;
    if (spawnTimer >= SPAWN_INTERVAL && shooters.length < MAX_SHOOTERS) {
      spawnShooter();
      spawnTimer = 0;
    }

    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];

      const dx = Math.cos(s.angle) * s.speed * dt;
      const dy = Math.sin(s.angle) * s.speed * dt;
      s.x += dx;
      s.y += dy;

      s.life -= dt * 0.55;

      if (s.life <= 0 || s.x > W + 50 || s.y > H + 50) {
        shooters.splice(i, 1);
        continue;
      }

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.7, `rgba(210,230,255,${s.opacity * s.life * 0.4})`);
      grad.addColorStop(1,   `rgba(255,255,255,${s.opacity * s.life})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = s.width;
      ctx.lineCap     = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.opacity * s.life * 0.9})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  spawnShooter();
  setTimeout(spawnShooter, 600);

  requestAnimationFrame(draw);
})();

const name = "Carlos Aguilar";
const heroName = document.getElementById('hero-name');

[...name].forEach((char, i) => {
  if (char === ' ') {
    heroName.innerHTML += '<span class="space"> </span>';
  } else {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    span.style.animationDelay = `${0.4 + i * 0.055}s`;
    heroName.appendChild(span);
  }
});

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-card, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const indicator = document.getElementById('nav-indicator');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {

  nav.classList.toggle('scrolled', window.scrollY > 40);

  
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });

  navLinks.forEach(link => {
    const isActive = link.dataset.section === current;
    link.classList.toggle('active', isActive);
    if (isActive) {
      const rect = link.getBoundingClientRect();
      const parentRect = link.closest('ul').getBoundingClientRect();
      indicator.style.left  = (rect.left - parentRect.left) + 'px';
      indicator.style.width = rect.width + 'px';
    }
  }); 
});


const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));


const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
      timelineObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
timelineItems.forEach(el => timelineObs.observe(el));


document.getElementById('form-btn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const nameVal = document.getElementById('form-name').value.trim();
    const emailVal = document.getElementById('form-email').value.trim();
    const msgVal = document.getElementById('form-message').value.trim();
  
    if (!nameVal || !emailVal || !msgVal) return;
  
    const btn = document.getElementById('form-btn');
    const txt = document.getElementById('btn-text');
  
    btn.disabled = true;
    txt.textContent = 'Sending...';
  
    try {
      const response = await fetch(
        'https://formspree.io/f/mdavlapn',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            message: msgVal
          })
        }
      );
  
      if (response.ok) {
  
        txt.textContent = 'Sent ✓';
  
        document.getElementById('form-success').style.display = 'block';
  
        document.getElementById('form-name').value = '';
        document.getElementById('form-email').value = '';
        document.getElementById('form-message').value = '';
  
        setTimeout(() => {
          txt.textContent = 'Send Message';
          btn.disabled = false;
        }, 2500);
  
      } else {
        throw new Error('Submission failed');
      }
  
    } catch (error) {
  
      txt.textContent = 'Failed';
  
      setTimeout(() => {
        txt.textContent = 'Send Message';
        btn.disabled = false;
      }, 2500);
  
      console.error(error);
    }
  });

document.querySelectorAll('a[href^=""]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});