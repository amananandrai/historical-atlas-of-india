#!/usr/bin/env python3
"""Builds tools/data/state-snapshots.geojson: the provinces and states of India at five dates, for
the timeline page. tools/build-timeline-map.py turns it into map shapes and label points.

  1939       British provinces and princely states
  1947       15 August 1947: the provinces of the two dominions and the princely states
  1950       26 January 1950: Part A, B, C and D states of the Constitution
  1953       1 October 1953: Andhra State carved out of Madras
  1956       1 November 1956: states and union territories after the States Reorganisation Act
  1960 ...   every later change to the states: 1960, 1961, 1963, 1966, 1969, 1971, 1972, 1973, 1975,
             1987, 2000, 2007, 2011, 2014 and 2019
  today      28 states and 8 union territories (since January 2020)

Each shape is written once with the list of dates it belongs to (`snapshots`).

Each unit is a union of 2011 census districts, which follow the old boundaries closely, since most
districts were carried over whole from the provinces and states:
  DataMeet India community, Census 2011 district boundaries (CC BY 4.0),
  https://github.com/datameet/maps (Districts/Census_2011/2011_Dist.*)
Pakistan's provinces, Bangladesh's Sylhet division, and Kashmir beyond the Indian-administered
districts come from Natural Earth's admin-1 layer and its India point-of-view country layer (public
domain). Inside the 1939 and 1947 provinces, the patchwork of princely states comes from
tools/data/princely-states-1914.geojson (traced from Joppen's atlas by tools/trace-princely-states.py);
everything that is not a province is a state.

Known simplifications, from districts that straddle old lines: Charkhi Dadri (Jind state) and
Kalsia are left in the Punjab; Abu stays in Rajasthan; Kollegal stays in Mysore; Bhadrachalam
stays in Hyderabad; the Purulia and Islampur transfers of 1956 are shown only as Purulia.

  python3 tools/build-state-maps.py <DataMeet district folder> <Natural Earth folder>
"""
import json, os, sys
import shapefile
from shapely.geometry import shape, mapping, box
from shapely.ops import unary_union
from shapely.validation import make_valid

dm, ne = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'data', 'state-snapshots.geojson')

def clean(g):
    g = make_valid(g)
    if g.geom_type == 'GeometryCollection':
        g = unary_union([p for p in g.geoms if p.geom_type in ('Polygon', 'MultiPolygon')])
    return g.buffer(0)

# ---------- sources ----------
dist = {}
r = shapefile.Reader(os.path.join(dm, '2011_Dist'))
for sr in r.iterShapeRecords():
    st, name = sr.record['ST_NM'], sr.record['DISTRICT']
    g = clean(shape(sr.shape.__geo_interface__))
    key = (st, name)
    dist[key] = unary_union([dist[key], g]) if key in dist else g
states_2011 = sorted({st for st, _ in dist})

def D(st, *names):
    missing = [n for n in names if (st, n) not in dist]
    assert not missing, (st, missing)
    return unary_union([dist[(st, n)] for n in names])

def S(*sts):
    for st in sts:
        assert st in states_2011, st
    return unary_union([g for (st, _), g in dist.items() if st in sts])

def load(name):
    return json.load(open(os.path.join(ne, name)))['features']

adm1 = {(f['properties']['adm0_a3'], f['properties']['name']): clean(shape(f['geometry'])) for f in load('ne_10m_admin_1_states_provinces.geojson')
        if f['properties']['adm0_a3'] in ('IND', 'PAK', 'BGD')}
ind_pov = {f['properties']['ADM0_A3']: clean(shape(f['geometry'])) for f in load('ne_10m_admin_0_countries_ind.geojson')
           if f['properties']['ADM0_A3'] in ('IND', 'PAK', 'BGD')}
princely = clean(shape(json.load(open(os.path.join(here, 'data', 'princely-states-1914.geojson')))['features'][0]['geometry']))

# ---------- building blocks ----------
TELANGANA = D('Andhra Pradesh', 'Adilabad', 'Nizamabad', 'Karimnagar', 'Medak', 'Hyderabad', 'Rangareddy', 'Mahbubnagar',
              'Nalgonda', 'Warangal', 'Khammam')
ANDHRA = S('Andhra Pradesh').difference(TELANGANA)
MARATHWADA = D('Maharashtra', 'Aurangabad', 'Bid', 'Hingoli', 'Jalna', 'Latur', 'Nanded', 'Osmanabad', 'Parbhani')
VIDARBHA = D('Maharashtra', 'Akola', 'Amravati', 'Bhandara', 'Buldana', 'Chandrapur', 'Garhchiroli', 'Gondiya', 'Nagpur',
             'Wardha', 'Washim', 'Yavatmal')
HYD_KARNATAKA = D('Karnataka', 'Gulbarga', 'Yadgir', 'Bidar', 'Raichur', 'Koppal')
BOMBAY_KARNATAKA = D('Karnataka', 'Belgaum', 'Bijapur', 'Bagalkot', 'Dharwad', 'Gadag', 'Haveri', 'Uttara Kannada')
OLD_MYSORE = D('Karnataka', 'Bangalore', 'Bangalore Rural', 'Ramanagara', 'Chikkaballapura', 'Kolar', 'Tumkur', 'Chitradurga',
               'Davanagere', 'Shimoga', 'Chikmagalur', 'Hassan', 'Mandya', 'Mysore', 'Chamrajnagar')
MADRAS_KARNATAKA = D('Karnataka', 'Dakshina Kannada', 'Udupi', 'Bellary')
COORG = D('Karnataka', 'Kodagu')
MALABAR = D('Kerala', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad')
TRAVANCORE_COCHIN = S('Kerala').difference(MALABAR).union(D('Tamil Nadu', 'Kanniyakumari'))
SAURASHTRA = D('Gujarat', 'Amreli', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Porbandar', 'Rajkot', 'Surendranagar')
KUTCH = D('Gujarat', 'Kachchh')
CP_MP = D('Madhya Pradesh', 'Balaghat', 'Betul', 'Chhindwara', 'Damoh', 'Dindori', 'East Nimar', 'Burhanpur', 'Harda',
          'Hoshangabad', 'Jabalpur', 'Katni', 'Mandla', 'Narsimhapur', 'Sagar', 'Seoni')
MADHYA_BHARAT = D('Madhya Pradesh', 'Alirajpur', 'Ashoknagar', 'Barwani', 'Bhind', 'Dewas', 'Dhar', 'Guna', 'Gwalior', 'Indore',
                  'Jhabua', 'Mandsaur', 'Morena', 'Neemuch', 'Rajgarh', 'Ratlam', 'Shajapur', 'Sheopur', 'Shivpuri', 'Ujjain',
                  'Vidisha', 'West Nimar')
VINDHYA = D('Madhya Pradesh', 'Anuppur', 'Chhatarpur', 'Datia', 'Panna', 'Rewa', 'Satna', 'Shahdol', 'Sidhi', 'Singrauli',
            'Tikamgarh', 'Umaria')
BHOPAL = D('Madhya Pradesh', 'Bhopal', 'Raisen', 'Sehore')
PEPSU = D('Punjab', 'Patiala', 'Sangrur', 'Barnala', 'Bathinda', 'Mansa', 'Faridkot', 'Kapurthala', 'Fatehgarh Sahib').union(
        D('Haryana', 'Jind', 'Mahendragarh'))
PUNJAB_HILLS = D('Himachal Pradesh', 'Kangra', 'Kullu', 'Lahul & Spiti', 'Una', 'Hamirpur')     # to Himachal in 1966
HIMACHAL_1950 = D('Himachal Pradesh', 'Chamba', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Kinnaur')
BILASPUR = D('Himachal Pradesh', 'Bilaspur')
PURULIA = D('West Bengal', 'Puruliya')
AJMER = D('Rajasthan', 'Ajmer')
NORTHEAST = S('Assam', 'Meghalaya', 'Nagaland', 'Mizoram', 'Arunanchal Pradesh')
PORTUGUESE = S('Goa', 'Daman & Diu', 'Dadara & Nagar Havelli')
FRENCH = S('Puducherry')

# Jammu and Kashmir as India draws it: the Indian-administered districts, Azad Kashmir and
# Gilgit-Baltistan, and Aksai Chin (what India's outline holds beyond every other district).
jk_d = S('Jammu & Kashmir')
others = unary_union([g for (st, _), g in dist.items() if st != 'Jammu & Kashmir'])
aksai = ind_pov['IND'].difference(others.buffer(0.05)).difference(jk_d).intersection(box(77.5, 34.0, 80.6, 36.3))
KASHMIR = unary_union([jk_d, adm1[('PAK', 'Azad Kashmir')], adm1[('PAK', 'Northern Areas')], adm1[('IND', 'Jammu and Kashmir')],
                       adm1[('IND', 'Ladakh')], aksai]).buffer(0.01).buffer(-0.01)
LADAKH = KASHMIR.difference(unary_union([adm1[('IND', 'Jammu and Kashmir')], adm1[('PAK', 'Azad Kashmir')],
                                         D('Jammu & Kashmir', *[n for (st, n) in dist if st == 'Jammu & Kashmir' and n not in ('Leh (ladakh)', 'Kargil')])]))
JK_UT = KASHMIR.difference(LADAKH)

W_PUNJAB = unary_union([adm1[('PAK', 'Punjab')], adm1[('PAK', 'F.C.T.')]])
NWFP = unary_union([adm1[('PAK', 'K.P.')], adm1[('PAK', 'F.A.T.A.')]])
SIND = adm1[('PAK', 'Sind')]
BALUCHISTAN = adm1[('PAK', 'Baluchistan')]
SYLHET = adm1[('BGD', 'Sylhet')]
EAST_BENGAL = unary_union([g for (a, _), g in adm1.items() if a == 'BGD'])

# ---------- the provinces of British India ----------
PUNJAB_1947_IN = unary_union([S('Punjab', 'Haryana', 'Chandigarh'), PUNJAB_HILLS])
PROV_COMMON = {
    'Delhi': S('NCT of Delhi'),
    'United Provinces': S('Uttar Pradesh', 'Uttarakhand'),
    'Bihar': unary_union([S('Bihar', 'Jharkhand'), PURULIA]),
    'Orissa': S('Odisha'),
    'Central Provinces and Berar': unary_union([S('Chhattisgarh'), CP_MP, VIDARBHA]),
    'Bombay': unary_union([S('Gujarat'), S('Maharashtra').difference(MARATHWADA).difference(VIDARBHA), BOMBAY_KARNATAKA]),
    'Madras': unary_union([S('Tamil Nadu').difference(D('Tamil Nadu', 'Kanniyakumari')), ANDHRA, MALABAR, MADRAS_KARNATAKA,
                           S('Lakshadweep')]),
    'Ajmer-Merwara': AJMER,
    'Coorg': COORG,
    'Andaman and Nicobar': S('Andaman & Nicobar Island'),
}
PROV_1939 = dict(PROV_COMMON, **{
    'Punjab': unary_union([PUNJAB_1947_IN, W_PUNJAB]),
    'North-West Frontier': NWFP,
    'Sind': SIND,
    'Baluchistan': BALUCHISTAN,
    'Bengal': unary_union([S('West Bengal').difference(PURULIA), EAST_BENGAL.difference(SYLHET)]),
    'Assam': unary_union([NORTHEAST, SYLHET]),
})
PROV_1947_IN = dict(PROV_COMMON, **{
    'East Punjab': PUNJAB_1947_IN,
    'West Bengal': S('West Bengal').difference(PURULIA),
    'Assam': NORTHEAST,
})
PROV_1947_PK = {'West Punjab': W_PUNJAB, 'North-West Frontier': NWFP, 'Sind': SIND, 'Baluchistan': BALUCHISTAN,
                'East Bengal': EAST_BENGAL}

ALL_INDIA = unary_union([g for (st, _), g in dist.items()] + [KASHMIR])
RAJ = unary_union([ALL_INDIA.difference(PORTUGUESE).difference(FRENCH), W_PUNJAB, NWFP, SIND, BALUCHISTAN, EAST_BENGAL])

features = []
def add(snapshot, name, cls, geom, note=''):
    geom = geom.buffer(0)
    if geom.is_empty:
        return
    features.append({'type': 'Feature', 'properties': {'snapshot': snapshot, 'name': name, 'cls': cls, 'note': note},
                     'geometry': rounded(mapping(geom.simplify(0.015, preserve_topology=True)))})

def rounded(g):
    # Coordinates to 0.001 degrees (about 100 m), far finer than the page draws.
    def r(c):
        return [round(c[0], 3), round(c[1], 3)] if isinstance(c[0], float) else [r(x) for x in c]
    return {'type': g['type'], 'coordinates': r(g['coordinates'])}

def provinces_and_states(snapshot, provinces, pk=None):
    trimmed = {n: g.difference(princely) for n, g in provinces.items()}
    pk_trimmed = {n: g.difference(princely) for n, g in (pk or {}).items()}
    held = unary_union(list(trimmed.values()) + list(pk_trimmed.values()))
    for n, g in trimmed.items():
        add(snapshot, n, 'a', g, 'Province')
    for n, g in pk_trimmed.items():
        add(snapshot, n, 'c', g, 'Province of Pakistan')
    add(snapshot, 'Princely states', 'b', RAJ.difference(held).difference(S('Sikkim')) if snapshot == '1947' else RAJ.difference(held), 'Princely states')

provinces_and_states('1939', PROV_1939)
provinces_and_states('1947', PROV_1947_IN, PROV_1947_PK)

# ---------- 26 January 1950 ----------
P1950 = {
    'a': {
        'Assam': NORTHEAST, 'Bihar': unary_union([S('Bihar', 'Jharkhand'), PURULIA]),
        'Bombay': unary_union([S('Gujarat').difference(SAURASHTRA).difference(KUTCH),
                               S('Maharashtra').difference(MARATHWADA).difference(VIDARBHA), BOMBAY_KARNATAKA]),
        'Madhya Pradesh': unary_union([S('Chhattisgarh'), CP_MP, VIDARBHA]),
        'Madras': PROV_COMMON['Madras'], 'Orissa': S('Odisha'),
        'Punjab': PUNJAB_1947_IN.difference(PEPSU), 'Uttar Pradesh': S('Uttar Pradesh', 'Uttarakhand'),
        'West Bengal': S('West Bengal').difference(PURULIA),
    },
    'b': {
        'Hyderabad': unary_union([TELANGANA, MARATHWADA, HYD_KARNATAKA]), 'Jammu and Kashmir': KASHMIR,
        'Madhya Bharat': MADHYA_BHARAT, 'Mysore': OLD_MYSORE, 'PEPSU': PEPSU,
        'Rajasthan': S('Rajasthan').difference(AJMER), 'Saurashtra': SAURASHTRA, 'Travancore-Cochin': TRAVANCORE_COCHIN,
    },
    'c': {
        'Ajmer': AJMER, 'Bhopal': BHOPAL, 'Bilaspur': BILASPUR, 'Coorg': COORG, 'Delhi': S('NCT of Delhi'),
        'Himachal Pradesh': HIMACHAL_1950, 'Kutch': KUTCH, 'Manipur': S('Manipur'), 'Tripura': S('Tripura'),
        'Vindhya Pradesh': VINDHYA,
    },
    'd': {'Andaman and Nicobar': S('Andaman & Nicobar Island')},
}
PART = {'a': 'Part A state', 'b': 'Part B state', 'c': 'Part C state', 'd': 'Part D territory'}
for cls, units in P1950.items():
    for n, g in units.items():
        add('1950', n, cls, g, PART[cls])

# ---------- 1 October 1953: Andhra State ----------
BELLARY = D('Karnataka', 'Bellary')
P1953 = {cls: dict(units) for cls, units in P1950.items()}
P1953['a']['Madras'] = PROV_COMMON['Madras'].difference(ANDHRA).difference(BELLARY)
P1953['a']['Andhra'] = ANDHRA
P1953['b']['Mysore'] = OLD_MYSORE.union(BELLARY)
for cls, units in P1953.items():
    for n, g in units.items():
        add('1953', n, cls, g, PART[cls])

# ---------- 1 November 1956 onwards ----------
# Each date applies its changes to the one before: `states` and `uts` map a name to its shape.
# A name change keeps the shape; a split or merger gives new shapes.
REORGS = []
def snapshot(key, states, uts):
    REORGS.append(key)
    for n, g in states.items():
        add(key, n, 'a', g, 'State')
    for n, g in uts.items():
        add(key, n, 'c', g, 'Union territory')

states = {
    'Andhra Pradesh': S('Andhra Pradesh'), 'Assam': NORTHEAST, 'Bihar': S('Bihar', 'Jharkhand'),
    'Bombay': S('Gujarat', 'Maharashtra'), 'Jammu and Kashmir': KASHMIR, 'Kerala': S('Kerala'),
    'Madhya Pradesh': S('Madhya Pradesh', 'Chhattisgarh'), 'Madras': S('Tamil Nadu'), 'Mysore': S('Karnataka'),
    'Orissa': S('Odisha'), 'Punjab': PUNJAB_1947_IN, 'Rajasthan': S('Rajasthan'),
    'Uttar Pradesh': S('Uttar Pradesh', 'Uttarakhand'), 'West Bengal': S('West Bengal'),
}
uts = {
    'Delhi': S('NCT of Delhi'), 'Himachal Pradesh': unary_union([HIMACHAL_1950, BILASPUR]), 'Manipur': S('Manipur'),
    'Tripura': S('Tripura'), 'Andaman and Nicobar': S('Andaman & Nicobar Island'),
    'Laccadive, Minicoy and Amindivi Islands': S('Lakshadweep'),
    # Pondicherry passed to India in fact on 1 November 1954, in law in 1962.
    'Pondicherry': S('Puducherry'),
}
def rename(d, old, new):
    d[new] = d.pop(old)

snapshot('1956', states, uts)
# 1 May 1960: Bombay State is split.
del states['Bombay']; states['Gujarat'] = S('Gujarat'); states['Maharashtra'] = S('Maharashtra')
snapshot('1960', states, uts)
# 1961: Dadra and Nagar Haveli (August) and Goa, Daman and Diu (December) join India.
uts['Dadra and Nagar Haveli'] = S('Dadara & Nagar Havelli'); uts['Goa, Daman and Diu'] = S('Goa', 'Daman & Diu')
snapshot('1961', states, uts)
# 1 December 1963: Nagaland.
states['Nagaland'] = S('Nagaland'); states['Assam'] = NORTHEAST.difference(S('Nagaland'))
snapshot('1963', states, uts)
# 1 November 1966: the Punjab is reorganised.
states['Punjab'] = S('Punjab'); states['Haryana'] = S('Haryana')
uts['Chandigarh'] = S('Chandigarh'); uts['Himachal Pradesh'] = S('Himachal Pradesh')
snapshot('1966', states, uts)
# 14 January 1969: Madras State becomes Tamil Nadu.
rename(states, 'Madras', 'Tamil Nadu')
snapshot('1969', states, uts)
# 25 January 1971: Himachal Pradesh becomes a state.
states['Himachal Pradesh'] = uts.pop('Himachal Pradesh')
snapshot('1971', states, uts)
# 21 January 1972: the North-East is reorganised.
states['Manipur'] = uts.pop('Manipur'); states['Tripura'] = uts.pop('Tripura'); states['Meghalaya'] = S('Meghalaya')
states['Assam'] = S('Assam'); uts['Mizoram'] = S('Mizoram'); uts['Arunachal Pradesh'] = S('Arunanchal Pradesh')
snapshot('1972', states, uts)
# 1 November 1973: Mysore becomes Karnataka, and the Laccadives Lakshadweep.
rename(states, 'Mysore', 'Karnataka'); rename(uts, 'Laccadive, Minicoy and Amindivi Islands', 'Lakshadweep')
snapshot('1973', states, uts)
# 16 May 1975: Sikkim.
states['Sikkim'] = S('Sikkim')
snapshot('1975', states, uts)
# 1987: Mizoram and Arunachal Pradesh (February) and Goa (May) become states.
states['Mizoram'] = uts.pop('Mizoram'); states['Arunachal Pradesh'] = uts.pop('Arunachal Pradesh')
del uts['Goa, Daman and Diu']; states['Goa'] = S('Goa'); uts['Daman and Diu'] = S('Daman & Diu')
snapshot('1987', states, uts)
# November 2000: Chhattisgarh, Uttaranchal and Jharkhand.
states['Madhya Pradesh'] = S('Madhya Pradesh'); states['Chhattisgarh'] = S('Chhattisgarh')
states['Uttar Pradesh'] = S('Uttar Pradesh'); states['Uttaranchal'] = S('Uttarakhand')
states['Bihar'] = S('Bihar'); states['Jharkhand'] = S('Jharkhand')
snapshot('2000', states, uts)
# Pondicherry becomes Puducherry (October 2006) and Uttaranchal Uttarakhand (1 January 2007).
rename(uts, 'Pondicherry', 'Puducherry'); rename(states, 'Uttaranchal', 'Uttarakhand')
snapshot('2007', states, uts)
# 1 November 2011: Orissa becomes Odisha.
rename(states, 'Orissa', 'Odisha')
snapshot('2011', states, uts)
# 2 June 2014: Telangana.
states['Andhra Pradesh'] = ANDHRA; states['Telangana'] = TELANGANA
snapshot('2014', states, uts)
# 31 October 2019: Jammu and Kashmir becomes two union territories.
del states['Jammu and Kashmir']; uts['Jammu and Kashmir'] = JK_UT; uts['Ladakh'] = LADAKH
snapshot('2019', states, uts)
# 26 January 2020: Dadra and Nagar Haveli and Daman and Diu are merged.
uts['Dadra and Nagar Haveli and Daman and Diu'] = unary_union([uts.pop('Dadra and Nagar Haveli'), uts.pop('Daman and Diu')])
assert len(states) == 28 and len(uts) == 8, (len(states), len(uts))
snapshot('today', states, uts)

# Shapes repeat from date to date: write each once, with the dates it belongs to.
merged = {}
for f in features:
    p = f['properties']
    k = (p['name'], p['cls'], p['note'], json.dumps(f['geometry'], separators=(',', ':')))
    if k in merged:
        merged[k]['properties']['snapshots'].append(p['snapshot'])
    else:
        f['properties'] = {'snapshots': [p['snapshot']], 'name': p['name'], 'cls': p['cls'], 'note': p['note']}
        merged[k] = f
features = list(merged.values())

os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump({'type': 'FeatureCollection', 'features': features}, open(out, 'w'), separators=(',', ':'))
print('wrote', os.path.normpath(out), os.path.getsize(out), 'bytes;', len(features), 'shapes;',
      {s: sum(1 for f in features if s in f['properties']['snapshots']) for s in ['1939', '1947', '1950', '1953'] + REORGS})
