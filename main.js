
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

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
