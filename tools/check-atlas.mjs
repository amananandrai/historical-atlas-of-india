// Checks the atlas's data: dynasties and rulers, styles and glossary, battles. Exits 1 on a problem.
//   node tools/check-atlas.mjs
import { DYNASTIES, LANES } from '../js/atlas/dynasties.js';
import { STYLES, FAMILIES, TERMS } from '../js/atlas/styles.js';
import { BATTLES } from '../js/atlas/battles.js';
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

// Every "seen at" link of the sources page goes somewhere real.
const known = { ruler: new Set(DYNASTIES.flatMap((d) => d.rulers.map((r) => r.id))), dynasty: dynasties, style: new Set(STYLES.map((x) => x.id)), battle: new Set(BATTLES.map((x) => x.id)) };
let sourceCount = 0;
for (const g of SOURCES) for (const it of g.items) {
  sourceCount++;
  for (const [h] of it.at || []) {
    const [kind, id] = h.split('/');
    if (id ? !(known[kind] && known[kind].has(id)) : !(/^-?\d+$/.test(kind) || ['glossary', 'styles', 'sources', 'dynasties'].includes(kind))) bad(`source ${it.id}: bad link #${h}`);
  }
}

const rulers = DYNASTIES.reduce((n, d) => n + d.rulers.length, 0);
console.log(`${DYNASTIES.length} dynasties, ${rulers} rulers, ${STYLES.length} styles, ${TERMS.length} terms, ${BATTLES.length} battles, ${sourceCount} sources`);
if (problems.length) {
  console.log(problems.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}
console.log('all good');
