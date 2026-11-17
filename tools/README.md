# Tools

Scripts that generate the atlas's data. Their output is committed, so the site itself needs none of them.

| Script | What it makes |
| --- | --- |
| `node tools/sync-monuments.mjs [monuments checkout]` | `js/monuments.js`: the monuments pinned on the map, from the monuments site's `js/data.js` (from GitHub, or a local checkout). Run it when monuments are added there. |
| `python3 tools/trace-princely-states.py <scan.png> <natural-earth>` | `tools/data/princely-states-1914.geojson`: the princely states traced from plate 33 of Joppen's *Historical Atlas of India* (1914). How to get the scan is in the script. |
| `python3 tools/build-state-maps.py <datameet-districts> <natural-earth>` | `tools/data/state-snapshots.geojson`: the provinces and states of 1939, 1947, 1950, 1956 and today, from the DataMeet 2011 districts (`Districts/Census_2011/2011_Dist.*`). |
| `python3 tools/build-timeline-map.py <natural-earth>` | `js/timeline-map.js`: land, rivers and every era's borders; and `data/units/<date>.json`: the two files above as shapes with label points, one file per date. |
| `node tools/check-atlas.mjs` | Checks `js/atlas/`: every date within its dynasty, every capital and battle on the map, every monument link real, and every monument in exactly one style. Exits 1 on a problem. |

The Python scripts need shapely, plus pyshp for the districts and Pillow and numpy for the trace.
The Natural Earth folder holds `ne_50m_land`, `ne_50m_rivers_lake_centerlines`,
`ne_10m_admin_0_countries_ind` and `ne_10m_admin_1_states_provinces`, as GeoJSON from
https://github.com/nvkelso/natural-earth-vector/tree/master/geojson.
