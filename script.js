// Progressive enhancement: figures remain direct image links without JavaScript.
const dialog = document.getElementById('figure-dialog');
const expandedImage = document.getElementById('expanded-figure');
const caption = document.getElementById('figure-caption');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-figure]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      expandedImage.src = link.href;
      expandedImage.alt = link.querySelector('img')?.alt || link.dataset.caption;
      caption.textContent = link.dataset.caption;
      document.getElementById('original-link').href = link.href;
      document.body.classList.add('dialog-open');
      dialog.showModal();
    });
  });
  document.getElementById('close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
// Measure the actual sticky header; one animation-frame update per scroll burst.
const navigationLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const header = document.querySelector('.masthead');
const targets = navigationLinks.map(link => document.querySelector(link.getAttribute('href')));
let queued = false;
let anchorIntent = location.hash;
navigationLinks.forEach(link => link.addEventListener('click', () => { anchorIntent = link.hash; queueNavigation(); }));
addEventListener('hashchange', () => { anchorIntent = location.hash; queueNavigation(); });
addEventListener('popstate', () => { anchorIntent = location.hash; queueNavigation(); });
function clearIntent() { anchorIntent = ''; queueNavigation(); }
addEventListener('wheel', clearIntent, { passive: true });
addEventListener('touchstart', clearIntent, { passive: true });
addEventListener('keydown', e => { if (['PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(e.key)) clearIntent(); });
function updateNavigation() {
  queued = false;
  const offset = header.getBoundingClientRect().height + 18;
  let index = 0;
  targets.forEach((target, i) => { if (target.getBoundingClientRect().top <= offset + 2) index = i; });
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 3 && scrollY > 0) {
    index = targets.length - 1;
    // Short final sections share the bottom viewport: honor an explicit CV anchor.
    const cvIndex = navigationLinks.findIndex(link => link.hash === '#cv');
    if (anchorIntent === '#cv' && targets[cvIndex].getBoundingClientRect().top >= offset - 2) index = cvIndex;
  }
  navigationLinks.forEach((link, i) => {
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function queueNavigation() { if (!queued) { queued = true; requestAnimationFrame(updateNavigation); } }
function measureHeader() {
  document.documentElement.style.setProperty('--anchor-offset', `${header.getBoundingClientRect().height + 18}px`);
  queueNavigation();
}
new ResizeObserver(measureHeader).observe(header);
addEventListener('scroll', queueNavigation, { passive: true });
addEventListener('resize', measureHeader);
addEventListener('hashchange', queueNavigation);
addEventListener('popstate', queueNavigation);
addEventListener('pageshow', measureHeader);
document.addEventListener('toggle', queueNavigation, true);
measureHeader();
// No tracking: this only reads a same-origin aggregate JSON file.
async function renderVisitorMap() {
  const cfg = window.siteConfig?.visitorMap;
  const element = document.querySelector('.visitor-map');
  if (!cfg?.enabled) return;
  element.hidden = false;
  const summary = document.getElementById('visitor-summary');
  const mode = element.querySelector('.visitor-mode');
  try {
    const url = new URL(cfg.dataSource, location.href);
    if (url.origin !== location.origin) throw new Error('Use a self-hosted aggregate JSON source.');
    const response = await fetch(url);
    if (!response.ok) throw new Error('Data unavailable');
    const data = await response.json();
    if (typeof data.demo !== 'boolean' || data.demo !== cfg.demoMode || !Array.isArray(data.locations)) throw new Error('Data mode mismatch');
    const points = data.locations.filter(p => Number.isFinite(p.lat) && Math.abs(p.lat) <= 90 && Number.isFinite(p.lon) && Math.abs(p.lon) <= 180 && Number.isInteger(p.visitors) && p.visitors >= 0);
    mode.textContent = data.demo ? 'Demo data · Not real visitors' : 'Aggregated visitor locations';
    element.querySelector('.visitor-note').textContent = data.demo ? 'Illustrative locations only. No visitor tracking.' : 'Country or region aggregates. No tracking by this component.';
    const svg = document.getElementById('visitor-points');
    points.forEach(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.lon + 180); circle.setAttribute('cy', 90 - point.lat); circle.setAttribute('r', '3.5');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title'); title.textContent = `${point.label}: ${point.visitors}${data.demo ? ' example visitors' : ' visitors'}`;
      circle.append(title); svg.append(circle);
    });
    summary.textContent = `${points.reduce((sum, p) => sum + p.visitors, 0)} ${data.demo ? 'example visitors' : 'visitors'} · ${points.length} ${data.demo ? 'sample locations' : 'locations'}`;
  } catch { summary.textContent = 'Visitor locations unavailable.'; }
}
renderVisitorMap();
