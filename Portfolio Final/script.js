/* =========================================================
   PORTFOLIO — interactions
   Sections: nav, hero role-typewriter, about code-snippet
   typing (on scroll), scroll reveal, mouse glow, project
   card tilt, back-to-top, contact form, footer year.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: blur on scroll + active tab tracking ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navTabs = document.getElementById('navTabs');
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('section[id], header[id]');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    backToTop.classList.toggle('show', window.scrollY > 500);

    let current = sections[0]?.id;
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35) current = sec.id;
    });
    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navTabs.classList.toggle('mobile-open');
  });
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navTabs.classList.remove('mobile-open');
    });
  });

  /* ---------- Hero: role line typewriter loop ---------- */
  const roles = [
    'Full-Stack Web Developer',
    'Frontend Developer',
    '"Building Clean & User-Friendly Websites"',
    '"Turning Ideas into Websites"',
  ];
  const roleEl = document.getElementById('roleText');

  function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }

  async function typewriterLoop() {
    if (!roleEl) return;
    let i = 0;
    while (true) {
      const word = roles[i % roles.length];
      for (let c = 1; c <= word.length; c++) {
        roleEl.textContent = word.slice(0, c);
        // eslint-disable-next-line no-await-in-loop
        await wait(38);
      }
      await wait(1400);
      for (let c = word.length; c >= 0; c--) {
        roleEl.textContent = word.slice(0, c);
        // eslint-disable-next-line no-await-in-loop
        await wait(22);
      }
      await wait(300);
      i++;
    }
  }

  if (roleEl) {
    if (prefersReduced) {
      roleEl.textContent = roles[0];
    } else {
      typewriterLoop();
    }
  }

  /* ---------- About: "const developer = {...}" code snippet,
     types itself out once it scrolls into view ---------- */
  const codeLines = [
    "const developer = {",
    "  name: 'Vedanti Thosar',",
    "  role: 'frontend-Developer',",
    "  stack: ['HTML', 'CSS', 'JavaScript'],",
    "  available: true,",
    "};",
  ];

  const typedCodeEl = document.getElementById('typedCode');
  const gutterEl = document.getElementById('gutter');
  let codeTyped = false;

  if (gutterEl) {
    codeLines.forEach((_, i) => {
      const num = document.createElement('span');
      num.textContent = i + 1;
      num.style.opacity = '0';
      num.style.transition = 'opacity .3s';
      num.style.height = '1.85em';
      gutterEl.appendChild(num);
    });
  }

  function highlightLine(line) {
    let html = line.replace(/'([^']*)'/g, '<span class="str">\'$1\'</span>');
    html = html.replace(/\b(const|true|false)\b/g, '<span class="kw">$1</span>');
    html = html.replace(/\bdeveloper\b/g, '<span class="fn">developer</span>');
    return html;
  }

  function typeLine(text, el) {
    return new Promise((resolve) => {
      let i = 0;
      const speed = 22;
      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  async function runCodeTyping() {
    if (!typedCodeEl || codeTyped) return;
    codeTyped = true;
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';

    for (let i = 0; i < codeLines.length; i++) {
      const lineEl = document.createElement('div');
      typedCodeEl.appendChild(lineEl);
      typedCodeEl.appendChild(cursor);
      // eslint-disable-next-line no-await-in-loop
      await typeLine(codeLines[i], lineEl);
      lineEl.innerHTML = highlightLine(codeLines[i]);
      if (gutterEl && gutterEl.children[i]) gutterEl.children[i].style.opacity = '1';
    }
    typedCodeEl.appendChild(cursor);
  }

  if (typedCodeEl) {
    if (prefersReduced) {
      typedCodeEl.innerHTML = codeLines.map(highlightLine).join('\n');
      if (gutterEl) [...gutterEl.children].forEach((el) => { el.style.opacity = '1'; });
    } else {
      const editorWindow = typedCodeEl.closest('.editor-window');
      const codeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCodeTyping();
              codeObserver.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      if (editorWindow) codeObserver.observe(editorWindow);
    }
  }

  /* ---------- Hero glow follows the mouse (desktop only) ---------- */
  const heroGlow = document.getElementById('heroGlow');
  const hero = document.querySelector('.hero');
  if (heroGlow && hero && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroGlow.style.setProperty('--mx', x + '%');
      heroGlow.style.setProperty('--my', y + '%');
    });
  }

  /* ---------- Scroll-reveal for sections (with stagger) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.08 + 's'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Project card subtle 3D tilt (desktop, motion-safe only) ---------- */
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.style.transition = 'transform .25s ease, border-color .35s, box-shadow .35s';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------- Back to top ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form ----------
     Front-end only placeholder: validates and shows a success state but
     does NOT send a real email yet.

     To make it actually send messages, pick one:
       1. Formspree → set <form action="https://formspree.io/f/yourFormId">
                       and remove the e.preventDefault() below.
       2. EmailJS   → call emailjs.send(...) inside this handler.
       3. Netlify   → add data-netlify="true" on the <form> tag in index.html
                       and host the site on Netlify.
  ---------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) return;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent ✓';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2200);
      }, 900);
    });
  }

  onScroll();
});
