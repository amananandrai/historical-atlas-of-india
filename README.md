# Historical Atlas of India

A map of the Indian subcontinent with a year slider, from the Indus cities to the Republic: who
held power in each era, where their borders ran, and which monuments stood by that year.

It began as the "India through time" page of
[Monuments of India](https://github.com/amananandrai/monuments-of-india) and is now its own site.
Every monument pin opens that monument's 3D model on the
[monuments site](https://monuments-of-india-nu.vercel.app).

## What it shows

- **Thirteen eras**, each with a short history: who held power, what changed on the map, and key dates.
- **A border map for every era.** Rival powers of the same date are drawn beside the main one:
  - the Harappan world and the lands of the Vedic texts
  - the Nandas and Alexander (c. 325 BCE)
  - the Mauryas (250 BCE)
  - the Kushans, Western Satraps and Satavahanas (c. 150)
  - the Guptas and Vakatakas (c. 400)
  - the struggle for Kannauj (c. 850)
  - the Delhi Sultanate (1236)
  - the Mughals and the Deccan sultanates (1605)
  - the Company, the Marathas and the Nizam (c. 1805)
- **Snapshots traced from Joppen's 1914 atlas:** India in 1525 (on the eve of Panipat), India
  in 1751 and India in 1795, each fitted to the plate's printed grid and traced to within about 20–30 km.
- **The provinces and princely states** of 1939 and of 15 August 1947.
- **The Republic in three maps**, which change as the slider moves: Republic Day 1950 (Part A, B,
  C and D states), after the States Reorganisation Act of 1956, and today's 28 states and 8 union
  territories.
- **A pin for every monument standing by the chosen year**, with its style and the ruler it was built under.
- **Rulers and dynasties:** 59 dynasties and 125 rulers, each with a card (reign, capitals, the
  monuments built in their time, their battles). The era card lists who ruled in the chosen year,
  region by region, and a **dynasty chart** shows every region's dynasties across the era.
- **Architecture styles:** 27 styles in 9 families, from stupas and Nagara temples to Mughal and
  Indo-Saracenic, each with what to look for and its monuments; opening a style shows only its
  monuments on the map. A **glossary** of 26 building parts is illustrated with the monuments
  site's 3D models.
- **Map layers** to switch on and off: borders, monuments, capitals and 24 battles.
- **Search** across rulers, dynasties, capitals, styles, glossary terms, battles, monuments, eras and
  years (`1605`, `250 BCE`); press `/` to start typing.
- **A sources page** (`#sources`) listing every map, inscription and history the atlas rests on, what
  each is used for and under what terms, with links to where it shows; each map's note links to it.
- **Direct links** to everything: a year (`#1605`), a ruler (`#ruler/akbar`), a dynasty
  (`#dynasty/chola`), a style (`#style/mughal`), a battle (`#battle/plassey`), a monument
  (`#monument/taj-mahal`), a glossary term (`#term/jali`), and the `#styles`, `#glossary`, `#sources`
  and `#dynasties` views.

## How it is built

A static site with no build step: `index.html`, `css/` and ES modules in `js/`.

| File | What it holds |
| --- | --- |
| `js/timeline-data.js` | The eras: their text, dates and what each map draws |
| `js/timeline.js` | The page: map, slider, era card, pins |
| `js/atlas/dynasties.js`, `styles.js`, `battles.js` | Rulers and dynasties, architecture styles and the glossary, battles |
| `js/atlas/sources.js`, `search.js` | The sources page, and the search index |
| `js/timeline-map.js` | Generated: land, rivers, every era's borders |
| `data/units/*.json` | Generated: the provinces and states of 1939, 1947, 1950, 1956 and today, fetched when needed |
| `data/plates/*.json` | Generated: the snapshots traced from Joppen's plates, fetched when needed |
| `tools/plates/` | The traced plates and the tools that fit and check them ([how](tools/plates/README.md)) |
| `js/monuments.js` | Generated: the monuments pinned on the map |
| `css/base.css`, `css/timeline.css` | The shared look (matching the monuments site) and the page layout |

The generated files are made by the scripts in [`tools/`](tools/README.md); `node tools/check-atlas.mjs`
checks the dynasties, styles and battles (dates, places and links).

## Sources

- **Borders before 1800:** drawn by eye after C. Collin Davies, *An Historical Atlas of the Indian
  Peninsula* (1949), and the evidence each era rests on (excavated sites, inscriptions, treaties).
  They were checked against C. Joppen, *Historical Atlas of India* (1914, public domain,
  [archive.org](https://archive.org/details/historicalatlaso00jopprich)). Each shape names its
  sources in `tools/build-timeline-map.py`, and each era's card says how certain its map is.
- **Princely states:** traced from plate 33 of Joppen's atlas, "The Indian Empire in 1914"
  (`tools/trace-princely-states.py`).
- **Provinces and states from 1939 on:** 2011 census districts by the
  [DataMeet India community](https://github.com/datameet/maps)
  ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), joined into the units of each date
  (`tools/build-state-maps.py`).
- **Land, rivers, and the borders of Pakistan, Bangladesh and Kashmir:**
  [Natural Earth](https://www.naturalearthdata.com) (public domain), India point of view.

## Deploying

Vercel serves the repository as it is: framework preset "Other", no build command, output
directory `.` (the root). Every push to `main` deploys.

## Roadmap

[ROADMAP.md](ROADMAP.md): rulers and dynasties, architecture and art styles, more border snapshots,
events and guided tours.

## Licence

Code: [MIT](LICENSE). Derived map data keeps its sources' terms: DataMeet's CC BY 4.0 asks for the
credit given above.
