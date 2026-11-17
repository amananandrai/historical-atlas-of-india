#!/usr/bin/env python3
"""Cuts one of Joppen's two-page plates out of the atlas scan, joined and turned north up.

  python3 tools/plates/scan.py <historicalatlaso00jopprich.pdf> <first page> <out.png>

The colour PDF is https://archive.org/download/historicalatlaso00jopprich/historicalatlaso00jopprich.pdf.
The plates are printed sideways across two pages; each plate's JSON names its pages. Needs pdftoppm and Pillow.
"""
import subprocess, sys, tempfile, os, glob
from PIL import Image
pdf, first, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['pdftoppm', '-r', '150', '-png', '-f', str(first), '-l', str(first + 1), pdf, os.path.join(tmp, 'p')], check=True)
    a, b = [Image.open(f) for f in sorted(glob.glob(os.path.join(tmp, 'p-*.png')))]
    s = Image.new('RGB', (a.width + b.width, max(a.height, b.height)), 'white')
    s.paste(a, (0, 0)); s.paste(b, (a.width, 0))
    s.rotate(-90, expand=True).save(out)
print('wrote', out)
