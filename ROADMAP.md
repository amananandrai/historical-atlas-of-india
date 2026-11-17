# Roadmap

The rule for everything new: an item has a time (start, end) and a place (a point or an area), so it
appears on the map and moves with the slider.

| Phase | Work | Outcome | Status |
| --- | --- | --- | --- |
| 0. Foundation | One schema for every item (`id, kind, start, end, place/area, eras, sources, certainty`); a layer panel; border maps loaded per era instead of one large file; links such as `#ruler/akbar` and `#style/dravidian` | Room to grow without one huge file | Done: layers panel, links to every item, provinces and states loaded per date. One file per era for the older borders is still to do. |
| 1. Rulers and dynasties | About 40 dynasties and 80 rulers; a dynasty chart by region that scrolls with the slider; ruler cards with reign, capital, events and the monuments they built; a capitals layer | The biggest gain in usefulness | Done: 59 dynasties, 125 rulers, dynasty chart, capitals layer, monuments linked to their builders. |
| 2. Architecture styles | A family tree of styles (Nagara, Dravidian, Vesara, Indo-Islamic and their branches) with each style's span and home region; a glossary (shikhara, gopuram, mandapa, jali, chhatri…) illustrated with the monuments site's 3D parts; a style filter on the map | Reuses what the monuments site has | Done: 27 styles in 9 families, glossary of 26 parts, style filter. |
| 3. More borders | Trace more of Joppen's plates (1022, 1318, 1398, 1525, 1751, 1795, 1823, 1856) with the georeferencing in `tools/trace-princely-states.py`, made to read several polity colours | A snapshot every century or so | Started: 1525, 1751 and 1795 traced, with tools to fit and check a plate. 1022, 1318, 1398, 1823 and 1856 to do. |
| 4. Art | About 20 schools of sculpture and painting (Gandhara, Mathura, Chola bronzes, Mughal, Rajput, Pahari, Bengal School…) with their centres and works, using CC0 and public-domain images only | Art history beside political history | To do. |
| 5. Events and tours | Battles, travellers' routes, trade routes; three or four guided tours | The atlas reads as a story | Battles layer done (24 battles); travellers, trade routes and tours to do. |
| 6. Polish | Search, a two-year compare view, Hindi, a sources page | Ready to share widely | Search and the sources page done; compare view and Hindi to do. |
