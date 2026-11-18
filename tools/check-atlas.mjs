// Checks the atlas's data: dynasties and rulers, styles and glossary, battles, schools of art, travellers, trade routes and tours. Exits 1 on a problem.
//   node tools/check-atlas.mjs
import { DYNASTIES, LANES } from '../js/atlas/dynasties.js';
import { STYLES, FAMILIES, TERMS } from '../js/atlas/styles.js';
import { BATTLES } from '../js/atlas/battles.js';
import { ART, ART_KINDS } from '../js/atlas/art.js';
import { TRAVELLERS, ROUTES } from '../js/atlas/routes.js';
import { TOURS } from '../js/atlas/tours.js';
import { SOURCES } from '../js/atlas/sources.js';
import { MONUMENTS } from '../js/monuments.js';

const problems = [];
const bad = (msg) => problems.push(msg);
const monuments = new Set(MONUMENTS.map((m) => m.id));
const year = new Date().getFullYear();
const inFrame = (lat, lng) => lat > 4 && lat < 40 && lng > 58 && lng < 100;

const ids = new Set();
const unique = (kind, id) => { if (ids.has(`${kind}:${id}`)) bad(`${kind} ${id} appears twice`); ids.add(`${kind}:${id}`); };
const lanes = new Set(LANES.map((l) => l.id));

for (const d of DYNASTIES) {
  unique('dynasty', d.id);
  if (!lanes.has(d.lane)) bad(`dynasty ${d.id}: unknown lane ${d.lane}`);
  if (!(d.start < d.end) || d.end > year) bad(`dynasty ${d.id}: span ${d.start}–${d.end}`);
  for (const [name, lat, lng, from = d.start, to = d.end] of d.capitals) {
    if (!inFrame(lat, lng)) bad(`dynasty ${d.id}: capital ${name} out of the map`);
    if (from < d.start || to > d.end || from > to) bad(`dynasty ${d.id}: capital ${name} ${from}–${to} outside ${d.start}–${d.end}`);
  }
  for (const id of d.built || []) if (!monuments.has(id)) bad(`dynasty ${d.id}: no monument ${id}`);
  for (const r of d.rulers) {
    unique('ruler', r.id);
    // Regents and rulers counted from before the dynasty's own start get 30 years of grace.
    if (r.start < d.start - 30 || r.end > d.end || r.start > r.end) bad(`ruler ${r.id}: ${r.start}–${r.end} outside ${d.id} ${d.start}–${d.end}`);
    for (const id of r.built || []) if (!monuments.has(id)) bad(`ruler ${r.id}: no monument ${id}`);
  }
}

const families = new Set(FAMILIES.map((f) => f.id));
const terms = new Set(TERMS.map((t) => t.id));
const styled = new Map();
for (const s of STYLES) {
  unique('style', s.id);
  if (!families.has(s.family)) bad(`style ${s.id}: unknown family ${s.family}`);
  for (const t of s.terms) if (!terms.has(t)) bad(`style ${s.id}: unknown term ${t}`);
  for (const id of s.monuments) {
    if (!monuments.has(id)) bad(`style ${s.id}: no monument ${id}`);
    if (styled.has(id)) bad(`monument ${id} is in both ${styled.get(id)} and ${s.id}`);
    styled.set(id, s.id);
  }
}
for (const m of MONUMENTS) if (!styled.has(m.id)) bad(`monument ${m.id} has no style`);

const dynasties = new Set(DYNASTIES.map((d) => d.id));
for (const b of BATTLES) {
  unique('battle', b.id);
  if (!inFrame(b.lat, b.lng)) bad(`battle ${b.id} out of the map`);
  for (const d of b.dynasties || []) if (!dynasties.has(d)) bad(`battle ${b.id}: unknown dynasty ${d}`);
}

// Schools of art: dates, centres, links, and pictures only under an open licence.
const kinds = new Set(ART_KINDS.map((k) => k.id));
const styleIds = new Set(STYLES.map((x) => x.id));
const OPEN = ['CC0', 'Public domain'];
for (const a of ART) {
  unique('art', a.id);
  if (!kinds.has(a.kind)) bad(`art ${a.id}: unknown kind ${a.kind}`);
  if (!(a.start < a.end) || a.end > year) bad(`art ${a.id}: span ${a.start}–${a.end}`);
  if (!a.centres.length) bad(`art ${a.id}: no centres`);
  for (const [name, lat, lng] of a.centres) if (!inFrame(lat, lng)) bad(`art ${a.id}: centre ${name} out of the map`);
  if (!a.works.length) bad(`art ${a.id}: no works`);
  for (const w of a.works) {
    if (!w.name || !w.date || !w.where) bad(`art ${a.id}: a work lacks its name, date or place`);
    if (w.img && !(OPEN.includes(w.licence) && w.credit && /^https:\/\//.test(w.img))) bad(`art ${a.id}: picture of “${w.name}” needs an https link, a credit and a CC0 or public-domain licence`);
  }
  for (const d of a.dynasties || []) if (!dynasties.has(d)) bad(`art ${a.id}: unknown dynasty ${d}`);
  for (const s of a.styles || []) if (!styleIds.has(s)) bad(`art ${a.id}: unknown style ${s}`);
  for (const m of a.monuments || []) if (!monuments.has(m)) bad(`art ${a.id}: no monument ${m}`);
}

// Travellers and trade routes: dates, places in the frame, links.
const placesOk = (what, pts) => {
  if (pts.length < 2) bad(`${what}: fewer than two places`);
  for (const [name, lat, lng] of pts) if (!inFrame(lat, lng)) bad(`${what}: ${name} out of the map`);
};
for (const t of TRAVELLERS) {
  unique('traveller', t.id);
  if (!(t.start <= t.end) || t.end > year) bad(`traveller ${t.id}: span ${t.start}–${t.end}`);
  if (!t.account || !t.summary || !t.from) bad(`traveller ${t.id}: lacks its account, summary or origin`);
  placesOk(`traveller ${t.id}`, t.stops);
  for (const d of t.dynasties || []) if (!dynasties.has(d)) bad(`traveller ${t.id}: unknown dynasty ${d}`);
}
for (const r of ROUTES) {
  unique('route', r.id);
  if (!['land', 'sea'].includes(r.kind)) bad(`route ${r.id}: kind ${r.kind}`);
  if (!(r.start < r.end) || r.end > year) bad(`route ${r.id}: span ${r.start}–${r.end}`);
  for (const p of r.paths) placesOk(`route ${r.id}`, p);
  for (const d of r.dynasties || []) if (!dynasties.has(d)) bad(`route ${r.id}: unknown dynasty ${d}`);
}

// Every "seen at" link of the sources page goes somewhere real.
const known = { ruler: new Set(DYNASTIES.flatMap((d) => d.rulers.map((r) => r.id))), dynasty: dynasties, style: new Set(STYLES.map((x) => x.id)), battle: new Set(BATTLES.map((x) => x.id)), art: new Set(ART.map((x) => x.id)), traveller: new Set(TRAVELLERS.map((x) => x.id)), route: new Set(ROUTES.map((x) => x.id)) };
let sourceCount = 0;
for (const g of SOURCES) for (const it of g.items) {
  sourceCount++;
  for (const [h] of it.at || []) {
    const [kind, id] = h.split('/');
    if (id ? !(known[kind] && known[kind].has(id)) : !(/^-?\d+$/.test(kind) || ['glossary', 'styles', 'art', 'tours', 'sources', 'dynasties'].includes(kind))) bad(`source ${it.id}: bad link #${h}`);
  }
}

// Tours: every step at a year on the slider, linked to something real, switching on real layers.
const LAYERS = ['borders', 'monuments', 'capitals', 'battles', 'art', 'travellers', 'trade'];
for (const t of TOURS) {
  unique('tour', t.id);
  if (t.steps.length < 3) bad(`tour ${t.id}: fewer than three steps`);
  t.steps.forEach((s, i) => {
    if (!(s.year >= -3300 && s.year <= year)) bad(`tour ${t.id} step ${i + 1}: year ${s.year}`);
    if (i && s.year < t.steps[i - 1].year) bad(`tour ${t.id} step ${i + 1}: goes back in time`);
    if (s.open) { const [k, id] = s.open.split('/'); if (!(known[k] && known[k].has(id))) bad(`tour ${t.id} step ${i + 1}: bad link #${s.open}`); }
    for (const l of s.layers || []) if (!LAYERS.includes(l)) bad(`tour ${t.id} step ${i + 1}: unknown layer ${l}`);
  });
}

const rulers = DYNASTIES.reduce((n, d) => n + d.rulers.length, 0);
console.log(`${DYNASTIES.length} dynasties, ${rulers} rulers, ${STYLES.length} styles, ${TERMS.length} terms, ${BATTLES.length} battles, ${ART.length} schools of art, ${TRAVELLERS.length} travellers, ${ROUTES.length} trade routes, ${TOURS.length} tours, ${sourceCount} sources`);
if (problems.length) {
  console.log(problems.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}
console.log('all good');
