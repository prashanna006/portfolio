document.addEventListener('DOMContentLoaded', () => {

/* ─────────────────────────────────────────────────
   FAVICON — canvas-drawn "ps" monogram
───────────────────────────────────────────────── */
const faviconCanvas = document.createElement('canvas');
faviconCanvas.width  = 64;
faviconCanvas.height = 64;
const fCtx = faviconCanvas.getContext('2d');
const faviconLink = document.getElementById('favicon');

function drawFavicon(hex) {
  fCtx.clearRect(0, 0, 64, 64);
  const isDark = document.body.classList.contains('dark');
  const bg = isDark ? '#0f0e0c' : '#f5f2ed';
  fCtx.fillStyle = bg;
  roundRect(fCtx, 0, 0, 64, 64, 8);
  fCtx.fill();
  fCtx.strokeStyle = hex;
  fCtx.lineWidth = 2;
  roundRect(fCtx, 2, 2, 60, 60, 7);
  fCtx.stroke();
  fCtx.fillStyle = hex;
  fCtx.font = 'bold 26px "DM Mono", monospace';
  fCtx.textAlign = 'center';
  fCtx.textBaseline = 'middle';
  fCtx.fillText('ps', 32, 33);
  faviconLink.href = faviconCanvas.toDataURL('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─────────────────────────────────────────────────
   DARK MODE TOGGLE
───────────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  drawFavicon(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e8943a');
}

themeToggle.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') applyTheme(true);

/* ─────────────────────────────────────────────────
   ACCENT COLOR PICKER
───────────────────────────────────────────────── */
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
  root.style.setProperty('--accent',     hex);
  root.style.setProperty('--accent-hi',  `rgb(${Math.min(r+20,255)},${Math.min(g+20,255)},${Math.min(b+20,255)})`);
  root.style.setProperty('--accent-lo',  `rgb(${Math.round(r*.8)},${Math.round(g*.8)},${Math.round(b*.8)})`);
  root.style.setProperty('--accent-dim', `rgba(${r},${g},${b},.10)`);
  localStorage.setItem('accent', hex);
  drawFavicon(hex);
}

picker.addEventListener('input', e => applyAccent(e.target.value));

const savedAccent = localStorage.getItem('accent');
if (savedAccent) { picker.value = savedAccent; applyAccent(savedAccent); }
else { applyAccent('#e8943a'); }

/* ─────────────────────────────────────────────────
   NAV SCROLL STATE
───────────────────────────────────────────────── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─────────────────────────────────────────────────
   SMOOTH SCROLL WITH NAV OFFSET
───────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

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
document.addEventListener('click', e => {
  if (!drawer.contains(e.target) && !hamburger.contains(e.target)) closeDrawer();
});

/* ─────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
revealEls.forEach(el => observer.observe(el));

}); // DOMContentLoaded