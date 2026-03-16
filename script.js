/* ─────────────────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('drawer');

function closeDrawer() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
});

// close drawer if user clicks outside of it
document.addEventListener('click', (e) => {
  if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
    closeDrawer();
  }
});

/* ─────────────────────────────────────────────────
   HERO CANVAS — ambient sensor waveform
───────────────────────────────────────────────── */
const canvas = document.getElementById('hero-bg');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const waves = [
  { amp: 30, freq: 0.010, speed: 0.016, phase: 0.0, yRatio: 0.38, alpha: 0.6,  color: '#e8943a' },
  { amp: 18, freq: 0.016, speed: 0.022, phase: 1.3, yRatio: 0.50, alpha: 0.35, color: '#c4741f' },
  { amp: 42, freq: 0.007, speed: 0.010, phase: 2.5, yRatio: 0.62, alpha: 0.18, color: '#f5a84e' },
  { amp: 14, freq: 0.024, speed: 0.030, phase: 0.8, yRatio: 0.28, alpha: 0.14, color: '#e8943a' },
];

function drawWave(w) {
  ctx.beginPath();
  ctx.strokeStyle = w.color;
  ctx.globalAlpha = w.alpha;
  ctx.lineWidth   = 1.0;
  const baseY = H * w.yRatio;
  for (let x = 0; x <= W; x += 3) {
    const y = baseY
      + Math.sin(x * w.freq + w.phase) * w.amp
      + Math.sin(x * w.freq * 2.3 + w.phase * 1.4) * w.amp * 0.35;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawDot(w) {
  const t = performance.now() * 0.001;
  const x = ((t * 55 * w.speed) * 80) % W;
  const y = H * w.yRatio
    + Math.sin(x * w.freq + w.phase) * w.amp
    + Math.sin(x * w.freq * 2.3 + w.phase * 1.4) * w.amp * 0.35;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fillStyle   = w.color;
  ctx.globalAlpha = w.alpha * 1.6;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  waves.forEach(w => {
    w.phase += w.speed * 0.6;
    drawWave(w);
    drawDot(w);
  });
  requestAnimationFrame(loop);
}
loop();

/* ─────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

/* ── ACCENT COLOR PICKER ───────────────────────── */
const picker = document.getElementById('accent-picker');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function applyAccent(hex) {
  const { r, g, b } = hexToRgb(hex);
  const root = document.documentElement;
  root.style.setProperty('--amber',     hex);
  root.style.setProperty('--amber-hi',  `rgb(${Math.min(r+20,255)}, ${Math.min(g+20,255)}, ${Math.min(b+20,255)})`);
  root.style.setProperty('--amber-lo',  `rgb(${Math.round(r*0.8)}, ${Math.round(g*0.8)}, ${Math.round(b*0.8)})`);
  root.style.setProperty('--amber-dim', `rgba(${r}, ${g}, ${b}, 0.1)`);
  localStorage.setItem('accent', hex);
}

picker.addEventListener('input', (e) => applyAccent(e.target.value));

const saved = localStorage.getItem('accent');
if (saved) { picker.value = saved; applyAccent(saved); }