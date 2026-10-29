// Menu data copied from houseofsubsny.com (Oct 2026)
const MENU = [
  { id: 'subs', name: 'Subs', note: 'create your own — whole wheat, regular wrap, or baguette', img: 'assets/schnitzel.jpg',
    footer: 'Double meat +$6 · double baby chicken or pulled beef +$7.',
    items: [['Steak Sandwich', '$20', 'baguette or wrap'], ['House Special Sandwich', '$16', '', 'roasted peppers and zucchini'], ['Baby Chicken', '$16'], ['Pastrami', '$16'], ['Pulled Beef', '$16'], ['Hard Salami', '$16'], ['Schnitzel', '$14'], ['Crispy Spicy Chicken', '$14'], ['Grilled Chicken Breast', '$14'], ['Poppers', '$14', 'spicy, BBQ, sweet chili, or plain'], ['Salami', '$12'], ['Bologna', '$12'], ['Turkey Pastrami', '$12'], ['Turkey Breast', '$12'], ['Mexican-Style Turkey', '$12'], ['Falafel Sub', '$10'], ['Grilled Veggie Sandwich', '$10'], ['Falafel in Pita', '$8']] },
  { id: 'kabob', name: 'Kabob Entrées', note: 'off the charcoal', img: 'assets/kabob-platter.jpg',
    footer: 'Every kabob entrée comes with rice — your choice of white or green rice (or swap it for salad).',
    items: [['King Combo', '$110', '', '1 barg, 1 joojeh, 2 kubideh · a shallow tray each of white and green rice'], ['Combination', '$95', '', '1 kubideh, 1 joojeh, 1 barg · medium tray of white or green rice'], ['Soltani DX', '$68', '', '1 barg + 1 joojeh or boneless · shallow tray of white or green rice'], ['Barg Soltani', '$58', '', '1 skewer kubideh + 1 skewer barg · white or green rice'], ['Joojeh Soltani', '$49', '', '1 skewer joojeh + 1 skewer kubideh · white or green rice'], ['Barg Kebab', '$47', '', '1 skewer barg · white or green rice'], ['Kubideh Kebab', '$37', '', '2 skewers kubideh · white or green rice'], ['Joojeh Kebab', '$37', 'or boneless', '1 skewer joojeh · white or green rice'], ['Salmon Kebab', '$35', '', '1 skewer salmon · white or green rice']] },
  { id: 'burgers', name: 'Burgers & More', note: 'burgers, burritos & nachos',
    footer: 'Burritos and nachos come with fried beans, guacamole, your choice of four toppings, and any meat of choice.',
    items: [['Burritos', '$17'], ['Burger', '$14'], ['Nachos', '$14']] },
  { id: 'platters', name: 'Platters', note: 'your choice of sides',
    items: [['Baby Chicken Platter', '$18'], ['Pulled Beef Platter', '$18'], ['Any Chicken Platter', '$17'], ['Falafel Platter', '$14']] },
  { id: 'soups', name: 'Soups', note: '16 oz small / 32 oz large',
    items: [['Pacheh', 'sm $15 · lg $29', '', '', 'Sundays only'], ['Chicken Soup', 'sm $8 · lg $15'], ['Ash Reshteh', 'sm $7 · lg $14'], ['Lentil', 'sm $7 · lg $14'], ['Chulent', 'sm $7 · lg $14', '', '', 'Thu & Fri']] },
  { id: 'sides', name: 'Sides',
    items: [['Poppers', '$14', 'spicy, BBQ, sweet chili, or plain'], ['Chicken Bites', '$14'], ['Tahdig with Khoresht', '$12'], ['Green Rice', '$9'], ['French Fries', '$8'], ['Spicy Fries', '$8'], ['White Rice', '$7'], ['Tahdig', '$7'], ['Deli Roll', '$6'], ['Onion Rings', '$6'], ['Falafels', '$5'], ['Coleslaw', '$5'], ['Israeli Salad', '$5'], ['Chips', '$2']] },
  { id: 'salads', name: 'Salads', note: 'create your own from the salad bar',
    items: [['Large Salad', '$12'], ['Small Salad', '$9'], ['Add Pulled Beef, Pastrami, or Baby Chicken', '+$7'], ['Add Chicken or Deli Meat', '+$6'], ['Add Avocado', '+$3']] },
  { id: 'kids', name: 'Kids', note: 'comes with french fries and a can of soda',
    items: [['Hot Dog', '$10'], ['Poppers', '$10', '6 pieces — spicy, BBQ, sweet chili, or plain']] },
  { id: 'drinks', name: 'Drinks',
    items: [['Fountain Soda', '$3'], ['Snapple', '$3'], ['Soda Can', '$2'], ['Israeli Drink', '$2'], ['Water', '$2']] },
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

// ---- Menu tabs
const tabs = $('#tabs'), panels = $('#panels');
MENU.forEach((cat, ci) => {
  const tab = document.createElement('button');
  Object.assign(tab, { className: 'tab', id: `tab-${cat.id}`, textContent: cat.name });
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', `panel-${cat.id}`);
  tab.setAttribute('aria-selected', ci === 0);
  tab.tabIndex = ci === 0 ? 0 : -1;
  tabs.append(tab);

  const items = cat.items.map(([name, price, sub = '', desc = '', badge = ''], i) => `
    <div class="item" style="--d:${i}">
      <b>${name}${sub ? `<i>${sub}</i>` : ''}${badge ? `<span class="badge">${badge}</span>` : ''}</b>
      <span class="p">${price}</span>
      ${desc ? `<small>${desc}</small>` : ''}
    </div>`).join('');
  const list = `<div class="items">${items}</div>${cat.footer ? `<p class="note">${cat.footer}</p>` : ''}`;
  const panel = document.createElement('div');
  Object.assign(panel, { className: 'panel', id: `panel-${cat.id}`, hidden: ci !== 0 });
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.innerHTML = `
    <div class="panel-head"><h3>${cat.name}</h3>${cat.note ? `<p>${cat.note}</p>` : ''}</div>
    ${cat.img ? `<div class="feature"><figure class="tilt depthpic"><img class="bg" src="${cat.img}" alt="" loading="lazy"><img class="fg" src="${cat.img}" alt="" loading="lazy"></figure><div>${list}</div></div>` : list}`;
  panels.append(panel);
});

// Prices count up from $0 (handles "sm $15 · lg $29")
function countUp(panel) {
  if (reduced) return;
  $$('.p', panel).forEach(el => {
    const txt = el.dataset.v ??= el.textContent, t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 900), e = 1 - (1 - k) ** 3;
      el.textContent = txt.replace(/\d+/g, n => Math.round(n * e));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function selectTab(tab, focus) {
  const all = $$('.tab', tabs);
  const from = all.findIndex(t => t.getAttribute('aria-selected') === 'true'), to = all.indexOf(tab);
  all.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
  $$('.panel', panels).forEach(p => {
    const on = p.id === tab.getAttribute('aria-controls');
    p.hidden = !on;
    if (!on) return;
    p.style.setProperty('--dir', Math.sign(to - from));
    // restart panel + item animations on each switch
    [p, ...$$('.item', p)].forEach(it => { it.style.animation = 'none'; it.offsetHeight; it.style.animation = ''; });
    countUp(p);
  });
  tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
  if (focus) tab.focus();
  initTilt();
}
tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) selectTab(t); });
tabs.addEventListener('keydown', e => {
  const all = $$('.tab', tabs), i = all.indexOf(document.activeElement);
  const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key];
  if (n === undefined || i < 0) return;
  e.preventDefault();
  selectTab(all[(n + all.length) % all.length], true);
});

// ---- Hero headline: split into animated letters (keeps <em>/<br>)
const h1 = $('.split');
let delay = 0;
(function split(node) {
  [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(word => {
        if (!word) return;
        if (/^\s+$/.test(word)) return frag.append(' ');
        const w = document.createElement('span');
        w.style.whiteSpace = 'nowrap';
        [...word].forEach(c => {
          const s = document.createElement('span');
          s.className = 'ch'; s.textContent = c; s.style.animationDelay = `${(delay++) * 35}ms`;
          w.append(s);
        });
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') split(n);
  });
})(h1);
h1.setAttribute('aria-label', h1.textContent);

// ---- Scroll reveal
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
  setTimeout(() => { e.target.style.transitionDelay = ''; }, 1300); // stagger delay would otherwise lag the 3D tilt
}), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; io.observe(el); });

// ---- Nav: solid on scroll, progress bar, active link, hero parallax
const nav = $('#nav'), bar = $('.progress'), heroVid = $('.hero-video');
const sections = $$('.links a').map(a => [a, $(a.getAttribute('href'))]);
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('solid', y > 40);
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduced && y < innerHeight) heroVid.style.transform = `scale(1.08) translateY(${y * .25}px)`;
    sections.forEach(([a, s]) => {
      const r = s.getBoundingClientRect();
      a.classList.toggle('active', r.top < 140 && r.bottom > 140);
    });
    updateBuilder();
    updateStory();
    ticking = false;
  });
}, { passive: true });

// ---- Mobile menu
const burger = $('#burger'), links = $('#links');
const setMenu = open => {
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  links.classList.toggle('open', open);
  nav.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  // keep keyboard focus inside the open overlay
  [$('main'), $('footer')].forEach(el => { el.inert = open; });
  if (open) $('a', links).focus();
  else if (links.contains(document.activeElement)) burger.focus();
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---- 3D tilt on cards and photos (mouse only)
function initTilt() {
  if (reduced || !finePointer) return;
  $$('.tilt:not([data-tilt])').forEach(el => {
    el.dataset.tilt = '1';
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add('tilting');
      el.style.setProperty('--ry', `${(x - .5) * 14}deg`);
      el.style.setProperty('--rx', `${(.5 - y) * 12}deg`);
      el.style.setProperty('--gx', `${x * 100}%`);
      el.style.setProperty('--gy', `${y * 100}%`);
      el.style.setProperty('--px', x - .5);
      el.style.setProperty('--py', y - .5);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('tilting');
      ['--rx', '--ry'].forEach(v => el.style.setProperty(v, '0deg'));
      ['--px', '--py'].forEach(v => el.style.setProperty(v, 0));
    });
  });
}
initTilt();

// ---- 3D carousel: drag, arrows, keyboard, autoplay when visible
const ring = $('#ring'), carousel = $('#carousel');
const faces = $$('figure', ring);
const step = 360 / faces.length;
faces.forEach((f, i) => f.style.setProperty('--i', i));
let angle = 0, auto;
const spin = a => { angle = a; ring.style.setProperty('--angle', `${angle}deg`); };
$('#next').addEventListener('click', () => { spin(angle - step); restart(); });
$('#prev').addEventListener('click', () => { spin(angle + step); restart(); });
carousel.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { spin(angle - step); restart(); }
  if (e.key === 'ArrowLeft') { spin(angle + step); restart(); }
});
let startX = null, startAngle = 0;
carousel.addEventListener('pointerdown', e => { startX = e.clientX; startAngle = angle; ring.classList.add('dragging'); carousel.setPointerCapture(e.pointerId); stop(); });
carousel.addEventListener('pointermove', e => { if (startX !== null) spin(startAngle + (e.clientX - startX) * .35); });
const end = () => {
  if (startX === null) return;
  startX = null;
  ring.classList.remove('dragging');
  spin(Math.round(angle / step) * step); // snap to nearest photo
  restart();
};
carousel.addEventListener('pointerup', end);
carousel.addEventListener('pointercancel', end);
function stop() { clearInterval(auto); }
function restart() { stop(); if (!reduced && !isPaused() && !carousel.matches(':hover, :focus-within')) auto = setInterval(() => spin(angle - step), 3200); }
new IntersectionObserver(([e]) => e.isIntersecting ? restart() : stop()).observe(carousel);
// hold still while someone is looking at / focused on it
carousel.addEventListener('pointerenter', stop);
carousel.addEventListener('pointerleave', restart);
carousel.addEventListener('focusin', stop);
carousel.addEventListener('focusout', restart);

// ---- Highlight today's hours (New York time)
const day = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay();
$$('.htable tr').forEach(tr => tr.classList.toggle('today', tr.dataset.days.split(',').includes(String(day))));

// ---- Pause background videos when off-screen (saves battery on phones)
const videoSeen = new Map();
const syncVideo = v => (videoSeen.get(v) && !isPaused() ? v.play().catch(() => {}) : v.pause());
$$('video').forEach(v => {
  if (reduced) v.removeAttribute('autoplay');
  new IntersectionObserver(([e]) => { videoSeen.set(v, e.isIntersecting); syncVideo(v); }).observe(v);
});

// ---- Pause-motion toggle (videos, carousel autoplay, ticker, embers, 3D spin)
function isPaused() { return reduced || document.documentElement.classList.contains('paused'); }
const motionBtn = $('#motionToggle');
motionBtn.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('paused');
  motionBtn.setAttribute('aria-pressed', paused);
  motionBtn.textContent = paused ? '▶ Play motion' : '❚❚ Pause motion';
  $$('video').forEach(syncVideo);
  paused ? stop() : restart();
});

// ---- Open / closed status (New York time)
// shortcut: Friday closing is "1 hr before Shabbat" since sunset isn't computed; upgrade with a sunset table if needed.
function openStatus(day, mins) {
  const OPEN = 11 * 60, CLOSE = 21 * 60;
  if (day === 6) return [false, 'Closed for Shabbat · opens Sunday 11 am'];
  if (day === 5) return mins < OPEN ? [false, 'Closed · opens 11 am'] : [true, 'Open · pickup until 1 hr before Shabbat'];
  if (mins < OPEN) return [false, 'Closed · opens 11 am'];
  if (mins < CLOSE) return [true, 'Open now · until 9 pm'];
  return [false, day === 4 ? 'Closed · opens Friday 11 am' : 'Closed · opens tomorrow 11 am'];
}
console.assert(openStatus(1, 12 * 60)[0] && !openStatus(1, 22 * 60)[0] && !openStatus(6, 12 * 60)[0] && openStatus(5, 11 * 60)[0], 'openStatus self-check');
const ny = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
const [isOpen, label] = openStatus(ny.getDay(), ny.getHours() * 60 + ny.getMinutes());
Object.assign($('#status'), { textContent: label, hidden: false });
$('#status').classList.toggle('open', isOpen);

// ---- Count prices the first time the menu scrolls into view
new IntersectionObserver(([e], obs) => {
  if (!e.isIntersecting) return;
  countUp($('.panel:not([hidden])', panels));
  obs.disconnect();
}, { threshold: .2 }).observe(panels);

// ---- Sub builder: layers drop in as you scroll (side view, bottom to top)
const range = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');
const LAYERS = [
  ['Baguette', `<path d="M40 330 L560 330 Q572 332 566 354 Q556 394 500 396 L100 396 Q44 394 34 354 Q28 332 40 330Z" fill="url(#crust)"/><rect x="38" y="320" width="524" height="16" rx="7" fill="#f4dca6"/>`],
  ['Lettuce', `<path d="M18 326 ${range(14, i => `Q${38 + i * 40} ${i % 2 ? 292 : 300} ${58 + i * 40} 310`)} L582 326Z" fill="#6fae3a"/><path d="M30 318 ${range(13, i => `Q${50 + i * 40} 306 ${70 + i * 40} 316`)}" fill="none" stroke="#4f8a2a" stroke-width="3"/>`],
  ['Pastrami', range(8, i => `<ellipse cx="${72 + i * 65}" cy="${292 - (i % 2) * 6}" rx="50" ry="17" fill="${i % 2 ? '#9c3a38' : '#b24a45'}" stroke="#f0b3a0" stroke-width="3"/>`) + range(7, i => `<ellipse cx="${104 + i * 65}" cy="276" rx="46" ry="14" fill="#a8423f" stroke="#e9a594" stroke-width="3"/>`)],
  ['Tomato', range(5, i => `<ellipse cx="${100 + i * 100}" cy="260" rx="44" ry="11" fill="#e0402f" stroke="#b52a1e" stroke-width="3"/><ellipse cx="${88 + i * 100}" cy="259" rx="6" ry="2.5" fill="#ffd2a0"/><ellipse cx="${112 + i * 100}" cy="261" rx="6" ry="2.5" fill="#ffd2a0"/>`)],
  ['Pickles', range(6, i => `<ellipse cx="${90 + i * 84}" cy="248" rx="32" ry="8" fill="#6f8f24"/><ellipse cx="${90 + i * 84}" cy="247" rx="22" ry="4" fill="#b6c95a"/>`)],
  ['Red onion', range(6, i => `<ellipse cx="${120 + i * 74}" cy="240" rx="30" ry="6" fill="none" stroke="#b05a9a" stroke-width="3"/><ellipse cx="${120 + i * 74}" cy="240" rx="18" ry="3.5" fill="none" stroke="#e8c6e0" stroke-width="2"/>`)],
  ['Sauce', `<path d="M60 234 ${range(12, i => `Q${80 + i * 40} ${i % 2 ? 222 : 246} ${100 + i * 40} 234`)}" fill="none" stroke="#f2c14e" stroke-width="7" stroke-linecap="round"/>`],
  ['Top it off', `<path d="M34 238 Q28 212 62 188 Q132 128 300 124 Q468 128 538 188 Q572 212 566 238Z" fill="url(#crust)"/><rect x="40" y="228" width="520" height="14" rx="7" fill="#f4dca6"/><path d="M110 168 Q200 136 300 134" fill="none" stroke="rgba(255,240,210,.45)" stroke-width="8" stroke-linecap="round"/>${range(16, i => `<ellipse cx="${120 + (i * 53) % 370}" cy="${150 + (i * 29) % 50}" rx="5" ry="2.4" fill="#fff4dc" transform="rotate(${(i * 37) % 70 - 35} ${120 + (i * 53) % 370} ${150 + (i * 29) % 50})"/>`)}`],
];
const sub = $('#sub'), steps = $('#steps'), builder = $('#builder'), builderEnd = $('.builder-end');
sub.innerHTML = `<defs><linearGradient id="crust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ad5c"/><stop offset="1" stop-color="#a45d1f"/></linearGradient></defs>` +
  LAYERS.map(([, svg]) => `<g class="layer">${svg}</g>`).join('');
steps.innerHTML = LAYERS.map(([name]) => `<li>${name}</li>`).join('');
const layerEls = $$('.layer', sub), stepEls = $$('li', steps);

function updateBuilder() {
  const r = builder.getBoundingClientRect();
  const p = reduced ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  const n = LAYERS.length;
  layerEls.forEach((g, i) => {
    const k = Math.min(1, Math.max(0, p * (n + 1) - i)), e = 1 - (1 - k) ** 3;
    g.style.transform = `translateY(${(1 - e) * -520}px)`;
    g.style.opacity = k > 0 ? 1 : 0;
    stepEls[i].classList.toggle('on', k >= 1);
  });
  builderEnd.classList.toggle('on', p > n / (n + 1));
  sub.style.setProperty('--by', `${-14 + p * 28}deg`);
}
updateBuilder();

// ---- Embers + smoke over the grill photo and the catering video
function fire(canvas) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, running = false;
  const size = () => {
    const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2);
    w = r.width; h = r.height;
    canvas.width = w * d; canvas.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  const spawn = (p = {}) => Object.assign(p, {
    x: Math.random() * w, y: h + Math.random() * 40, vx: (Math.random() - .5) * .5, vy: -(.6 + Math.random() * 1.6),
    life: 0, max: 90 + Math.random() * 180, r: .8 + Math.random() * 2.2, smoke: Math.random() < .22,
  });
  size();
  const parts = Array.from({ length: 70 }, () => { const p = spawn(); p.y = Math.random() * h; p.life = Math.random() * p.max; return p; });
  function frame() {
    if (!running) return;
    if (isPaused()) return requestAnimationFrame(frame);
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.life++;
      p.x += p.vx + Math.sin((p.life + p.r * 40) / 18) * .35;
      p.y += p.vy * (p.smoke ? .45 : 1);
      const a = Math.max(0, 1 - p.life / p.max);
      if (p.smoke) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(230,215,205,${a * .07})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 12 + p.life * .3, 0, 7); ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,214,120,${a})`);
        g.addColorStop(.4, `rgba(255,120,30,${a * .6})`);
        g.addColorStop(1, 'rgba(255,80,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.r * 4, p.y - p.r * 4, p.r * 8, p.r * 8);
      }
      if (p.life > p.max || p.y < -40) spawn(p);
    }
    requestAnimationFrame(frame);
  }
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) frame(); }).observe(canvas);
}
if (!reduced) $$('.fire').forEach(fire);

// ---- Shabbat flip cards
$$('.flip').forEach(card => {
  const [front, back] = $$('.face', card);
  $$('.flip-btn', card).forEach(btn => btn.addEventListener('click', () => {
    const open = card.classList.toggle('flipped');
    front.inert = open;
    back.inert = !open;
    $('.flip-btn', open ? back : front).focus({ preventScroll: true });
  }));
});

// ---- Custom cursor (mouse only)
if (finePointer && !reduced) {
  const dot = Object.assign(document.createElement('div'), { className: 'cur-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cur-ring' });
  document.body.append(dot, ring);
  document.body.classList.add('has-cursor');
  let mx = -100, my = -100, rx = mx, ry = my;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const t = e.target;
    const label = t.closest('#carousel, .hero-3d') ? 'Drag' : t.closest('.flip') && !t.closest('button') ? 'Flip' : '';
    ring.textContent = label;
    ring.classList.toggle('label', !!label);
    ring.classList.toggle('hover', !label && !!t.closest('a, button, .tilt, video'));
    [dot, ring].forEach(c => c.classList.toggle('cur-hide', !!t.closest('iframe')));
  });
  document.addEventListener('pointerleave', () => [dot, ring].forEach(c => c.classList.add('cur-hide')));
  (function follow() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();
  // flipping a card by clicking anywhere on it, matching the "Flip" cursor
  $$('.flip').forEach(card => card.addEventListener('click', e => {
    if (!e.target.closest('button, a')) $('.face:not([inert]) .flip-btn', card).click();
  }));
}

// ---- Loader: keep it at least 700ms, at most until the page has loaded
const loader = $('#loader'), shownAt = performance.now();
const hideLoader = () => setTimeout(() => loader.classList.add('done'), Math.max(0, 700 - (performance.now() - shownAt)));
document.readyState === 'complete' ? hideLoader() : addEventListener('load', hideLoader);
setTimeout(() => loader.classList.add('done'), 3500);

// ---- Story words light up as the paragraph passes eye level
// ported from 21st.dev "Reading Text Reveal" (waleedkibhen): same eye-level progress + eased catch-up
const story = $('.story-text');
const KEYS = ['pastrami', 'joojeh', 'both'];
story.innerHTML = story.textContent.trim().split(/\s+/)
  .map(w => `<span class="w${KEYS.some(k => w.toLowerCase().startsWith(k)) ? ' key' : ''}">${w}</span>`).join(' ');
const storyWords = $$('.w', story);
let storyTarget = 0, storyNow = 0, storyRaf = null;
function storyTick() {
  storyNow += (storyTarget - storyNow) * .12;
  const settled = Math.abs(storyTarget - storyNow) < .001;
  if (settled) storyNow = storyTarget;
  const n = Math.floor(storyNow * storyWords.length + .0001);
  storyWords.forEach((w, i) => w.classList.toggle('lit', i < n));
  storyRaf = settled ? null : requestAnimationFrame(storyTick);
}
function updateStory() {
  const r = story.getBoundingClientRect(), eye = innerHeight * .62;
  storyTarget = reduced ? 1 : Math.min(1, Math.max(0, (eye - r.top) / r.height));
  if (reduced || document.hidden) return storyTick(); // no rAF in hidden tabs: jump straight there
  storyRaf ??= requestAnimationFrame(storyTick);
}
updateStory();

// ---- Spotlight glow that follows the pointer on cards
// ported from 21st.dev "Spotlight Card" (preetsuthar17)
$$('.kcard, .face.back, .moving-inner').forEach(el => {
  el.classList.add('spot');
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });
});

// ---- Ticker speeds up with scroll speed and flips direction when scrolling up
// ported from 21st.dev "Scroll Based Velocity" (dillionverma / Magic UI), without framer-motion
const track = $('.track');
if (!reduced) {
  track.style.animation = 'none';
  let x = 0, dir = -1, lastY = scrollY, vel = 0, last = performance.now();
  requestAnimationFrame(function loop(now) {
    const dt = Math.max(1, Math.min(64, now - last));
    last = now;
    vel += ((scrollY - lastY) / dt * 1000 - vel) * .1; // smoothed px/s, like useSpring(useVelocity)
    lastY = scrollY;
    if (vel > 20) dir = -1; else if (vel < -20) dir = 1;
    if (!isPaused()) {
      const half = track.scrollWidth / 2; // the track holds the list twice
      x += dir * 60 * (1 + Math.abs(vel) / 250) * dt / 1000;
      x = ((x % half) - half) % half;     // keep x in (-half, 0] so the loop is seamless
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(loop);
  });
}
