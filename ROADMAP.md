# Roadmap

The rule for everything new: an item has a time (start, end) and a place (a point or an area), so it
appears on the map and moves with the slider.

| Phase | Work | Outcome | Status |
| --- | --- | --- | --- |
| 0. Foundation | One schema for every item (`id, kind, start, end, place/area, eras, sources, certainty`); a layer panel; border maps loaded per era instead of one large file; links such as `#ruler/akbar` and `#style/dravidian` | Room to grow without one huge file | Done: layers panel, links to every item, provinces and states loaded per date. One file per era for the older borders is still to do. |
| 1. Rulers and dynasties | About 40 dynasties and 80 rulers; a dynasty chart by region that scrolls with the slider; ruler cards with reign, capital, events and the monuments they built; a capitals layer | The biggest gain in usefulness | Done: 59 dynasties, 125 rulers, dynasty chart, capitals layer, monuments linked to their builders. |
| 2. Architecture styles | A family tree of styles (Nagara, Dravidian, Vesara, Indo-Islamic and their branches) with each style's span and home region; a glossary (shikhara, gopuram, mandapa, jali, chhatri…) illustrated with the monuments site's 3D parts; a style filter on the map | Reuses what the monuments site has | Done: 27 styles in 9 families, glossary of 26 parts, style filter. |
| 3. More borders | Trace more of Joppen's plates (1022, 1318, 1398, 1525, 1751, 1795, 1823, 1856) with the georeferencing in `tools/trace-princely-states.py`, made to read several polity colours | A snapshot every century or so | Done: 1022, 1318, 1398, 1525, 1751, 1795, 1823 and 1856 traced from Joppen, with tools to fit and check a plate. |
| 4. Art | About 20 schools of sculpture and painting (Gandhara, Mathura, Chola bronzes, Mughal, Rajput, Pahari, Bengal School…) with their centres and works, using CC0 and public-domain images only | Art history beside political history | Done: 26 schools (14 of sculpture, 12 of painting) with centres, works and where they are now, an art layer, and links to patrons, styles and monuments. Pictures of works still to add, each from a museum's CC0 or public-domain record (the checker refuses any other licence). |
| 5. Events and tours | Battles, travellers' routes, trade routes; three or four guided tours | The atlas reads as a story | Done: 24 battles, 11 travellers' journeys, 8 trade routes by land and sea, and 4 guided tours. |
| 6. Polish | Search, a two-year compare view, Hindi, a sources page | Ready to share widely | Search and the sources page done; compare view and Hindi to do. |
