#!/usr/bin/env python3
"""Fits a conic projection to each page of an upright plate scan from its printed graticule.

  python3 tools/plates/fit.py <plate.png> <plate.json>

A plate is printed across two pages, joined at `seam` (a row of the upright scan), and each page is
fitted on its own: x = ax + r sin t, y = ay + r cos t, with t = t80 + k (lon - 80) and
r = r25 - m (lat - 25). The fit starts from `rough` (the pixel positions of the 5-degree lines, read
off the scan by eye), finds the printed lines near them, and refines four times, dropping points that
fall on rivers or lettering. Where the scan has a wide margin, `rough.columns` gives two x positions
inside the frame and clear of the meridians for the first reading of the parallels. It prints the RMS error in pixels (1 px is about 2 km) and writes the
result into the plate's `conic`.
"""
import json, sys, math
import numpy as np
from PIL import Image
plate_file = sys.argv[2]
PLATE = json.load(open(plate_file))
img = np.asarray(Image.open(sys.argv[1]).convert('L')).astype(float)
R = PLATE['rough']; seam = PLATE['seam']
H, W = img.shape
def fwd(p, lon, lat):
    ax, ay, t80, k, r25, m = p; t = t80 + k * (lon - 80); r = r25 - m * (lat - 25)
    return ax + r * np.sin(t), ay + r * np.cos(t)
def dark_x(y, x0, w):
    row = img[y - 1:y + 2, int(x0) - w:int(x0) + w + 1].mean(0)
    base = np.median(img[y - 1:y + 2, max(0, int(x0) - 3 * w):int(x0) + 3 * w].ravel())
    i = int(np.argmin(row)); return int(x0) - w + i, base - row[i]
def dark_y(x, y0, w):
    col = img[int(y0) - w:int(y0) + w + 1, x - 1:x + 2].mean(1)
    base = np.median(img[max(0, int(y0) - 3 * w):int(y0) + 3 * w, x - 1:x + 2].ravel())
    i = int(np.argmin(col)); return int(y0) - w + i, base - col[i]
def rough_x(lon, y):
    xt, xb = R['top'][str(lon)], R['bottom'][str(lon)]
    return xt + (xb - xt) * (y - R['y_top']) / (R['y_bot'] - R['y_top'])
lons = list(map(int, R['top'])); lats = list(map(int, R['lat']))
model = {}
for page, (y0, y1) in {'top': (R['y_top'] + 10, seam - 12), 'bottom': (seam + 12, R['y_bot'] - 10)}.items():
    p = None
    for rnd in range(4):
        obs = []   # (kind, value, x, y)
        win = 14 if rnd == 0 else 6
        for lon in lons:
            for y in range(y0, y1, 8):
                if p is None: x0 = rough_x(lon, y)
                else:
                    # predicted x of the meridian at row y: solve along the meridian
                    ax, ay, t80, k, r25, m = p; t = t80 + k * (lon - 80)
                    if abs(math.cos(t)) < 1e-6: continue
                    x0 = ax + (y - ay) * math.tan(t)
                if not (20 < x0 < W - 20): continue
                x, d = dark_x(y, x0, win)
                if d > 25: obs.append(('lon', lon, x, y))
        if p is not None:
            for lat in lats:
                for lon10 in range(600, 1000, 4):
                    xx, yy = fwd(p, lon10 / 10, lat)
                    if not (40 < xx < W - 40 and y0 < yy < y1): continue
                    y, d = dark_y(int(xx), yy, 6)
                    if d > 25: obs.append(('lat', lat, int(xx), y))
        else:
            for lat in lats:
                yy = R['lat'][str(lat)]
                if not (y0 < yy < y1): continue
                # Two columns where the first pass reads the parallels: 150 px in from each side of
                # the scan, or the plate's own `columns` where those miss its frame.
                for x in R.get('columns', (150, W - 150)):
                    y, d = dark_y(x, yy, 45)
                    obs.append(('lat', lat, x, y))
        def resid(q, obs):
            ax, ay, t80, k, r25, m = q; out = []
            for kind, v, x, y in obs:
                dx, dy = x - ax, y - ay; r = math.hypot(dx, dy); t = math.atan2(dx, dy)
                out.append((t - (t80 + k * (v - 80))) * r if kind == 'lon' else r - (r25 - m * (v - 25)))
            return np.array(out)
        q = np.array(p if p is not None else [W / 2, -6000.0, 0.0, 0.0075, 6000 + R['lat']['25'] * 0 + (R['lat']['25'] + 6000), 55.0])
        if p is None: q[4] = R['lat']['25'] + 6000
        for it in range(30):
            r0 = resid(q, obs)
            if rnd > 0:   # drop outliers (rivers, coasts, letters)
                keep = np.abs(r0) < max(3.0, 3 * np.median(np.abs(r0)))
                obs = [o for o, k_ in zip(obs, keep) if k_]; r0 = r0[keep]
            J = np.zeros((len(r0), 6))
            for j in range(6):
                dq = np.zeros(6); dq[j] = 1e-6 * max(1, abs(q[j])); J[:, j] = (resid(q + dq, obs) - r0) / dq[j]
            step = np.linalg.lstsq(J, -r0, rcond=None)[0]; q = q + step
            if np.abs(step).max() < 1e-6: break
        p = q
        r = resid(p, obs)
        print(page, 'round', rnd, 'obs', len(obs), 'rms', round(float(np.sqrt((r ** 2).mean())), 2), 'p', np.round(p, 4).tolist())
    model[page] = list(map(float, p))
PLATE['conic'] = {k: [round(v, 4) for v in p] for k, p in model.items()}
json.dump(PLATE, open(plate_file, 'w'), indent=1)
print('wrote the fit to', plate_file)
