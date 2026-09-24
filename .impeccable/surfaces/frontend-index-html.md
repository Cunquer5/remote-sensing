---
version: 1
slug: "frontend-index-html"
primary_target: "frontend/index.html"
related_targets: []
---

# Surface brief — frontend/index.html (Betul Stress Dashboard)

Mode: Operate. Visitor: PI + scientific evaluator on laptop/projector, occasionally mobile. Job: open one URL, read the 5-class stress map over Betul as a cartographic product, toggle map units, inspect a field, trust provenance, export GeoJSON.

Chosen direction (user-pinned over the direction roll): **Cartographic Survey Plate** — the dashboard is a printed USGS/Survey-of-India toposheet. Near-white paper sheet, double-rule border with corner registration ticks + coordinate graticule, live satellite map as the mounted "plate", classified fields as patterned map units, provenance + class key as marginalia. Cartographic red (#C8102E) is the only UI accent; the pinned green→red ramp is data-only. Archivo Narrow / Archivo / IBM Plex Mono. Flat print — no shadows, no glass, no rounded cards.

Composition: center map plate (north arrow, zoom-linked scale bar, India locator inset); top margin title block + sheet id; right margin EXPLANATION key (5 patterned swatches + counts, click-to-toggle) above FIELD REGISTER (mono plot IDs + hectares); bottom margin SOURCE/PROVENANCE + NOTICES; actions as ruled index-tab buttons. Mobile: frame tightens, margins stack below a reduced plate.

Signature moment: selecting a field drops a cartographic callout (leader line → printed "reading" box). Empty/error renders as a NOTICE stamp ("NO DATA ISSUED — run python backend.py").

Data contract (unchanged, verified against backend.py): GET {BASE}/metadata.json, /legend.json (optional), /betul_sugarcane_fields.geojson (required, property `stress_level`), /betul_stress_map.png (optional); BASE from frontend/config.json (default ../output). Preview fixture: tools/make_preview_fixture.py.

Unresolved: per-field farmer IDs / cluster props appear in the callout only when the backend emits them. X-ray reveal of the raw VV/VH ratio grid is a candidate future signature moment, not built.
