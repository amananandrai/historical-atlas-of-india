// The atlas page (index.html): a map of the subcontinent that changes with a year slider.
// Each era shows its borders, a short history, the dynasties ruling in the chosen year, its battles,
// its schools of art, and a pin for every monument standing by that year (a pin opens the monument's
// 3D model on the monuments site). Rulers, dynasties, styles, battles and schools of art open in the
// side card, each at its own address: #ruler/akbar, #dynasty/chola, #style/mughal, #battle/plassey,
// #art/pahari, #styles, #glossary, #art.
import { MONUMENTS, MONUMENTS_SITE } from './monuments.js';
import { ERAS, formatYear } from './timeline-data.js';
import { TMAP, project } from './timeline-map.js';
import { DYNASTIES, LANES, RULERS, reigningAt, capitalsAt } from './atlas/dynasties.js';
import { FAMILIES, STYLES, TERMS, styleOf } from './atlas/styles.js';
import { BATTLES } from './atlas/battles.js';
import { ART, ART_KINDS, artOf, artAt } from './atlas/art.js';
import { SOURCES, NOT_YET, ISSUES } from './atlas/sources.js';
import { buildIndex, search, parseYear } from './atlas/search.js';

const TYPES = { sacred: 'Temples & shrines', fort: 'Forts & palaces', memorial: 'Tombs & memorials', civic: 'Civic & engineering' };
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, text) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NOW = ERAS.at(-1).end;

// A span of years as a reader expects it: "321–185 BCE", "c. 320–550 CE", "1628–1658".
function spanText(a, b, c) {
  const p = c ? 'c. ' : '';
  if (a === b) return p + formatYear(a);
  if (b < 0) return `${p}${-a}–${-b} BCE`;
  if (a < 0) return `${p}${-a} BCE – ${b} CE`;
  if (b < 1000) return `${p}${a}–${b} CE`;
  return `${p}${a}–${b >= NOW ? 'today' : b}`;
}

/* ---------- indexes ---------- */
const byId = new Map(MONUMENTS.map((m) => [m.id, m]));
const dynastyById = new Map(DYNASTIES.map((d) => [d.id, d]));
const rulerById = new Map(RULERS.map((r) => [r.id, r]));
const styleById = new Map(STYLES.map((s) => [s.id, s]));
const termById = new Map(TERMS.map((t) => [t.id, t]));
const battleById = new Map(BATTLES.map((b) => [b.id, b]));
const artById = new Map(ART.map((a) => [a.id, a]));
// Who built each monument: the ruler in whose reign it rose, or else the dynasty.
const builder = new Map();
for (const d of DYNASTIES) {
  for (const id of d.built || []) if (!builder.has(id)) builder.set(id, { dynasty: d });
  for (const r of d.rulers) for (const id of r.built || []) builder.set(id, { ruler: r, dynasty: d });
}
const rulerAt = (d, year) => d.rulers.find((r) => r.start <= year && year <= r.end);

/* ---------- the slider's scale ---------- */
// Every era gets an equal stretch of the slider, so three years of Partition are as easy to reach
// as eighteen centuries of the Indus cities. STEP positions to an era.
const STEP = 100, MAX = ERAS.length * STEP;
const eraAt = (pos) => Math.min(ERAS.length - 1, Math.floor(pos / STEP));
const yearAt = (pos) => {
  const i = eraAt(pos), e = ERAS[i];
  return Math.round(e.start + ((pos - i * STEP) / STEP) * (e.end - e.start));
};
const clampYear = (y) => Math.max(ERAS[0].start, Math.min(NOW, y));
const posOf = (year) => {
  const y = clampYear(year);
  let i = ERAS.findIndex((e) => y < e.end);
  if (i < 0) i = ERAS.length - 1;
  const e = ERAS[i];
  return Math.round(i * STEP + ((y - e.start) / (e.end - e.start)) * STEP);
};

/* ---------- layers ---------- */
const layers = { borders: true, monuments: true, capitals: false, battles: true, art: false };
try { Object.assign(layers, JSON.parse(localStorage.getItem('atlas-layers') || '{}')); } catch (e) { /* private window */ }
let styleFilter = null;          // a style id: only its monuments are pinned

/* ---------- the map ---------- */
const svg = $('tl-map');
svg.setAttribute('viewBox', `0 0 ${TMAP.width} ${TMAP.height}`);
svg.innerHTML = `
  <defs>
    <pattern id="hatch-a" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hatch a" x1="0" y1="0" x2="0" y2="6"/></pattern>
    <pattern id="hatch-b" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line class="hatch b" x1="0" y1="0" x2="0" y2="6"/></pattern>
    <pattern id="hatch-c" width="6" height="6" patternUnits="userSpaceOnUse"><line class="hatch c" x1="0" y1="0" x2="6" y2="0"/></pattern>
    <pattern id="hatch-d" width="6" height="6" patternUnits="userSpaceOnUse"><line class="hatch d" x1="0" y1="0" x2="0" y2="6"/></pattern>
  </defs>
  <path class="land" d="${TMAP.land}"/>
  <g id="tl-fills"></g>
  <path class="rivers" d="${TMAP.rivers}"/>
  <path class="today" d="${TMAP.indiaToday}"><title>India’s boundary today</title></path>
  <g id="tl-labels"></g>
  <g id="tl-capitals"></g>
  <g id="tl-art"></g>
  <g id="tl-battles"></g>
  <g id="tl-pins"></g>`;
const fillsG = $('tl-fills'), labelsG = $('tl-labels'), pinsG = $('tl-pins'), capitalsG = $('tl-capitals'), battlesG = $('tl-battles'), artG = $('tl-art');
const todayPath = svg.querySelector('.today');
const tip = $('tl-tip');

function showTip(anchor, html) {
  tip.innerHTML = html;
  tip.hidden = false;
  const r = anchor.getBoundingClientRect(), host = tip.parentElement.getBoundingClientRect();
  const left = Math.min(host.width - tip.offsetWidth - 8, Math.max(8, r.left - host.left + 12));
  const top = r.top - host.top - tip.offsetHeight - 8;
  tip.style.left = `${left}px`;
  tip.style.top = `${top < 8 ? r.bottom - host.top + 8 : top}px`;
}
const hideTip = () => { tip.hidden = true; };
function withTip(node, html) {
  const on = () => showTip(node, html());
  node.addEventListener('pointerenter', on);
  node.addEventListener('pointerleave', hideTip);
  node.addEventListener('focus', on);
  node.addEventListener('blur', hideTip);
  return node;
}

const pins = MONUMENTS.map((m) => {
  const [x, y] = project(m.lat, m.lng);
  const a = el('a', { href: `${MONUMENTS_SITE}/#${m.id}`, class: `pin t-${m.type}`, 'aria-label': `${m.name}, ${m.place}, ${m.built}. Open the 3D model` });
  a.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 3 }));
  const st = styleOf(m.id), by = builder.get(m.id);
  withTip(a, () => `<strong>${esc(m.name)}</strong><span>${esc(m.place)} · ${esc(m.built)}</span>`
    + `<span>${esc(st ? st.name : TYPES[m.type])}${by ? ` · ${esc(by.ruler ? `under ${by.ruler.name}` : by.dynasty.name)}` : ''}</span><span>Open in 3D</span>`);
  return { m, a, circle: a.firstChild, style: st && st.id };
}).sort((p, q) => p.m.year - q.m.year);

// An era has one map, or several (`maps`), each from its year `from` on: the Republic is drawn as it
// was on Republic Day 1950, after the States Reorganisation Act of 1956, and today.
const mapsOf = (e) => e.maps || (e.map ? [e.map] : []);
const mapAt = (e, year) => mapsOf(e).reduce((cur, m) => ((m.from ?? e.start) <= year ? m : cur), null);
const keyG = $('tl-key');

// Sets of shapes fetched the first time they are needed: the provinces and states of 1939 onwards
// (`units`, data/units/) and the snapshots traced from Joppen's plates (`plate`, data/plates/).
const unitSets = {};
const setOf = (map) => (map.units ? `units/${map.units}` : map.plate ? `plates/${map.plate}` : null);
function unitsOf(path) {
  if (Array.isArray(unitSets[path])) return unitSets[path];
  unitSets[path] ??= fetch(`data/${path}.json`).then((r) => r.json()).then((d) => {
    Object.assign(TMAP.shapes, d.shapes);
    unitSets[path] = d.units;
    if (shownMap && setOf(shownMap) === path) { const m = shownMap; shownMap = undefined; drawMap(m); }
  });
  return null;
}

let shownMap;
function drawMap(map) {
  if (map === shownMap) return;
  shownMap = map;
  fillsG.replaceChildren();
  labelsG.replaceChildren();
  keyG.replaceChildren();
  keyG.hidden = !(map && map.key);
  // India's boundary today stays as a dashed reference, unless the map is drawn from it.
  todayPath.style.display = map && (map.units || (map.fills || []).some(([s]) => s === 'india')) ? 'none' : '';
  if (!map) return;
  // `units` or `plate` names a set of shapes, each with its label point.
  const set = setOf(map), units = set ? unitsOf(set) || [] : [];
  const fills = [...(map.fills || []), ...units.map(([shape, cls, name, note]) => [shape, cls, note && note !== name && note !== 'main' ? `${name} (${note})` : name])];
  for (const [shape, cls, name] of fills) {
    const g = el('g', { class: `polity ${cls}` });
    g.appendChild(el('path', { class: 'tint', d: TMAP.shapes[shape] }));
    g.appendChild(el('path', { class: 'hatched', d: TMAP.shapes[shape], fill: `url(#hatch-${cls})` }));
    g.appendChild(el('title', {}, name));
    fillsG.appendChild(g);
  }
  const unitLabels = units.filter((u) => u.length > 4 && !(map.unlabelled || []).includes(u[2]))
    .map(([, cls, name, note, lat, lng]) => [name, lat, lng, map.plate ? (note === 'main' ? 'main' : 'in') : (map.unitKinds || {})[cls] || 'unit']);
  for (const [name, lat, lng, kind] of [...unitLabels, ...(map.labels || [])]) {
    const [x, y] = project(lat, lng);
    if (kind.startsWith('city')) {
      const left = kind === 'city-left';
      labelsG.appendChild(el('rect', { class: 'city-dot', x: x - 2.2, y: y - 2.2, width: 4.4, height: 4.4 }));
      labelsG.appendChild(el('text', { class: 'lab city', x: x + (left ? -5.5 : 5.5), y: y + 3.4, 'text-anchor': left ? 'end' : 'start' }, name));
      continue;
    }
    // A long name breaks into two lines.
    const words = name.split(' '), two = words.length > 1 && name.length > (kind === 'main' ? 16 : 14);
    const t = el('text', { class: `lab ${kind}`, x, y, 'text-anchor': 'middle' });
    if (two) {
      const half = Math.ceil(words.length / 2);
      t.appendChild(el('tspan', { x, dy: '-0.55em' }, words.slice(0, half).join(' ')));
      t.appendChild(el('tspan', { x, dy: '1.15em' }, words.slice(half).join(' ')));
    } else t.textContent = name;
    labelsG.appendChild(t);
  }
  for (const [cls, text] of map.key || []) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="swatch ${cls}"></span>${esc(text)}`;
    keyG.appendChild(li);
  }
}

function drawPins(year, era) {
  const frag = document.createDocumentFragment();
  let standing = 0;
  for (const p of pins) {
    if (p.m.year > year) break;
    if (styleFilter && p.style !== styleFilter) continue;
    standing++;
    const fresh = p.m.year >= era.start;
    p.a.classList.toggle('fresh', fresh);
    p.circle.setAttribute('r', fresh ? 4.6 : 2.6);
    frag.appendChild(p.a);          // sorted by year, so the era's own pins are drawn on top
  }
  if (layers.monuments) pinsG.replaceChildren(frag); else pinsG.replaceChildren();
  return standing;
}

// A small star for each capital in use that year; it opens its dynasty.
function drawCapitals(year) {
  capitalsG.replaceChildren();
  if (!layers.capitals) return;
  const seen = new Set();
  for (const c of capitalsAt(year)) {
    const key = `${c.lat},${c.lng}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const [x, y] = project(c.lat, c.lng);
    const a = el('a', { href: `#dynasty/${c.dynasty.id}`, class: 'capital', 'aria-label': `${c.name}, capital of the ${c.dynasty.name}` });
    const pts = [...Array(10)].map((_, k) => { const r = k % 2 ? 2.4 : 5.6, t = (Math.PI / 5) * k - Math.PI / 2; return `${(x + r * Math.cos(t)).toFixed(1)},${(y + r * Math.sin(t)).toFixed(1)}`; }).join(' ');
    a.appendChild(el('polygon', { points: pts }));
    a.appendChild(el('text', { class: 'lab capital-name', x: x + 7, y: y + 3.5 }, c.name));
    withTip(a, () => `<strong>${esc(c.name)}</strong><span>Capital of the ${esc(c.dynasty.name)}</span><span>Open the dynasty</span>`);
    capitalsG.appendChild(a);
  }
}

// Battles of the era fought by the chosen year, each a crossed mark.
function drawBattles(year, era, focus) {
  battlesG.replaceChildren();
  if (!layers.battles) return;
  for (const b of BATTLES) {
    if (b.year < era.start || b.year > year || b.year > era.end) continue;
    const [x, y] = project(b.lat, b.lng);
    const a = el('a', { href: `#battle/${b.id}`, class: `battle${b.id === focus ? ' focus' : ''}`, 'aria-label': `${b.name}, ${formatYear(b.year)}` });
    a.appendChild(el('circle', { cx: x, cy: y, r: 6.5 }));
    a.appendChild(el('path', { d: `M${x - 3.3} ${y - 3.3}L${x + 3.3} ${y + 3.3}M${x + 3.3} ${y - 3.3}L${x - 3.3} ${y + 3.3}` }));
    withTip(a, () => `<strong>${esc(b.name)}</strong><span>${b.c ? 'c. ' : ''}${esc(formatYear(b.year))} · ${esc(b.sides)}</span><span>Open the battle</span>`);
    battlesG.appendChild(a);
  }
}

// A diamond at each centre of the schools of art at work in the chosen year: filled for sculpture,
// open for painting. A centre shared by two schools gets one mark per school, side by side.
function drawArt(year, focus) {
  artG.replaceChildren();
  if (!layers.art) return;
  const used = new Map();
  for (const s of artAt(year)) {
    for (const [name, lat, lng] of s.centres) {
      const key = `${lat},${lng}`, n = used.get(key) || 0;
      used.set(key, n + 1);
      const [px, py] = project(lat, lng), x = px + n * 9, y = py;
      const a = el('a', { href: `#art/${s.id}`, class: `art k-${s.kind}${s.id === focus ? ' focus' : ''}`, 'aria-label': `${name}: ${s.name} ${s.kind}` });
      a.appendChild(el('path', { d: `M${x} ${y - 5.5}L${x + 5.5} ${y}L${x} ${y + 5.5}L${x - 5.5} ${y}Z` }));
      withTip(a, () => `<strong>${esc(s.name)}</strong><span>${esc(ART_KINDS.find((k) => k.id === s.kind).name)} · ${esc(name)}</span><span>${esc(spanText(s.start, s.end, s.c))}</span><span>Open the school</span>`);
      artG.appendChild(a);
    }
  }
}

/* ---------- the dynasty chart ---------- */
// Lanes by region across the era's span (at least 150 years), each dynasty a bar; the line is the year.
const chart = $('tl-chart'), chartSvg = $('chart-svg'), navChart = $('nav-chart');
let chartOpen = false;
function drawChart(era, year) {
  if (!chartOpen) return;
  let a = era.start, b = era.end;
  if (b - a < 150) { const mid = (a + b) / 2; a = Math.round(mid - 75); b = Math.round(mid + 75); }
  // Each lane gets as many rows as its overlapping dynasties need.
  const lanes = LANES.map((lane) => {
    const ds = DYNASTIES.filter((d) => d.lane === lane.id && d.end >= a && d.start <= b).sort((p, q) => p.start - q.start);
    const ends = [], slots = new Map();
    for (const d of ds) {
      let slot = ends.findIndex((e) => e <= d.start);
      if (slot < 0) slot = ends.length;
      ends[slot] = d.end;
      slots.set(d, slot);
    }
    const n = Math.max(1, ends.length);
    return { lane, ds, slots, n, h: n === 1 ? 24 : n * 12 + 4 };
  });
  const W = 1000, L = 92, top = 22, H = top + lanes.reduce((t, l) => t + l.h, 0) + 4;
  const x = (yv) => L + ((yv - a) / (b - a)) * (W - L - 8);
  chartSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  chartSvg.replaceChildren();
  // Axis: a round step giving about six ticks.
  const raw = (b - a) / 6, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 5, 10].map((s) => s * mag).find((s) => s >= raw);
  for (let t = Math.ceil(a / step) * step; t <= b; t += step) {
    chartSvg.appendChild(el('line', { class: 'tick', x1: x(t), x2: x(t), y1: top - 4, y2: H }));
    chartSvg.appendChild(el('text', { class: 'axis', x: x(t), y: 12, 'text-anchor': 'middle' }, t < 0 ? `${-t} BCE` : String(t)));
  }
  let y = top;
  for (const { lane, ds, slots, n, h: laneH } of lanes) {
    chartSvg.appendChild(el('text', { class: 'lane', x: 4, y: y + Math.min(15, laneH / 2 + 4) }, lane.name));
    chartSvg.appendChild(el('line', { class: 'lane-rule', x1: L, x2: W, y1: y + laneH, y2: y + laneH }));
    for (const d of ds) {
      const thin = n > 1, h = thin ? 10 : 18, yy = y + 3 + (thin ? slots.get(d) * 12 : 0);
      const x0 = x(Math.max(a, d.start)), x1 = x(Math.min(b, d.end));
      const g = el('a', { href: `#dynasty/${d.id}`, class: `bar${d.start <= year && year <= d.end ? ' now' : ''}`, 'aria-label': `${d.name}, ${spanText(d.start, d.end, d.c)}` });
      g.appendChild(el('rect', { x: x0, y: yy, width: Math.max(2, x1 - x0), height: h, rx: 3 }));
      if (x1 - x0 > d.name.length * (thin ? 5 : 6.2) + 8) g.appendChild(el('text', { x: x0 + 5, y: yy + (thin ? 8 : 12.5), class: thin ? 'small' : '' }, d.name));
      g.appendChild(el('title', {}, `${d.name}, ${spanText(d.start, d.end, d.c)}`));
      chartSvg.appendChild(g);
    }
    y += laneH;
  }
  if (year >= a && year <= b) chartSvg.appendChild(el('line', { class: 'now-line', x1: x(year), x2: x(year), y1: top - 6, y2: H }));
  if (!DYNASTIES.some((d) => d.end >= a && d.start <= b)) chartSvg.appendChild(el('text', { class: 'axis', x: (L + W) / 2, y: top + 40, 'text-anchor': 'middle' }, 'No dynasties are known by name for this era.'));
}
function setChart(open) {
  chartOpen = open;
  chart.hidden = !open;
  navChart.setAttribute('aria-pressed', String(open));
  if (open) drawChart(ERAS[eraAt(+range.value)], current.year);
}
navChart.addEventListener('click', () => setChart(!chartOpen));

/* ---------- the era card ---------- */
const kindName = (k) => (k === 'sculpture' ? 'Sculpture' : 'Painting');
const artItem = (a, kind = true) => `<li><a href="#art/${a.id}">${esc(a.name)}</a> <span>${kind ? `${kindName(a.kind)} · ` : ''}${esc(spanText(a.start, a.end, a.c))}</span></li>`;
const artList = (as, kind = true) => `<ul class="built">${as.map((a) => artItem(a, kind)).join('')}</ul>`;
const thumb = (m) => `<a class="thumb" href="${MONUMENTS_SITE}/#${m.id}"><img src="${MONUMENTS_SITE}/assets/views/${m.id}.png" alt="" width="800" height="450" loading="lazy"><span><strong>${esc(m.name)}</strong> ${esc(m.built)}</span></a>`;
let cardEra = -1;
function drawCard(i) {
  if (i === cardEra) return;
  cardEra = i;
  const e = ERAS[i];
  $('c-count').textContent = `Era ${i + 1} of ${ERAS.length}`;
  $('c-name').textContent = e.name;
  $('c-span').textContent = e.span;
  $('c-powers').textContent = e.powers;
  $('c-change').textContent = e.change;
  $('c-dates').innerHTML = e.dates.map((d) => `<li>${esc(d)}</li>`).join('');
  const lead = e.lead && byId.get(e.lead);
  const leadStyle = lead && styleOf(lead.id);
  $('c-lead').innerHTML = lead
    ? `<a class="lead" href="${MONUMENTS_SITE}/#${lead.id}">
         <img src="${MONUMENTS_SITE}/assets/views/${lead.id}.png" alt="" width="800" height="450" loading="lazy">
         <span class="lead-text"><strong>${esc(lead.name)}</strong><span>${esc(lead.place)} · ${esc(lead.built)}</span><span class="go">Open the 3D model →</span></span>
       </a>${leadStyle ? `<p class="lead-style">Style: <a href="#style/${leadStyle.id}">${esc(leadStyle.name)}</a></p>` : ''}`
    : `<p class="lead-none">${esc(e.leadNote || '')}</p>`;
  const last = i === ERAS.length - 1;
  const built = MONUMENTS.filter((m) => m.year >= e.start && (m.year < e.end || (last && m.year === e.end)) && m.id !== e.lead).sort((a, b) => a.year - b.year);
  $('c-built-wrap').hidden = !built.length;
  $('c-built-title').textContent = `Also built in this era (${built.length})`;
  $('c-built').innerHTML = built.map((m) => `<li><a href="${MONUMENTS_SITE}/#${m.id}">${esc(m.name)}</a> <span>${esc(m.built)}</span></li>`).join('');
  const battles = BATTLES.filter((b) => b.year >= e.start && b.year <= e.end);
  $('c-battles-wrap').hidden = !battles.length;
  $('c-battles').innerHTML = battles.map((b) => `<li><a href="#battle/${b.id}">${esc(b.name)}</a> <span>${b.c ? 'c. ' : ''}${esc(formatYear(b.year))}</span></li>`).join('');
  const art = ART.filter((a) => a.start < e.end && a.end >= e.start).sort((a, b) => a.start - b.start);
  $('c-art-wrap').hidden = !art.length;
  $('c-art').innerHTML = art.map((a) => artItem(a)).join('');
  $('tl-card').scrollTop = 0;
}

// Who ruled in the chosen year, region by region.
function drawRuling(year) {
  const ds = reigningAt(year);
  $('c-ruling-wrap').hidden = !ds.length;
  $('c-ruling-title').textContent = `Ruling in ${formatYear(year)}`;
  $('c-ruling').innerHTML = ds.map((d) => {
    const r = rulerAt(d, year);
    const lane = LANES.find((l) => l.id === d.lane).name;
    return `<li><span class="lane-tag">${esc(lane)}</span><span><a href="#dynasty/${d.id}">${esc(d.name)}</a>${r ? ` · <a href="#ruler/${r.id}">${esc(r.name)}</a>` : ''}</span></li>`;
  }).join('');
}

// The note under the era's history says what the map shows, and which other maps the era has.
let shownNote;
function drawMapNote(era, map) {
  if (map === shownNote && map) return;
  shownNote = map;
  const maps = mapsOf(era);
  const others = maps.length > 1
    ? ` <span class="more">This era has ${maps.length} maps: ${maps.map((m) => `<a href="#${m.from ?? era.start}"${m === map ? ' aria-current="true"' : ''}>${m.from ?? era.start}</a>`).join(', ')}. Move the slider to change map.</span>`
    : '';
  $('c-map').innerHTML = map
    ? `<strong>${esc(map.title)}.</strong> ${esc(map.certainty)}${others} <a class="src-link" href="#sources">All sources →</a>`
    : '<strong>Borders for this era are not drawn yet.</strong> The dashed line is India’s boundary today, for reference.';
}

/* ---------- detail cards: rulers, dynasties, styles, battles, glossary ---------- */
const detail = $('c-detail'), eraCard = $('c-era');
const back = () => `<a class="back" href="#${current.year}">← Back to ${esc(ERAS[eraAt(+range.value)].name)}, ${esc(formatYear(current.year))}</a>`;
const builtList = (ids) => {
  const ms = ids.map((id) => byId.get(id)).filter(Boolean).sort((a, b) => a.year - b.year);
  return ms.length ? `<div class="thumbs">${ms.map(thumb).join('')}</div>` : '';
};
const capitalsText = (d) => d.capitals.map(([n, , , from, to]) => `${esc(n)}${from != null ? ` <span class="muted">(${esc(spanText(from, to))})</span>` : ''}`).join(', ');
const termGrid = (terms) => `<div class="terms">${terms.map((t) => `<div class="term${t.img ? '' : ' text-only'}" id="term-${t.id}">${t.img ? `<img src="${MONUMENTS_SITE}/img/${t.img}.jpg" alt="" loading="lazy">` : ''}<p><strong>${esc(t.name)}</strong> ${esc(t.def)}</p></div>`).join('')}</div>`;

const CARDS = {
  ruler(r) {
    const d = r.dynasty;
    const others = d.rulers.filter((o) => o !== r);
    return `${back()}<p class="eyebrow">Ruler · <a href="#dynasty/${d.id}">${esc(d.name)}</a></p>
      <h2>${esc(r.name)}</h2><p class="span">Reigned ${esc(spanText(r.start, r.end, r.c))}</p>
      <p>${esc(r.note)}</p>
      ${(r.built || []).length ? `<h3>Built in this reign</h3>${builtList(r.built)}` : ''}
      ${others.length ? `<h3>Other rulers of the ${esc(d.name)}</h3><ul class="built">${others.map((o) => `<li><a href="#ruler/${o.id}">${esc(o.name)}</a> <span>${esc(spanText(o.start, o.end, o.c))}</span></li>`).join('')}</ul>` : ''}`;
  },
  dynasty(d) {
    const lane = LANES.find((l) => l.id === d.lane);
    const built = [...new Set([...(d.built || []), ...d.rulers.flatMap((r) => r.built || [])])];
    const battles = BATTLES.filter((b) => (b.dynasties || []).includes(d.id));
    return `${back()}<p class="eyebrow">Dynasty · ${esc(lane.name)}</p>
      <h2>${esc(d.name)}</h2><p class="span">${esc(spanText(d.start, d.end, d.c))}</p>
      <p>${esc(d.summary)}</p>
      <h3>Capital${d.capitals.length > 1 ? 's' : ''}</h3><p>${capitalsText(d)}</p>
      <h3>Rulers</h3><ul class="built">${d.rulers.map((r) => `<li><a href="#ruler/${r.id}">${esc(r.name)}</a> <span>${esc(spanText(r.start, r.end, r.c))}</span></li>`).join('')}</ul>
      ${built.length ? `<h3>Monuments of the dynasty</h3>${builtList(built)}` : ''}
      ${battles.length ? `<h3>Battles</h3><ul class="built">${battles.map((b) => `<li><a href="#battle/${b.id}">${esc(b.name)}</a> <span>${esc(formatYear(b.year))}</span></li>`).join('')}</ul>` : ''}
      ${artOf('dynasties', d.id).length ? `<h3>Art under the ${esc(d.name)}</h3>${artList(artOf('dynasties', d.id))}` : ''}`;
  },
  battle(b) {
    return `${back()}<p class="eyebrow">Battle</p>
      <h2>${esc(b.name)}</h2><p class="span">${b.c ? 'c. ' : ''}${esc(formatYear(b.year))}</p>
      <h3>Who fought</h3><p>${esc(b.sides)}</p>
      <h3>What it decided</h3><p>${esc(b.result)}</p>
      ${(b.dynasties || []).length ? `<h3>Dynasties</h3><p>${b.dynasties.map((id) => `<a href="#dynasty/${id}">${esc(dynastyById.get(id).name)}</a>`).join(', ')}</p>` : ''}`;
  },
  style(s) {
    const fam = FAMILIES.find((f) => f.id === s.family);
    const kin = STYLES.filter((o) => o.family === s.family && o !== s);
    return `${back()}<p class="eyebrow">Architecture · ${esc(fam.name)}</p>
      <h2>${esc(s.name)}</h2><p class="span">${esc(spanText(s.start, s.end))}</p>
      <p>${esc(s.summary)}</p><p class="muted">${esc(s.region)}</p>
      <p class="filter-note">The map shows only this style’s monuments. <button type="button" class="linkish" data-clear-style>Show all</button></p>
      ${s.terms.length ? `<h3>What to look for</h3>${termGrid(s.terms.map((t) => termById.get(t)))}` : ''}
      <h3>Monuments (${s.monuments.length})</h3>${builtList(s.monuments)}
      ${artOf('styles', s.id).length ? `<h3>Sculpture and painting of the same world</h3>${artList(artOf('styles', s.id))}` : ''}
      ${kin.length ? `<h3>Related styles</h3><p>${kin.map((o) => `<a href="#style/${o.id}">${esc(o.name)}</a>`).join(', ')}</p>` : ''}`;
  },
  art(a) {
    const kind = ART_KINDS.find((k) => k.id === a.kind);
    const kin = ART.filter((o) => o !== a && o.start < a.end && o.end > a.start).sort((p, q) => p.start - q.start);
    const work = (w) => `<li class="work">${w.img ? `<figure><img src="${esc(w.img)}" alt="${esc(w.name)}" loading="lazy"><figcaption>${esc(w.credit)} · ${esc(w.licence)}</figcaption></figure>` : ''}
      <p><strong>${esc(w.name)}</strong> <span class="muted">${esc(w.date)}</span></p><p class="muted">${esc(w.where)}</p></li>`;
    return `${back()}<p class="eyebrow">Art · ${esc(kind.name)}</p>
      <h2>${esc(a.name)}</h2><p class="span">${esc(spanText(a.start, a.end, a.c))}</p>
      <p>${esc(a.summary)}</p><p class="muted">${esc(a.region)}</p>
      <h3>What to look for</h3><p>${esc(a.look)}</p>
      <h3>Centres</h3><p>${a.centres.map(([n]) => esc(n)).join(', ')}</p>
      <h3>Works</h3><ul class="works">${a.works.map(work).join('')}</ul>
      ${(a.dynasties || []).length ? `<h3>Patrons</h3><p>${a.dynasties.map((id) => `<a href="#dynasty/${id}">${esc(dynastyById.get(id).name)}</a>`).join(', ')}</p>` : ''}
      ${(a.styles || []).length ? `<h3>Architecture of the same world</h3><p>${a.styles.map((id) => `<a href="#style/${id}">${esc(styleById.get(id).name)}</a>`).join(', ')}</p>` : ''}
      ${(a.monuments || []).length ? `<h3>Monuments</h3>${builtList(a.monuments)}` : ''}
      ${kin.length ? `<h3>At work at the same time</h3>${artList(kin)}` : ''}`;
  },
};
CARDS.monument = (m) => {
  const st = styleOf(m.id), by = builder.get(m.id);
  return `${back()}<p class="eyebrow">Monument · ${esc(TYPES[m.type])}</p>
    <h2>${esc(m.name)}</h2><p class="span">${esc(m.built)}</p><p class="muted">${esc(m.place)}</p>
    <a class="lead" href="${MONUMENTS_SITE}/#${m.id}"><img src="${MONUMENTS_SITE}/assets/views/${m.id}.png" alt="" width="800" height="450" loading="lazy"><span class="lead-text"><span class="go">Open the 3D model →</span></span></a>
    ${st ? `<h3>Style</h3><p><a href="#style/${st.id}">${esc(st.name)}</a></p>` : ''}
    ${by ? `<h3>Built under</h3><p>${by.ruler ? `<a href="#ruler/${by.ruler.id}">${esc(by.ruler.name)}</a>, ` : ''}<a href="#dynasty/${by.dynasty.id}">${esc(by.dynasty.name)}</a></p>` : ''}`;
};
const srcItem = (it) => `<li class="source"><p>${esc(it.cite)}${it.url ? ` <a href="${it.url}" rel="noopener" target="_blank">Link</a>` : ''}</p>
  ${it.terms ? `<p class="muted">${esc(it.terms)}</p>` : ''}${it.use ? `<p>${esc(it.use)}</p>` : ''}
  ${(it.at || []).length ? `<p class="src-at">Seen at ${it.at.map(([h, t]) => `<a href="#${h}">${esc(t)}</a>`).join(', ')}</p>` : ''}</li>`;
const PAGES = {
  styles: () => `${back()}<p class="eyebrow">Architecture</p><h2>Styles</h2>
    <p>Every monument on the map belongs to one style. A style opens with what to look for and its monuments, and the map then shows only those. See also the <a href="#glossary">glossary</a> of building parts.</p>
    ${FAMILIES.map((f) => `<h3>${esc(f.name)}</h3><ul class="built">${STYLES.filter((s) => s.family === f.id).map((s) => `<li><a href="#style/${s.id}">${esc(s.name)}</a> <span>${esc(spanText(s.start, s.end))} · ${s.monuments.length}</span></li>`).join('')}</ul>`).join('')}`,
  art: () => `${back()}<p class="eyebrow">Art</p><h2>Sculpture and painting</h2>
    <p>${ART.length} schools of Indian art, from the Indus seals to the Progressive Artists of 1947. Each opens with what to look for, its centres and some of its best-known works and where to see them. Switch on the <strong>Art</strong> layer to see the centres at work in the chosen year.</p>
    ${ART_KINDS.map((k) => `<h3>${esc(k.name)}</h3>${artList(ART.filter((a) => a.kind === k.id).sort((p, q) => p.start - q.start), false)}`).join('')}`,
  sources: () => `${back()}<p class="eyebrow">About the atlas</p><h2>Sources</h2>
    <p>Every border on the atlas is approximate, and each map’s note says how it was drawn and how sure it is. These are the works it rests on.</p>
    ${SOURCES.map((g) => `<h3>${esc(g.group)}</h3>${g.note ? `<p class="muted">${esc(g.note)}</p>` : ''}<ul class="sources">${g.items.map(srcItem).join('')}</ul>`).join('')}
    <h3>Not yet consulted</h3><ul class="sources">${NOT_YET.map((t) => `<li class="source"><p>${esc(t)}</p></li>`).join('')}</ul>
    <h3>Found a mistake?</h3><p>Tell us in the atlas’s <a href="${ISSUES}" rel="noopener" target="_blank">issue tracker</a>, with the source that says otherwise.</p>`,
  glossary: () => `${back()}<p class="eyebrow">Architecture</p><h2>Glossary</h2>
    <p>The parts of a building that tell the styles apart. The pictures are from the 3D models of the <a href="${MONUMENTS_SITE}">monuments site</a>.</p>
    ${termGrid(TERMS)}`,
};

const narrow = matchMedia('(max-width: 900px)');
function openDetail(html) {
  detail.innerHTML = html;
  detail.hidden = false;
  eraCard.hidden = true;
  $('tl-card').scrollTop = 0;
  // On a phone the card sits below the map: bring it into view.
  if (narrow.matches) detail.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
function closeDetail() {
  detail.hidden = true;
  eraCard.hidden = false;
}

function setStyleFilter(id) {
  styleFilter = id;
  const f = $('tl-filter');
  f.hidden = !id;
  f.innerHTML = id ? `Only <a href="#style/${id}">${esc(styleById.get(id).name)}</a> <button type="button" class="linkish" aria-label="Show all monuments">✕</button>` : '';
  const note = detail.querySelector('.filter-note');
  if (note) note.hidden = !id;
  render();
}
detail.addEventListener('click', (ev) => { if (ev.target.closest('[data-clear-style]')) setStyleFilter(null); });
$('tl-filter').addEventListener('click', (ev) => { if (ev.target.closest('button')) setStyleFilter(null); });

/* ---------- the slider ---------- */
const range = $('tl-range'), bands = $('tl-bands');
range.max = MAX;
bands.innerHTML = ERAS.map((e, i) => `<button type="button" class="band" data-i="${i}" title="${esc(e.name)}, ${esc(e.span)}"><span>${esc(e.short)}</span></button>`).join('');
const bandEls = [...bands.children];

const current = { year: -250, focus: null };
function render() {
  const i = eraAt(+range.value), era = ERAS[i], year = current.year;
  const map = mapAt(era, year);
  if (layers.borders) drawMap(map);
  else { shownMap = undefined; fillsG.replaceChildren(); labelsG.replaceChildren(); keyG.hidden = true; todayPath.style.display = ''; }
  drawMapNote(era, map);
  const standing = drawPins(year, era);
  drawCapitals(year);
  drawBattles(year, era, current.focus);
  drawArt(year, current.focus);
  $('tl-standing').textContent = `${standing === 1 ? '1 monument' : `${standing} monuments`} standing${styleFilter ? `, ${styleById.get(styleFilter).name}` : ''}`;
  drawChart(era, year);
}

function show(pos, { url = true, exact, keep = false, focus = null } = {}) {
  pos = Math.max(0, Math.min(MAX, Math.round(pos)));
  if (+range.value !== pos) range.value = pos;
  // `exact` is a year asked for by address: shown as given, where the slider's step would round it.
  const i = eraAt(pos), era = ERAS[i], year = exact ?? yearAt(pos);
  current.year = year;
  current.focus = focus;
  $('tl-year').textContent = formatYear(year);
  $('tl-era').textContent = era.name;
  range.setAttribute('aria-valuetext', `${formatYear(year)}, ${era.name}`);
  bandEls.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i); });
  drawCard(i);
  drawRuling(year);
  render();
  if (!keep) closeDetail();
  $('tl-prev').disabled = i === 0;
  $('tl-next').disabled = i === ERAS.length - 1;
  if (url) history.replaceState(null, '', `#${year}`);
}

// A band or the arrows open an era at its last year, so all of the era's monuments are on the map.
// The last era runs to this year, which is the very end of the slider.
const openEra = (i) => show(i === ERAS.length - 1 ? MAX : i * STEP + STEP - 1);

range.addEventListener('input', () => { stop(); pinFocus(null); show(+range.value); });
bands.addEventListener('click', (ev) => {
  const b = ev.target.closest('.band');
  if (b) { stop(); openEra(+b.dataset.i); }
});
$('tl-prev').addEventListener('click', () => { stop(); openEra(Math.max(0, eraAt(+range.value) - 1)); });
$('tl-next').addEventListener('click', () => { stop(); openEra(Math.min(ERAS.length - 1, eraAt(+range.value) + 1)); });

/* ---------- layer switches ---------- */
for (const box of document.querySelectorAll('[data-layer]')) {
  box.checked = layers[box.dataset.layer];
  box.addEventListener('change', () => {
    layers[box.dataset.layer] = box.checked;
    try { localStorage.setItem('atlas-layers', JSON.stringify(layers)); } catch (e) { /* private window */ }
    shownMap = undefined;
    render();
  });
}
// On a phone the layers start folded away.
if (narrow.matches) $('tl-layers').open = false;

/* ---------- play ---------- */
const playBtn = $('tl-play');
let timer = 0;
function stop() {
  if (!timer) return;
  clearInterval(timer);
  timer = 0;
  playBtn.setAttribute('aria-pressed', 'false');
  playBtn.querySelector('.tl-label').textContent = 'Play';
}
playBtn.addEventListener('click', () => {
  if (timer) return stop();
  if (+range.value >= MAX) show(0);
  playBtn.setAttribute('aria-pressed', 'true');
  playBtn.querySelector('.tl-label').textContent = 'Pause';
  // With reduced motion, step an era at a time instead of sweeping through the years.
  const tick = reduceMotion
    ? () => { const i = eraAt(+range.value); if (i >= ERAS.length - 1) return stop(); openEra(i + 1); }
    : () => { const p = +range.value + 2; show(p); if (p >= MAX) stop(); };
  timer = setInterval(tick, reduceMotion ? 2500 : 60);
});

// A monument found by search: its pin is ringed until the year changes.
function pinFocus(id) {
  for (const p of pins) p.a.classList.toggle('found', p.m.id === id);
}

/* ---------- search ---------- */
const q = $('q'), qList = $('q-list');
const INDEX = buildIndex({ monuments: MONUMENTS, eras: ERAS, formatYear, spanText });
let results = [], sel = -1;
function drawResults() {
  const text = q.value.trim();
  const y = parseYear(text);
  results = search(INDEX, text);
  if (y != null) results.unshift({ kind: 'Year', label: formatYear(clampYear(y)), detail: ERAS[eraAt(posOf(y))].name, href: `#${clampYear(y)}` });
  sel = results.length ? 0 : -1;
  qList.innerHTML = results.length
    ? results.map((r, i) => `<li role="option" id="q-${i}" aria-selected="${i === sel}"><a href="${r.href}" tabindex="-1"><span class="q-kind">${esc(r.kind)}</span><span class="q-label">${esc(r.label)}</span><span class="q-detail">${esc(r.detail)}</span></a></li>`).join('')
    : (text ? '<li class="q-none">Nothing found. Try a ruler, a place, a style or a year such as 1605 or 250 BCE.</li>' : '');
  const open = !!text;
  qList.hidden = !open;
  q.setAttribute('aria-expanded', String(open && results.length > 0));
  q.setAttribute('aria-activedescendant', sel >= 0 ? `q-${sel}` : '');
}
function choose(i) {
  const r = results[i];
  if (!r) return;
  qList.hidden = true;
  q.setAttribute('aria-expanded', 'false');
  q.blur();
  if (location.hash === r.href) fromHash(); else location.hash = r.href;
}
q.addEventListener('input', drawResults);
q.addEventListener('focus', () => { if (q.value.trim()) drawResults(); });
q.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    if (!results.length) return;
    ev.preventDefault();
    sel = (sel + (ev.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
    [...qList.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
    q.setAttribute('aria-activedescendant', `q-${sel}`);
    qList.children[sel].scrollIntoView({ block: 'nearest' });
  } else if (ev.key === 'Enter') {
    ev.preventDefault();
    choose(sel);
  } else if (ev.key === 'Escape') {
    q.value = '';
    qList.hidden = true;
    q.setAttribute('aria-expanded', 'false');
  }
});
qList.addEventListener('mousedown', (ev) => {
  const li = ev.target.closest('li[role="option"]');
  if (!li) return;
  ev.preventDefault();
  choose(+li.id.slice(2));
});
q.addEventListener('blur', () => setTimeout(() => { qList.hidden = true; q.setAttribute('aria-expanded', 'false'); }, 120));
// "/" focuses the search, as on many sites.
addEventListener('keydown', (ev) => {
  if (ev.key === '/' && document.activeElement !== q && !/input|textarea|select/i.test(document.activeElement.tagName)) { ev.preventDefault(); q.focus(); }
});

/* ---------- addresses ---------- */
// #1605 opens that year; #ruler/akbar, #dynasty/chola, #battle/plassey and #art/pahari open the item at its year;
// #style/mughal filters the map to the style; #monument/taj-mahal opens a monument at its year;
// #term/jali opens the glossary at a term; #styles, #glossary, #art, #sources and #dynasties open those views.
// With no address the page opens on the Mauryas.
const at = (year, opts) => show(posOf(clampYear(year)), { url: false, exact: clampYear(year), keep: true, ...opts });
const dynastyYear = (d) => (current.year >= d.start && current.year <= d.end ? current.year : Math.round(d.start + Math.min(60, (d.end - d.start) / 2)));
function fromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  const [kind, id] = h.split('/');
  if (kind === 'ruler' && rulerById.has(id)) { const r = rulerById.get(id); at(r.start); return openDetail(CARDS.ruler(r)); }
  if (kind === 'dynasty' && dynastyById.has(id)) { const d = dynastyById.get(id); at(dynastyYear(d)); return openDetail(CARDS.dynasty(d)); }
  if (kind === 'battle' && battleById.has(id)) { const b = battleById.get(id); at(b.year, { focus: b.id }); return openDetail(CARDS.battle(b)); }
  if (kind === 'art' && artById.has(id)) {
    const a = artById.get(id);
    // Opening a school switches the art layer on, so its centres show.
    if (!layers.art) { layers.art = true; const box = document.querySelector('[data-layer="art"]'); if (box) box.checked = true; }
    at(current.year >= a.start && current.year <= a.end ? current.year : Math.round((a.start + a.end) / 2), { focus: a.id });
    return openDetail(CARDS.art(a));
  }
  if (kind === 'style' && styleById.has(id)) {
    const s = styleById.get(id);
    styleFilter = s.id;
    at(Math.min(s.end, NOW));
    openDetail(CARDS.style(s));
    return setStyleFilter(s.id);
  }
  if (kind === 'monument' && byId.has(id)) {
    const m = byId.get(id);
    at(m.year);
    pinFocus(m.id);
    return openDetail(CARDS.monument(m));
  }
  if (kind === 'term' && termById.has(id)) {
    at(current.year);
    openDetail(PAGES.glossary());
    const t = document.getElementById(`term-${id}`);
    if (t) { t.classList.add('lit'); t.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); }
    return;
  }
  if (kind === 'dynasties') { setChart(true); return at(current.year); }
  if (PAGES[kind]) { at(current.year); return openDetail(PAGES[kind]()); }
  const y = parseInt(h, 10);
  show(posOf(Number.isFinite(y) ? clampYear(y) : current.year), { url: Number.isFinite(y), exact: Number.isFinite(y) ? clampYear(y) : current.year });
}
addEventListener('hashchange', fromHash);
fromHash();
