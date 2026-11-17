#!/usr/bin/env python3
"""Draws a plate's traced polities (after cutting) and a 1-degree grid back onto its scan, to compare
the tracing with the plate's own borders.

  python3 tools/plates/check.py <plate.json> <plate.png> <out.png>
"""
import json, sys, math
from PIL import Image, ImageDraw
from shapely.geometry import Polygon
from shapely.ops import unary_union
C = json.load(open(sys.argv[1])); img = Image.open(sys.argv[2]).convert('RGB'); out = sys.argv[3]
M = C['conic']; seam = C['seam']
def fwd(p, lon, lat):
    ax, ay, t80, k, r25, m = p; t = t80 + k * (lon - 80); r = r25 - m * (lat - 25)
    return ax + r * math.sin(t), ay + r * math.cos(t)
def px(lon, lat):
    x, y = fwd(M['top'], lon, lat)
    if y < seam: return x, y
    x, y = fwd(M['bottom'], lon, lat)
    return (x, y) if y >= seam else None
d = ImageDraw.Draw(img); taken = None
cols = [(220,0,0),(0,0,220),(0,140,0),(200,0,200),(0,150,150),(200,120,0)]
for i, p in enumerate(C['polities']):
    g = Polygon(p['ring']).buffer(0)
    if taken is not None: g = g.difference(taken)
    taken = g if taken is None else taken.union(Polygon(p['ring']).buffer(0))
    for q in getattr(g, 'geoms', [g]):
        if q.is_empty: continue
        # densify so the line follows the projection
        ring = q.exterior.segmentize(0.05).coords
        pts = [px(*c) for c in ring]
        seg = []
        for c in pts + [None]:
            if c is None:
                if len(seg) > 1: d.line(seg, fill=cols[i % len(cols)], width=3)
                seg = []
            else: seg.append(c)
    c = Polygon(p['ring']).representative_point(); q = px(c.x, c.y)
    if q: d.text(q, p['name'][:12], fill=(0, 0, 0))
for lon in range(60, 101):
    pts = [px(lon, la / 10) for la in range(30, 390)]
    seg = []
    for c in pts + [None]:
        if c is None:
            if len(seg) > 1: d.line(seg, fill=(120, 120, 120), width=1)
            seg = []
        else: seg.append(c)
for lat in range(3, 39):
    pts = [px(lo / 10, lat) for lo in range(600, 1000)]
    seg = []
    for c in pts + [None]:
        if c is None:
            if len(seg) > 1: d.line(seg, fill=(120, 120, 120), width=1)
            seg = []
        else: seg.append(c)
img.save(out); img.resize((img.width // 2, img.height // 2)).save(out.replace('.png', '-half.png'))
