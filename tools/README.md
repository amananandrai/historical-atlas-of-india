# Tools

Scripts that generate the atlas's data. Their output is committed, so the site itself needs none of them.

| Script | What it makes |
| --- | --- |
| `node tools/sync-monuments.mjs [monuments checkout]` | `js/monuments.js`: the monuments pinned on the map, from the monuments site's `js/data.js` (from GitHub, or a local checkout). Run it when monuments are added there. |
| `python3 tools/trace-princely-states.py <scan.png> <natural-earth>` | `tools/data/princely-states-1914.geojson`: the princely states traced from plate 33 of Joppen's *Historical Atlas of India* (1914). How to get the scan is in the script. |
| `python3 tools/build-state-maps.py <datameet-districts> <natural-earth>` | `tools/data/state-snapshots.geojson`: the provinces and states of 1939, 1947 and every reorganisation of the Republic's states from 1950 to today, from the DataMeet 2011 districts (`Districts/Census_2011/2011_Dist.*`). |
| `tools/plates/scan.py`, `fit.py`, `check.py` | Cut a plate of Joppen's atlas from the scan, fit its printed grid, and draw a tracing back on it. See [plates/README.md](plates/README.md). |
| `python3 tools/build-timeline-map.py <natural-earth>` | `js/timeline-map.js`: land, rivers and every era's borders; `data/plates/<date>.json` from the traced plates in `tools/plates/`; and `data/units/<date>.json`: the two files above as shapes with label points, one file per date. |
| `node tools/check-atlas.mjs` | Checks `js/atlas/`: every date within its dynasty, every capital, battle and art centre on the map, every monument link real, every monument in exactly one style, and any picture of a work of art CC0 or public domain. Exits 1 on a problem. |

The Python scripts need shapely, plus pyshp for the districts and Pillow and numpy for the trace.
The Natural Earth folder holds `ne_50m_land`, `ne_50m_rivers_lake_centerlines`,
`ne_10m_admin_0_countries_ind` and `ne_10m_admin_1_states_provinces`, as GeoJSON from
https://github.com/nvkelso/natural-earth-vector/tree/master/geojson.
