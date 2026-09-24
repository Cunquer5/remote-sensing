# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Aakash (PI) presenting the prototype to project evaluators/guides (confirmed demo/evaluation audience). Secondary: the developer running `backend.py` locally and opening the dashboard to inspect results. Situation: a laptop or desktop browser during a demo or a local test run; occasionally mobile.

## Product Purpose

A read-only geospatial dashboard that visualises the output of a Sentinel-1 SAR pipeline detecting water stress in sugarcane fields around Betul village, Madhya Pradesh. It turns the backend's artefacts (field polygons classified into 5 stress levels, a quick-look PNG, run metadata) into a credible, inspectable demonstration that SAR backscatter ratio (VV/VH) + unsupervised K-means can produce plot-level stress maps without ground truth. Success = an evaluator can immediately see the classified fields, understand the 5-class scheme, click a field for details, and trust the provenance (AOI, scenes, methodology).

## Positioning

Unsupervised, ground-truth-free stress ranking from freely available Sentinel-1 GRD data fetched anonymously from AWS S3 — a fully open, no-paid-API pipeline, demonstrated end-to-end on one village.

## Operating Context

- Backend: `backend.py` (Python 3.10, SNAP `gpt`, rasterio, geopandas, sklearn) run manually from the project root; regenerates `output/betul_sugarcane_fields.geojson` and `output/betul_stress_map.png`.
- Frontend consumes artefacts over HTTP: the user serves the project root (e.g. `python -m http.server`) and opens `frontend/index.html`. Confirmed stack: plain static HTML/CSS/JS with Leaflet (CDN), no bundler.
- Config truth lives in `config.yaml` (AOI name "Betul", bounds, scene count).
- Future: multi-tile output (`output/tiles/{tile_id}.geojson`) and optional `output/legend.json` / `output/metadata.json`; frontend must tolerate their absence.

## Capabilities and Constraints

- Display GeoJSON polygons styled by `stress_level` (exactly 5 classes: Very Low, Low, Medium, High, Very High) with colours consistent with the backend's RdYlGn quick-look (green → yellow → red).
- Legend beside the map with click-to-toggle layer visibility per class.
- PNG quick-look (`betul_stress_map.png`) viewable as a static preview and/or georeferenced-style overlay.
- Click a polygon → popup with stress level and any available properties (cluster ID, area, farmer ID shown only if present in the data — current GeoJSON has only `stress_level`).
- Header shows AOI metadata (village, SAR acquisition info, scene count) from `output/metadata.json` when present; graceful fallback otherwise.
- Download link for the raw GeoJSON.
- Friendly 404/error state: "Results not yet ready — run the backend first."
- Responsive (desktop + mobile); base-URL config for alternate hosting/CDN.
- Tile-level loading is a stated future need — architecture should not preclude it, but no tiles exist yet.
- Out of scope (charter): auth, editing, live API, farmer portal backend.

## Brand Commitments

No established visual identity — the old frontend assets were removed; project is anonymous apart from the "Betul sugarcane water-stress" research framing. Language: English.

## Evidence on Hand

- `output/betul_sugarcane_fields.geojson` — real 5-feature sample (one polygon per stress class over the Betul AOI, 77.844–77.884 E, 21.830–21.870 N).
- `output/betul_stress_map.png` — real quick-look rendered with matplotlib RdYlGn(5).
- `backend.py`, `config.yaml`, `docs/` (charter, methodology, evaluation plan, frontend README with the canonical colour map `#00ff00…#ff0000`).
- Absences: no ground-truth data, no farmer IDs, no tile files, no legend/metadata JSON yet, no test users. Future work must not fabricate yields, farmer names, accuracy claims, or institutional logos.

## Product Principles

1. Evidence over decoration — every visual element maps to a real backend artefact; no invented data claims.
2. Methodology transparency — the map should make the "how" (SAR ratio → clusters → 5 levels) inspectable, since that is the demo's actual contribution.
3. Degrade honestly — missing/future artefacts produce clear states, never broken UI or fake placeholders.
4. The map is the product — chrome and copy stay subordinate to the geospatial view.
5. Zero-friction evaluation — open a URL and the whole story is legible without login, config, or explanation.

## Accessibility & Inclusion

Stress classes must remain distinguishable without relying on hue alone (labels/patterns in legend and popups); keyboard-focusable map controls; sufficient contrast in UI chrome. No formal conformance target was set.
