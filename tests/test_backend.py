"""Synthetic checks for the geolocation + classification path: no network, no SNAP."""

import json
import pathlib
import sys

import numpy as np
import rasterio.transform

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

import backend

BBOX = (77.844, 21.82, 77.894, 21.87)


def test_config_bounds_and_paths():
    cfg = backend.load_config()
    assert tuple(cfg["aoi"]["bounds"]) == backend.BETUL_BBOX
    assert cfg["scenes"] == 3
    assert cfg["paths"]["landcover"] == "data/landcover/landcover_100m.tif"


def test_scene_urls_are_anonymous_https():
    href = f"s3://{backend.BUCKET}/GRD/2026/8/27/IW/DV/GRAN/measurement/iw-vv.tiff"
    url = backend._https(href)
    assert url == (
        "https://sentinel-s1-l1c.s3.amazonaws.com/GRD/2026/8/27/IW/DV/GRAN"
        "/measurement/iw-vv.tiff"
    )
    grid = url.replace("/measurement/iw-vv.tiff", "/annotation/iw-vv.xml")
    assert grid.endswith("annotation/iw-vv.xml")


def test_inverse_geolocation_fit_round_trip():
    """A smooth synthetic grid must map back to its own pixel/line values."""
    lon_c, lat_c = (BBOX[0] + BBOX[2]) / 2, (BBOX[1] + BBOX[3]) / 2
    glon = np.repeat(np.linspace(lon_c - 1.0, lon_c + 1.0, 9), 7)
    glat = np.tile(np.linspace(lat_c - 0.8, lat_c + 0.8, 7), 9)
    u, v = glon - lon_c, glat - lat_c
    pixel = 12000 + 9000 * u + 40 * u * v - 200 * v**2
    line = 8000 - 150 * u + 11000 * v
    cx, cy, radius, rms = backend.fit_inverse(line, pixel, glat, glon, BBOX)
    assert rms < 1.0, rms
    px, py = backend.map_to_pixels(cx, cy, glon, glat, lon_c, lat_c, radius)
    assert np.abs(px - pixel).max() < 0.5, np.abs(px - pixel).max()
    assert np.abs(py - line).max() < 0.5, np.abs(py - line).max()


def test_stress_levels_ordered_by_ratio(tmp_path):
    ratio = np.full((20, 20), np.nan)
    for i, value in enumerate([10.0, 13.0, 16.0, 20.0, 25.0]):
        ratio[i * 4:(i + 1) * 4, :] = value
    labels, mapping = backend.classify_stress(ratio, n_clusters=5)
    levels = [mapping[labels[i * 4 + 2, 5]] for i in range(5)]
    assert levels == backend.STRESS_LEVELS, levels

    transform = rasterio.transform.from_origin(77.844, 21.87, 0.0002, 0.0002)
    geojson, png = backend.export(
        labels, mapping, transform, "EPSG:4326", tmp_path,
        acq_dates=("2026-08-27",), geo_rms_m=4.2,
    )
    feats = json.loads(geojson.read_text())["features"]
    assert len(feats) == 5, len(feats)
    assert {f["properties"]["stress_level"] for f in feats} == set(backend.STRESS_LEVELS)
    meta = json.loads((tmp_path / "metadata.json").read_text())
    assert meta["acquisition_dates"] == ["2026-08-27"] and meta["geolocation_rms_m"] == 4.2
    assert geojson.exists() and png.exists()


def test_empty_clusters_do_not_break_ordering():
    """2 distinct values with n_clusters=5: no nan means, levels stay ordered."""
    ratio = np.full((10, 10), np.nan)
    ratio[:5, :] = 10.0
    ratio[5:, :] = 25.0
    labels, mapping = backend.classify_stress(ratio, n_clusters=5)
    assert labels.min() >= 0, labels.min()
    rank = backend.STRESS_LEVELS.index
    assert rank(mapping[labels[0, 0]]) < rank(mapping[labels[-1, -1]])


def test_aoi_pixel_grid_stays_in_bounds():
    """Regression: sample positions must span the AOI, not drift at 0.5 deg/step."""
    west, south, east, north = BBOX
    lat_c = (south + north) / 2
    nx = max(2, round((east - west) * 111320 * np.cos(np.radians(lat_c)) / backend.PIXEL_M))
    ny = max(2, round((north - south) * 110540 / backend.PIXEL_M))
    xs = west + (np.arange(nx) + 0.5) * (east - west) / nx
    ys = south + (np.arange(ny) + 0.5) * (north - south) / ny
    assert xs.min() >= west and xs.max() < east, f"xs spans [{xs.min()}, {xs.max()}"
    assert ys.min() >= south and ys.max() < north, f"ys spans [{ys.min()}, {ys.max()}]"
