#!/usr/bin/env python
"""Generate a schema-faithful PREVIEW fixture in output/ so the dashboard can be
seen fully populated without running the heavy SNAP pipeline.

Produces the exact artefacts backend.py exports:
  - betul_sugarcane_fields.geojson  (FeatureCollection, property `stress_level`)
  - legend.json                     ({"stress_levels": [{level, color}]})
  - metadata.json                   (aoi, bounds, scenes_used, acquisition_dates, generated_at)
  - betul_stress_map.png            (RdYlGn-style 5-class quick-look)

The geometry is SYNTHETIC farmland parcels over the Betul AOI with a coherent
moisture gradient; the only real values are the AOI bounds (config.yaml) and the
Sentinel-1 acquisition dates taken from the products in data/raw. No farmer
names, yields, or accuracy claims are fabricated. Running `python backend.py`
overwrites every file here with real results.
"""

import json
import math
import pathlib
import random

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "output"

# config.yaml aoi.bounds = west, south, east, north
W, S, E, N = 77.8440, 21.8200, 77.8940, 21.8700

STRESS_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"]
STRESS_COLORS = ["#00ff00", "#7fff00", "#ffff00", "#ff7f00", "#ff0000"]

# Real acquisition dates from data/raw SAFE granule names.
ACQ_DATES = ["2026-05-28", "2026-06-09", "2026-06-21"]


def build_parcels():
    """A jittered two-block farmland tessellation with a NW(dry)->SE(wet) gradient."""
    rng = random.Random(20260621)
    cols, rows = 7, 6
    # inner plotting area, inset from the AOI edge
    lon0, lon1 = W + 0.006, E - 0.006
    lat0, lat1 = S + 0.006, N - 0.006
    dx = (lon1 - lon0) / cols
    dy = (lat1 - lat0) / rows

    feats = []
    for r in range(rows):
        for c in range(cols):
            # carve a couple of gaps (roads / other crops) so it reads as real parcels
            if rng.random() < 0.16:
                continue
            jx = dx * rng.uniform(-0.10, 0.10)
            jy = dy * rng.uniform(-0.10, 0.10)
            x0 = lon0 + c * dx + dx * 0.06 + jx
            y0 = lat0 + r * dy + dy * 0.06 + jy
            x1 = lon0 + (c + 1) * dx - dx * 0.06 + jx
            y1 = lat0 + (r + 1) * dy - dy * 0.06 + jy
            # irregular quadrilateral: jitter each corner slightly
            def jit(px, py):
                return [px + dx * rng.uniform(-0.03, 0.03),
                        py + dy * rng.uniform(-0.03, 0.03)]
            ring = [jit(x0, y0), jit(x1, y0), jit(x1, y1), jit(x0, y1), jit(x0, y0)]
            ring = [[round(p[0], 7), round(p[1], 7)] for p in ring]
            ring[-1] = ring[0]

            # dryness rises toward the NW corner of the AOI (normalized gradient)
            gx = (x0 - lon0) / (lon1 - lon0)
            gy = (y0 - lat0) / (lat1 - lat0)
            dryness = (1 - gx) * 0.6 + gy * 0.4 + rng.uniform(-0.16, 0.16)
            dryness = min(0.999, max(0.0, dryness))
            level = STRESS_LEVELS[min(4, int(dryness * 5))]
            feats.append({
                "type": "Feature",
                "properties": {"stress_level": level},
                "geometry": {"type": "Polygon", "coordinates": [ring]},
            })
    return {"type": "FeatureCollection", "features": feats}


def write_png(fc):
    """Rasterize parcels onto a grid and imshow with the pinned 5-class ramp."""
    try:
        import numpy as np
        from matplotlib import cm, colors
        import matplotlib.path as mpath
        import matplotlib.pyplot as plt
    except Exception as exc:  # pragma: no cover - optional
        print(f"skip PNG ({exc})")
        return None
    cmap = colors.ListedColormap(STRESS_COLORS)
    px, py = 520, 460
    xs = np.linspace(W, E, px)
    ys = np.linspace(S, N, py)
    grid = np.full((py, px), np.nan)
    gx, gy = np.meshgrid(xs, ys)
    pts = np.column_stack([gx.ravel(), gy.ravel()])
    for i, f in enumerate(fc["features"]):
        ring = f["geometry"]["coordinates"][0]
        path = mpath.Path(ring)
        inside = path.contains_points(pts).reshape(py, px)
        val = STRESS_LEVELS.index(f["properties"]["stress_level"])
        grid[inside] = val
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.imshow(grid, origin="lower", extent=[W, E, S, N], cmap=cmap,
              vmin=-0.5, vmax=4.5, interpolation="nearest")
    ax.set_title("Betul Sugarcane Water-Stress (5 classes)")
    ax.set_axis_off()
    png = OUT / "betul_stress_map.png"
    fig.savefig(png, dpi=150, bbox_inches="tight")
    plt.close(fig)
    return png


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    fc = build_parcels()
    (OUT / "betul_sugarcane_fields.geojson").write_text(
        json.dumps(fc), encoding="utf-8")
    (OUT / "legend.json").write_text(json.dumps(
        {"stress_levels": [{"level": lv, "color": c}
                           for lv, c in zip(STRESS_LEVELS, STRESS_COLORS)]},
        indent=2), encoding="utf-8")
    (OUT / "metadata.json").write_text(json.dumps(
        {"aoi": "Betul", "bounds": [W, S, E, N],
         "scenes_used": len(ACQ_DATES), "acquisition_dates": ACQ_DATES,
         "generated_at": "2026-06-21T02:55:38Z",
         "preview_fixture": True},
        indent=2), encoding="utf-8")
    counts = {lv: 0 for lv in STRESS_LEVELS}
    for f in fc["features"]:
        counts[f["properties"]["stress_level"]] += 1
    png = write_png(fc)
    print(f"features: {len(fc['features'])}  counts: {counts}")
    print(f"png: {png.name if png else 'skipped'}")


if __name__ == "__main__":
    main()
