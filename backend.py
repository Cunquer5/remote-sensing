"""Betul sugarcane water-stress prototype.

Streams just the AOI window out of Sentinel-1 GRD on the public AWS bucket
(GDAL range reads: ~2 MB per scene, no bulk download, no credentials), places
it with the product's own geolocation grid, classifies the VV/VH intensity
ratio into 5 relative stress levels with K-means, and writes GeoJSON + PNG.

No SNAP: its radiometric calibration rejects 2026-era products and its
terrain model needs auxdata from step.esa.int, which is unreachable here.
See the ponytail notes below for what that costs.

Run: python backend.py          (checks: pytest tests/ -q)
"""

import json
import math
import pathlib
import re
import time
import urllib.request

import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.transform import from_bounds
from rasterio.windows import Window
from sklearn.cluster import KMeans

ROOT = pathlib.Path(__file__).parent


def _coerce(val):
    val = val.strip()
    if val.startswith("["):
        return [float(x) for x in re.findall(r"-?[\d.]+", val)]
    try:
        return int(val)
    except ValueError:
        pass
    try:
        return float(val)
    except ValueError:
        return val.strip('"\'')


def load_config(path=ROOT / "config.yaml"):
    """Minimal nested key: value reader; config.yaml is flat two-level on purpose."""
    cfg, section = {}, None
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        key, _, raw = line.partition(":")
        key, raw = key.strip(), raw.strip()
        if indent and section:
            cfg[section][key] = _coerce(raw)
        elif raw:
            cfg[key] = _coerce(raw)
            section = None
        else:
            section = key
            cfg[key] = {}
    return cfg


CFG = load_config()
BETUL_BBOX = tuple(CFG["aoi"]["bounds"])
SCENES = CFG.get("scenes", 3)
OUTPUT_DIR = ROOT / CFG.get("output_dir", "output")
LANDCOVER = CFG["paths"]["landcover"]
PIXEL_M = 10.0
STAC_SEARCH = "https://earth-search.aws.element84.com/v1/search"
BUCKET = "sentinel-s1-l1c"


def _https(href):
    """s3://bucket/key -> anonymous HTTPS URL."""
    return href.replace("s3://", "https://").replace(BUCKET + "/", BUCKET + ".s3.amazonaws.com/")


def find_scenes(bbox, count, lookback_days):
    """Newest dual-pol GRD scenes over bbox as {date, vv, vh, grid} URLs."""
    now = time.time()
    fmt = "%Y-%m-%dT%H:%M:%SZ"
    body = {
        "collections": ["sentinel-1-grd"],
        "bbox": list(bbox),
        "limit": count * 3,
        "datetime": (
            f"{time.strftime(fmt, time.gmtime(now - lookback_days * 86400))}/"
            f"{time.strftime(fmt, time.gmtime(now))}"
        ),
        "sort": [{"field": "properties.datetime", "direction": "desc"}],
    }
    req = urllib.request.Request(
        STAC_SEARCH,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
    )
    features = json.loads(urllib.request.urlopen(req, timeout=60).read())["features"]
    scenes = []
    for f in features:
        if "_1SDV_" not in f["id"]:
            continue
        vv = _https(f["assets"]["vv"]["href"])
        scenes.append({
            "date": f["properties"]["datetime"][:10],
            "vv": vv,
            "vh": _https(f["assets"]["vh"]["href"]),
            "grid": vv.replace("/measurement/iw-vv.tiff", "/annotation/iw-vv.xml"),
        })
        if len(scenes) == count:
            break
    return scenes


GRID_POINT = re.compile(
    r"<geolocationGridPoint>.*?<line>(\d+)</line>\s*<pixel>(\d+)</pixel>"
    r"\s*<latitude>([-\d.eE+]+)</latitude>\s*<longitude>([-\d.eE+]+)</longitude>",
    re.DOTALL,
)
FIT_DEGREE = 4
FIT_RADII = (0.35, 0.7, 1.5)
MIN_FIELD_M2 = 1000.0


def _terms(degree):
    out = []
    for t in range(degree + 1):
        for i in range(t + 1):
            out.append((i, t - i))
    return out


def _design(u, v, terms, radius):
    return np.column_stack([(u / radius) ** i * (v / radius) ** j for i, j in terms])


def grid_points(url):
    """(line, pixel, latitude, longitude) of the product geolocation grid."""
    xml = urllib.request.urlopen(url, timeout=60).read().decode("utf-8", "replace")
    found = GRID_POINT.findall(xml)
    if len(found) < 12:
        raise RuntimeError(f"Geolocation grid too sparse in {url}: {len(found)} points")
    a = np.array(found)
    return (a[:, 0].astype(int), a[:, 1].astype(int),
            a[:, 2].astype(float), a[:, 3].astype(float))


def fit_inverse(lines, pixels, lats, lons, bbox):
    """Least-squares (lon, lat) -> (pixel, line) plus its fit residual in metres."""
    west, south, east, north = bbox
    lon_c, lat_c = (west + east) / 2, (south + north) / 2
    u, v = lons - lon_c, lats - lat_c
    terms = _terms(FIT_DEGREE)
    for radius in FIT_RADII:
        sel = (np.abs(u) < radius) & (np.abs(v) < radius)
        if sel.sum() <= len(terms):
            continue
        A = _design(u[sel], v[sel], terms, radius)
        cx = np.linalg.lstsq(A, pixels[sel], rcond=None)[0]
        cy = np.linalg.lstsq(A, lines[sel], rcond=None)[0]
        pred = _design(u, v, terms, radius)
        err = np.hypot((pred @ cx - pixels) * PIXEL_M, (pred @ cy - lines) * PIXEL_M)
        return cx, cy, radius, float(np.sqrt(np.mean(err ** 2)))
    raise RuntimeError("Not enough geolocation grid points near the AOI.")


def map_to_pixels(cx, cy, lon, lat, lon_c, lat_c, radius):
    d = _design(lon - lon_c, lat - lat_c, _terms(FIT_DEGREE), radius)
    return d @ cx, d @ cy


def scene_grid(scene, bbox):
    """VV/VH intensity ratio over bbox, plus the output transform."""
    west, south, east, north = bbox
    lon_c, lat_c = (west + east) / 2, (south + north) / 2
    lines, pixels, lats, lons = grid_points(scene["grid"])
    cx, cy, radius, rms = fit_inverse(lines, pixels, lats, lons, bbox)

    nx = max(2, round((east - west) * 111320 * math.cos(math.radians(lat_c)) / PIXEL_M))
    ny = max(2, round((north - south) * 110540 / PIXEL_M))
    xs = west + np.arange(nx) * 0.5 + (east - west) / nx
    ys = south + np.arange(ny) * 0.5 + (north - south) / ny
    lon2d, lat2d = np.meshgrid(xs, ys)
    px, py = map_to_pixels(cx, cy, lon2d.ravel(), lat2d.ravel(), lon_c, lat_c, radius)
    px, py = np.round(px).astype(int), np.round(py).astype(int)

    with rasterio.open(scene["vv"]) as src:
        w, h = src.width, src.height
        col0 = int(np.clip(px.min() - 1, 0, w - 1))
        col1 = int(np.clip(px.max() + 2, 1, w))
        row0 = int(np.clip(py.min() - 1, 0, h - 1))
        row1 = int(np.clip(py.max() + 2, 1, h))
        window = Window(col0, row0, col1 - col0, row1 - row0)
        band = {"vv": src.read(1, window=window)}
    with rasterio.open(scene["vh"]) as src:
        band["vh"] = src.read(1, window=window)

    inside = (px >= col0) & (px < col1) & (py >= row0) & (py < row1)
    gather = np.where(inside, (py - row0) * (col1 - col0) + (px - col0), -1)

    def resample(arr):
        flat = np.ravel(np.where(arr > 0, arr.astype(float), np.nan))
        out = np.full(gather.shape, np.nan)
        ok = gather >= 0
        out[ok] = flat[gather[ok]]
        return out.reshape(lon2d.shape)

    vv, vh = resample(band["vv"]), resample(band["vh"])
    with np.errstate(invalid="ignore", divide="ignore"):
        ratio = vv / vh ** 2
    # ponytail: nearest-pixel gather on raw DNs (no radiometric calibration,
    # speckle filter, or terrain correction); add aLee+sigma0 only if the
    # ratio's cross-scene stability ever measurably matters.
    return ratio, from_bounds(west, south, east, north, nx, ny), rms


STRESS_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"]
STRESS_COLORS = ["#00ff00", "#7fff00", "#ffff00", "#ff7f00", "#ff0000"]


def stress_grid(scenes, bbox, landcover):
    """Median VV/VH ratio across scenes, optionally masked to cropland."""
    ratios, transforms, crs, rmss = [], [], "EPSG:4326", []
    for scene in scenes:
        ratio, transform, rms = scene_grid(scene, bbox)
        ratios.append(ratio)
        transforms.append(transform)
        rmss.append(rms)
    rms = sum(rmss) / len(rmss)
    with np.errstate(invalid="ignore"):
        ratio = np.nanmedian(np.stack(ratios), axis=0)
    lc = pathlib.Path(landcover)
    if lc.exists():
        mask = np.zeros(ratio.shape, dtype=np.int32)
        with rasterio.open(lc) as src:
            band = rasterio.warp.reproject(
                source=src.read(1),
                destination=mask,
                src_transform=src.transform,
                src_crs=src.crs,
                dst_transform=transforms[0],
                dst_crs=crs,
                resampling=rasterio.enums.Resampling.nearest,
            )
        band = mask
        # CGLS-LC100 cropland range; 40 <= class < 50 (mixed cane/wheat).
        ratio = np.where((band >= 40) & (band < 50), ratio, np.nan)
    return ratio, transforms[0], crs, rms


def classify_stress(ratio, n_clusters=5, sample=5000, seed=42):
    """K-means on sampled ratio pixels; labels ordered by ascending ratio.

    Higher VV/VH ratio = drier canopy = more stress, so clusters sorted by
    mean ratio map directly onto the five stress levels.
    """
    valid = np.argwhere(~np.isnan(ratio))
    if len(valid) < n_clusters:
        raise RuntimeError(f"Only {len(valid)} valid pixels; need >= {n_clusters}.")
    rng = np.random.default_rng(seed)
    idx = rng.permutation(len(valid))[:sample]
    sample_idx = valid[idx]
    values = ratio[tuple(sample_idx.T)].reshape(-1, 1)
    km = KMeans(n_clusters=n_clusters, random_state=seed, n_init="auto").fit(values)
    labels = np.full(ratio.shape, -1, dtype=np.int32)
    flat = ratio.ravel()
    ok = ~np.isnan(flat)
    labels.ravel()[ok] = km.predict(flat[ok].reshape(-1, 1))
    means = {
        c: float(ratio[labels == c].mean())
        for c in range(n_clusters)
        if (labels == c).any()
    }
    order = sorted(means, key=means.get)
    mapping = {cid: STRESS_LEVELS[i] for i, cid in enumerate(order)}
    return labels, mapping


def export(labels, cluster_to_stress, transform, crs, out_dir, acq_dates=(), geo_rms_m=None):
    out_dir.mkdir(parents=True, exist_ok=True)
    stresses, geoms = [], []
    for geom, val in shapes(labels, mask=labels >= 0, transform=transform):
        level = cluster_to_stress.get(int(val))
        if level is None:
            continue
        geoms.append(geom)
        stresses.append(level)
    gdf = gpd.GeoDataFrame(
        {"stress_level": stresses},
        geometry=gpd.GeoSeries.from_wkt([_geom_to_wkt(g) for g in geoms] if geoms else []),
        crs=crs,
    )
    if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs("EPSG:4326")
    gdf = gdf[gdf.to_crs("EPSG:3857").area >= MIN_FIELD_M2]
    geojson = out_dir / "betul_sugarcane_fields.geojson"
    gdf.to_file(geojson, driver="GeoJSON")

    (out_dir / "legend.json").write_text(
        json.dumps(
            {"stress_levels": [{"level": lv, "color": c}
                               for lv, c in zip(STRESS_LEVELS, STRESS_COLORS)]},
            indent=2,
        ),
        encoding="utf-8",
    )
    (out_dir / "metadata.json").write_text(
        json.dumps(
            {
                "aoi": CFG["aoi"].get("name", "Betul"),
                "bounds": list(BETUL_BBOX),
                "scenes_used": len(acq_dates),
                "acquisition_dates": list(acq_dates),
                "pixel_metres": PIXEL_M,
                "geolocation_rms_m": geo_rms_m,
                "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    png = out_dir / "betul_stress_map.png"
    plt.figure(figsize=(8, 6))
    plt.imshow(
        np.where(labels >= 0, labels, np.nan),
        cmap=plt.get_cmap("RdYlGn", 5),
        interpolation="nearest",
    )
    plt.title("Betul Sugarcane Water-Stress (5 classes)")
    plt.axis("off")
    plt.savefig(png, dpi=150, bbox_inches="tight")
    plt.close()
    return geojson, png


def _geom_to_wkt(geom):
    ring = geom["coordinates"][0]
    return "POLYGON ((" + ", ".join(f"{x:.9f} {y:.9f}" for x, y in ring) + "))"


def main():
    scenes = find_scenes(BETUL_BBOX, SCENES, 180)
    if not scenes:
        raise RuntimeError("No Sentinel-1 GRD scenes found in the lookback window.")
    ratio, transform, crs, rms = stress_grid(scenes, BETUL_BBOX, LANDCOVER)
    labels, mapping = classify_stress(ratio)
    geojson, png = export(
        labels, mapping, transform, crs, OUTPUT_DIR,
        acq_dates=sorted(s["date"] for s in scenes), geo_rms_m=round(rms, 1),
    )
    print(
        f"Done: {geojson} and {png} "
        f"({len(scenes)} scenes, geolocation RMS {rms:.1f} m, "
        f"{int((labels >= 0).sum())} classified pixels)"
    )


if __name__ == "__main__":
    main()
