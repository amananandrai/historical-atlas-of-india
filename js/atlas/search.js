// The atlas's search: one index of rulers, dynasties, capitals, styles, building parts, battles,
// schools of art and their works, travellers, trade routes, tours, monuments and eras, each with the address it opens. Years are understood too: "1605", "250 BCE",
// "250 bc", "-250".
import { DYNASTIES, RULERS } from './dynasties.js';
import { FAMILIES, STYLES, TERMS } from './styles.js';
import { BATTLES } from './battles.js';
import { ART } from './art.js';
import { TRAVELLERS, ROUTES } from './routes.js';
import { TOURS } from './tours.js';

// Lower case, without accents or punctuation, so "Rajendra" finds "Rājendra" and "Asoka" finds "Ashoka".
export const fold = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Common alternative spellings of Indian names.
const variants = (s) => [s, s.replace(/sh/g, 's'), s.replace(/ph/g, 'p'), s.replace(/aa/g, 'a'), s.replace(/w/g, 'v')];

export function buildIndex({ monuments, eras, formatYear, spanText }) {
  const items = [];
  const add = (kind, label, detail, href, extra = '') => {
    const keys = [...new Set(variants(fold(`${label} ${extra}`)))];
    items.push({ kind, label, detail, href, keys, name: fold(label) });
  };
  for (const d of DYNASTIES) add('Dynasty', d.name, spanText(d.start, d.end, d.c), `#dynasty/${d.id}`);
  for (const r of RULERS) add('Ruler', r.name, `${r.dynasty.name}, ${spanText(r.start, r.end, r.c)}`, `#ruler/${r.id}`);
  const capitals = new Map();
  for (const d of DYNASTIES) for (const [name] of d.capitals) {
    if (!capitals.has(name)) capitals.set(name, []);
    capitals.get(name).push(d);
  }
  for (const [name, ds] of capitals) {
    add('Capital', name, `of the ${ds.map((d) => d.name).join(', ')}`, `#dynasty/${ds[0].id}`);
  }
  for (const s of STYLES) add('Style', s.name, `${spanText(s.start, s.end)} · ${s.region}`, `#style/${s.id}`, FAMILIES.find((f) => f.id === s.family).name);
  for (const f of FAMILIES) add('Styles', f.name, STYLES.filter((s) => s.family === f.id).map((s) => s.name).join(', '), '#styles');
  for (const t of TERMS) add('Glossary', t.name, t.def, `#term/${t.id}`);
  for (const b of BATTLES) add('Battle', b.name, `${b.c ? 'c. ' : ''}${formatYear(b.year)} · ${b.sides}`, `#battle/${b.id}`);
  for (const a of ART) {
    add('Art', a.name, `${a.kind === 'sculpture' ? 'Sculpture' : 'Painting'}, ${spanText(a.start, a.end, a.c)} · ${a.region}`, `#art/${a.id}`, `${a.kind} ${a.centres.map(([n]) => n).join(' ')}`);
    for (const w of a.works) add('Artwork', w.name, `${a.name} · ${w.date} · ${w.where}`, `#art/${a.id}`);
  }
  add('Art', 'Sculpture and painting', `${ART.length} schools of Indian art`, '#art', 'art painting sculpture bronze');
  for (const t of TRAVELLERS) add('Traveller', t.name, `${t.from}, in India ${spanText(t.start, t.end, t.c)}`, `#traveller/${t.id}`, `${t.account} ${t.stops.map(([n]) => n).join(' ')}`);
  for (const r of ROUTES) add('Trade route', r.name, `${r.kind === 'sea' ? 'By sea' : 'By land'}, ${spanText(r.start, r.end, r.c)}`, `#route/${r.id}`, `trade ${r.goods} ${r.paths.flat().map(([n]) => n).join(' ')}`);
  for (const t of TOURS) add('Tour', t.name, t.summary, `#tour/${t.id}/1`, 'tour');
  add('Tours', 'Tours and journeys', 'Guided tours, travellers and trade routes', '#tours', 'tour travellers trade routes');
  for (const m of monuments) add('Monument', m.name, `${m.place} · ${m.built}`, `#monument/${m.id}`, m.place);
  for (const e of eras) add('Era', e.name, e.span, `#${Math.min(e.end, e.start + Math.round((e.end - e.start) * 0.6))}`, e.short);
  return items;
}

// A year typed as a number, with BCE/BC/CE/AD or a minus sign.
export function parseYear(q) {
  const raw = String(q).trim();
  if (/^-\d{1,4}$/.test(raw)) return parseInt(raw, 10);
  const m = fold(raw).match(/^(\d{1,4})\s*(bce|bc|ce|ad)?$/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  return m[2] === 'bce' || m[2] === 'bc' ? -y : y;
}

// Results for a query, best first: whole-name prefix, then a word prefix, then anywhere.
export function search(items, q, limit = 8) {
  const f = fold(q);
  if (!f) return [];
  const words = f.split(' ');
  const scored = [];
  for (const it of items) {
    let score = 0;
    for (const k of it.keys) {
      if (!words.every((w) => k.includes(w))) continue;
      let s = 1;
      if (it.name.startsWith(f) || k.startsWith(f)) s = 4;
      else if (words.every((w) => k.split(' ').some((kw) => kw.startsWith(w)))) s = 3;
      score = Math.max(score, s);
    }
    if (score) scored.push([score, it]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].label.length - b[1].label.length);
  return scored.slice(0, limit).map(([, it]) => it);
}
