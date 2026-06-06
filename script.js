/* =============================================
   ✨ BIRTHDAY WEBSITE — JAVASCRIPT ✨
   Confetti · Balloons · Flip Card · Countdown
============================================= */

// ── CONFIG ──────────────────────────────────
const BIRTHDAY_MONTH = 6;                        // June (1-indexed)
const BIRTHDAY_DAY   = 7;                        // Day
const AMMA_AGE       = 42;                       // 🎂 Amma turns 42!
const AMMA_DOB       = new Date(1984, 5, 7, 0, 0, 0); // June 7 1984 (month is 0-indexed)

// ── CONFETTI ENGINE ─────────────────────────
(function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const COLORS = [
    '#FFB3C6', '#FF85A1', '#C9B8FF', '#A68EFF',
    '#A8E6CF', '#6ECFAA', '#FFCC99', '#FFE0EB',
    '#FF6B9D', '#B388FF', '#69F0AE', '#FFD54F'
  ];
  const SHAPES = ['circle', 'rect', 'heart', 'star'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticle(x, y, burst) {
    const angle  = burst
      ? (Math.random() * Math.PI * 2)
      : (Math.random() * Math.PI - Math.PI / 2);
    const speed  = burst
      ? (Math.random() * 8 + 3)
      : (Math.random() * 4 + 2);

    return {
      x, y,
      vx: Math.cos(angle) * speed * (burst ? 1 : 0.3),
      vy: Math.sin(angle) * speed * (burst ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size:  Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      alpha: 1,
      gravity: 0.18,
      drift:   (Math.random() - 0.5) * 0.8,
    };
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.closePath();
    ctx.fill();
  }

  function drawStar(ctx, x, y, size) {
    const spikes = 5, outerR = size, innerR = size * 0.4;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        x + Math.cos(rot) * outerR,
        y + Math.sin(rot) * outerR
      );
      rot += step;
      ctx.lineTo(
        x + Math.cos(rot) * innerR,
        y + Math.sin(rot) * innerR
      );
      rot += step;
    }
    ctx.lineTo(x, y - outerR);
    ctx.closePath();
    ctx.fill();
  }

  function update() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx + p.drift;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.008;

      if (p.alpha <= 0 || p.y > H + 30) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      switch (p.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rect':
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          break;
        case 'heart':
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
          break;
        case 'star':
          drawStar(ctx, 0, 0, p.size / 2);
          break;
      }

      ctx.restore();
    }

    requestAnimationFrame(update);
  }

  // Burst on page load
  function burstConfetti() {
    const cx = W / 2, cy = H / 3;
    const origins = [
      { x: cx,          y: cy          },
      { x: cx - W * 0.3, y: cy + 50    },
      { x: cx + W * 0.3, y: cy + 50    },
    ];
    origins.forEach(origin => {
      for (let i = 0; i < 70; i++) {
        particles.push(createParticle(origin.x, origin.y, true));
      }
    });
  }

  // Rain confetti for 5 seconds
  let rainTimer = 0;
  function rainConfetti() {
    if (rainTimer < 250) {
      if (Math.random() < 0.4) {
        particles.push(createParticle(
          Math.random() * W, -20, false
        ));
      }
      rainTimer++;
    }
  }

  // Start
  setTimeout(() => {
    burstConfetti();
    const rainInterval = setInterval(() => {
      rainConfetti();
      if (rainTimer >= 250) clearInterval(rainInterval);
    }, 20);
  }, 400);

  update();

  // Expose for manual trigger
  window.triggerConfetti = () => {
    rainTimer = 0;
    burstConfetti();
    const ri = setInterval(() => {
      rainConfetti();
      if (rainTimer >= 250) clearInterval(ri);
    }, 20);
  };
})();

// ── DYNAMIC SHUFFLED GALLERY ────────────────
const GALLERY_IMAGES = [
  { src: 'images/IMG-20251028-WA0110.jpg', caption: 'எங்கள் சிரிப்பு ✨', emoji: '💕' },
  { src: 'images/IMG-20251028-WA0114.jpg', caption: 'அம்மா, glowing 🌸', emoji: '🌸' },
  { src: 'images/IMG-20251028-WA0116.jpg', caption: 'Pure joy 💜', emoji: '💜' },
  { src: 'images/IMG-20251028-WA0118(1).jpg', caption: 'அழகான தருணம் 🌟', emoji: '🌟' },
  { src: 'images/IMG-20251028-WA0118(2).jpg', caption: 'Un Paiyan உன்னோட 🤍', emoji: '🤍' },
  { src: 'images/IMG-20251028-WA0131.jpg', caption: 'அன்பின் முகவரி 💖', emoji: '💖' },
  { src: 'images/IMG-20251102-WA0045.jpg', caption: 'அம்மாவின் அழகு 🌷', emoji: '🌷' },
  { src: 'images/IMG-20251102-WA0084.jpg', caption: 'குடும்பம் என் உலகம் 🎀', emoji: '🎀' },
  { src: 'images/IMG-20251102-WA0086.jpg', caption: 'என் ஹீரோ 💗', emoji: '💗' },
  { src: 'images/IMG-20251102-WA0088.jpg', caption: 'அன்பின் கணம் 🤍', emoji: '🤍' },
  { src: 'images/IMG-20251102-WA0098.jpg', caption: 'சிரிப்பு நிறைந்த நாள் ✨', emoji: '✨' },
  { src: 'images/IMG-20251102-WA0100.jpg', caption: 'அம்மா அழகு 💖', emoji: '💖' },
  { src: 'images/IMG-20251102-WA0105.jpg', caption: 'எப்போதும் இப்படி இரு 🌷', emoji: '🌷' },
  { src: 'images/IMG-20251102-WA0109.jpg', caption: 'கொண்டாட்டம் 🎊', emoji: '🎊' },
  { src: 'images/IMG-20251102-WA0113.jpg', caption: 'நம் குடும்பம் 💕', emoji: '💕' },
  { src: 'images/IMG-20251102-WA0116.jpg', caption: 'அன்பான நாட்கள் 🌸', emoji: '🌸' },
  { src: 'images/IMG-20251102-WA0119.jpg', caption: 'என் star அம்மா ⭐', emoji: '⭐' },
  { src: 'images/IMG-20251102-WA0123.jpg', caption: 'Love forever ❤️', emoji: '❤️' }
];

function initGallery() {
  const grid = document.getElementById('polaroid-grid');
  if (!grid) return;

  // Fisher-Yates Shuffle
  const images = [...GALLERY_IMAGES];
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  images.forEach((img, idx) => {
    const rot = (Math.random() * 6 - 3).toFixed(1);
    const delay = (idx * 0.08).toFixed(2);

    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.setProperty('--rot', `${rot}deg`);
    polaroid.style.setProperty('--delay', `${delay}s`);
    polaroid.id = `polaroid-${idx + 1}`;

    polaroid.innerHTML = `
      <div class="polaroid-img-wrap">
        <img src="${img.src}" alt="Family Memory" loading="lazy" />
        <div class="polaroid-overlay">${img.emoji}</div>
      </div>
      <p class="polaroid-caption">${img.caption}</p>
    `;

    // Add mouse move tilt effect
    polaroid.addEventListener('mousemove', (e) => {
      const rect = polaroid.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      polaroid.style.transform = `
        rotate(0deg)
        translateY(-12px)
        scale(1.05)
        rotateX(${-dy * 8}deg)
        rotateY(${dx * 8}deg)
      `;
    });

    polaroid.addEventListener('mouseleave', () => {
      polaroid.style.transform = `rotate(var(--rot, 0deg)) translateY(0)`;
    });

    grid.appendChild(polaroid);
  });
}

// Generate the gallery on load
initGallery();

// ── SCROLL REVEAL ───────────────────────────
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.letter-card, .polaroid, .parents-card, .reveal-on-scroll'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();

// ── AGE STATS — FULLY DYNAMIC ───────────────
function computeAgeStats() {
  const now  = new Date();
  const dob  = AMMA_DOB;

  // Total elapsed milliseconds
  const elapsedMs = now - dob;

  // ── Years & months using calendar arithmetic ──
  let years  = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth()    - dob.getMonth();
  if (months < 0) { years--; months += 12; }
  if (now.getDate() < dob.getDate()) { months--; if (months < 0) { years--; months += 11; } }

  // ── Days, weeks, hours, seconds from ms ──
  const totalSecs  = Math.floor(elapsedMs / 1000);
  const totalMins  = Math.floor(totalSecs  / 60);
  const totalHours = Math.floor(totalMins  / 60);
  const totalDays  = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays  / 7);

  function fmt(n) {
    return n.toLocaleString('en-IN'); // Indian number format: 1,50,000
  }

  const el = (id) => document.getElementById(id);
  if (el('stat-years'))   el('stat-years').textContent   = fmt(years);
  if (el('stat-months'))  el('stat-months').textContent  = fmt(years * 12 + months);
  if (el('stat-weeks'))   el('stat-weeks').textContent   = fmt(totalWeeks);
  if (el('stat-days'))    el('stat-days').textContent    = fmt(totalDays);
  if (el('stat-hours'))   el('stat-hours').textContent   = fmt(totalHours);
  if (el('stat-seconds')) el('stat-seconds').textContent = fmt(totalSecs);
}

let statsLiveTimer = null;
let revealed = false;

function revealAge() {
  if (revealed) return;
  revealed = true;

  const card    = document.getElementById('flip-card');
  const ageEl   = document.getElementById('age-number');
  const statsEl = document.getElementById('age-stats');

  // Set age
  ageEl.textContent = AMMA_AGE;

  // Flip!
  card.classList.add('flipped');

  // Confetti burst!
  setTimeout(() => {
    window.triggerConfetti();
  }, 500);

  // Compute stats immediately, then animate cards in
  computeAgeStats();
  if (statsEl) {
    setTimeout(() => {
      statsEl.classList.add('show');
    }, 1100);
  }

  // Tick seconds live every second
  statsLiveTimer = setInterval(computeAgeStats, 1000);
}

// Keyboard support for flip card
document.getElementById('flip-card').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    revealAge();
  }
});

// ── COUNTDOWN TIMER ─────────────────────────
(function initCountdown() {
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const msgEl     = document.getElementById('birthday-message');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick(el, val) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    el.textContent = val;
    setTimeout(() => el.classList.remove('tick'), 200);
  }

  function updateCountdown() {
    const now = new Date();

    // Target: midnight at the START of birthday (June 7)
    const thisYear     = now.getFullYear();
    const bdayMidnight = new Date(thisYear, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);

    // If we're already past this year's birthday midnight, target next year
    if (now >= bdayMidnight) {
      const isTodayBirthday = (
        now.getMonth() + 1 === BIRTHDAY_MONTH &&
        now.getDate()      === BIRTHDAY_DAY
      );

      if (isTodayBirthday) {
        // It IS the birthday right now — celebrate!
        hoursEl.textContent   = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        msgEl.style.display      = 'flex';
        msgEl.style.flexDirection = 'column';
        msgEl.style.alignItems   = 'center';
        msgEl.style.gap          = '8px';
        window.triggerConfetti();
        return;
      } else {
        // Past this year's birthday — count to next year
        bdayMidnight.setFullYear(thisYear + 1);
      }
    }

    const diffMs       = bdayMidnight - now;
    const totalSeconds = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (hoursEl.textContent   !== pad(h)) tick(hoursEl,   pad(h));
    if (minutesEl.textContent !== pad(m)) tick(minutesEl, pad(m));
    tick(secondsEl, pad(s));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ── SMOOTH NAV SCROLL ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── SECTION LABEL EMOJI FLOAT ───────────────
document.querySelectorAll('.section-label').forEach((label, i) => {
  label.style.animationDelay = `${i * 0.2}s`;
});

// ── ADD SPARKLE CURSOR TRAIL ─────────────────
(function initCursorTrail() {
  const emojis = ['✨', '💕', '🌸', '⭐', '💖', '🌟'];
  let lastX = 0, lastY = 0, frameCount = 0;

  document.addEventListener('mousemove', (e) => {
    frameCount++;
    if (frameCount % 5 !== 0) return; // throttle
    if (Math.abs(e.clientX - lastX) < 5 && Math.abs(e.clientY - lastY) < 5) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX - 10}px;
      top:  ${e.clientY - 10}px;
      font-size: 1.2rem;
      pointer-events: none;
      z-index: 9998;
      animation: trailFade 0.8s ease forwards;
      user-select: none;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  });

  // Inject keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes trailFade {
      0%   { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-30px) scale(0.5); }
    }
  `;
  document.head.appendChild(style);
})();

// ── MUSIC NOTE EASTER EGG ON CAKE CLICK ─────
document.querySelector('.cake-emoji').addEventListener('click', () => {
  window.triggerConfetti();
  const notes = ['🎵', '🎶', '🎵', '🎶'];
  notes.forEach((note, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = note;
      el.style.cssText = `
        position: fixed;
        left: ${40 + i * 60}%;
        top: 30%;
        font-size: 2rem;
        pointer-events: none;
        z-index: 9999;
        animation: noteFloat 1.5s ease forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }, i * 200);
  });

  const noteStyle = document.createElement('style');
  noteStyle.textContent = `
    @keyframes noteFloat {
      0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
      100% { opacity: 0; transform: translateY(-80px) rotate(20deg); }
    }
  `;
  if (!document.querySelector('#note-style')) {
    noteStyle.id = 'note-style';
    document.head.appendChild(noteStyle);
  }
});

// ── MUSIC CONTROL SYSTEM ────────────────────
(function initMusicControl() {
  const audio = document.getElementById('bg-audio');
  const gate  = document.getElementById('music-gate');
  if (!audio || !gate) return;

  audio.volume = 0.40;

  gate.addEventListener('click', () => {
    // Play immediately on explicit user action
    audio.play().catch(err => console.log('Audio playback error:', err));

    // Smooth transition fade out
    gate.style.transition = 'opacity 0.6s ease';
    gate.style.opacity = '0';
    setTimeout(() => gate.remove(), 600);

    // Trigger initial burst of confetti
    if (window.triggerConfetti) {
      setTimeout(() => {
        window.triggerConfetti();
      }, 300);
    }
  });
})();
