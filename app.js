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
    ${cat.img ? `<div class="feature"><figure class="tilt"><img class="depth" src="${cat.img}" alt="" loading="lazy"></figure><div>${list}</div></div>` : list}`;
  panels.append(panel);
});

function selectTab(tab, focus) {
  $$('.tab', tabs).forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
  $$('.panel', panels).forEach(p => {
    const on = p.id === tab.getAttribute('aria-controls');
    p.hidden = !on;
    // restart item animation on each switch
    if (on) $$('.item', p).forEach(it => { it.style.animation = 'none'; it.offsetHeight; it.style.animation = ''; });
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
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
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
function restart() { stop(); if (!reduced) auto = setInterval(() => spin(angle - step), 3200); }
new IntersectionObserver(([e]) => e.isIntersecting ? restart() : stop()).observe(carousel);

// ---- Highlight today's hours (New York time)
const day = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay();
$$('.htable tr').forEach(tr => tr.classList.toggle('today', tr.dataset.days.split(',').includes(String(day))));

// ---- Pause background videos when off-screen (saves battery on phones)
$$('video').forEach(v => new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v));
