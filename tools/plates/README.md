# Plates

Border snapshots traced from C. Joppen, *Historical Atlas of India* (Longmans, 1914; printed by
Justus Perthes, Gotha), which is in the public domain:
[archive.org/details/historicalatlaso00jopprich](https://archive.org/details/historicalatlaso00jopprich).

Each `<date>.json` holds one plate: where it is in the scan (`pages`), how its printed grid maps to
longitude and latitude (`rough`, `seam`, `conic`), and its polities as rings of `[lon, lat]`, in order.
An earlier polity keeps its border and a later one is cut by it, so a ring can be drawn wide where it
meets a neighbour already traced. `main` marks the main power (always coloured `a`) and `at` places a
label by hand. A polity in several pieces gives `rings` in place of `ring`.

| Plate | Joppen's map | Era on the atlas |
| --- | --- | --- |
| `1318.json` | 12, India in 1318 | Delhi Sultanate, from 1296 |
| `1398.json` | 13, India in 1398 | Delhi Sultanate, from 1390 |
| `1525.json` | 14, India in 1525 | Delhi Sultanate, from 1450 |
| `1751.json` | 23, India in 1751 | Marathas and the East India Company, from 1707 |
| `1795.json` | 27, India in 1795 | Marathas and the East India Company, from 1785 |

## Tracing a plate

1. `python3 tools/plates/scan.py <pdf> <first page> plate.png`: the plate, joined and north up.
2. Copy a plate JSON and set `pages`, `seam` (the row where the two pages meet) and `rough` (the pixel
   positions of the 5-degree lines, read off the scan by eye).
3. `python3 tools/plates/fit.py plate.png <date>.json`: fits the projection. The error should be
   about 1 px, and the scale (the last number) about 55 px per degree on both pages. If a page is
   far off, the first reading of its parallels missed the frame: set `rough.columns` to two x
   positions inside the frame, halfway between meridians (1318 needed this).
4. Trace each polity's border as a ring of `[lon, lat]` points, reading it off the plate with its
   grid. `check.py` draws a 1-degree grid and the rings over the scan; repeat until they follow
   Joppen's lines.
5. `python3 tools/build-timeline-map.py <natural-earth>` writes `data/plates/<date>.json`; add a map
   with `plate: '<date>'` to the era in `js/timeline-data.js`.

The tracing follows the plate to about 0.2–0.3° (20–30 km), and the plate is itself a school atlas of
1914: it is as good as the scholarship of its day, and the cards say so.
