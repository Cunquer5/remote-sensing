# Design

<!-- impeccable:design-schema 1 -->

## Direction

Replacement world (user-pinned over the direction roll): the dashboard is a **printed topographic survey sheet** — a USGS / Survey-of-India toposheet rendered as a web tool. A near-white paper sheet carries a double-rule border, corner registration ticks, and a coordinate graticule; the live satellite map is the mounted "plate"; classified fields are map units; provenance and the class key are marginalia. Craft bar: real cartographic plate-making — precise rules, disciplined marginalia, engraved legibility. This replaces the earlier Felt/Saturn SaaS-map world; the old look is evidence of the subject, not authority over it.

## Mode

Operate. The visitor (PI + scientific evaluator) inspects classified field polygons, toggles map units, reads provenance, exports data. Scanability, cartographic convention, and map primacy outrank expression. Expression lives in the sheet's craft, never in obscuring the task.

## Color strategy

Restrained, paper-and-ink. The sheet is near-white printer paper; structure is ink black; one **cartographic red** (`--mapred #C8102E`) is the only UI accent (north arrow, index numbers, active/selected marks, the locator box). The pinned 5-class stress ramp is the only saturated data color and is never used for chrome:

- Very Low `#00FF00` → Low `#7FFF00` → Medium `#FFFF00` → High `#FF7F00` → Very High `#FF0000` (matches `docs/README_frontend.md` + `backend.py STRESS_COLORS` + the RdYlGn quick-look). On the map each class also carries a distinct black **pattern overlay** (legend swatches are ramp-color + hatch) so classes read without relying on hue.
- Sheet: paper `#F5F5F2`, plate frame/rule `#B8B6AE`, ink `#141414`, body `#3A3A36`, muted `#6A6A61`, faint construction rule `#DAD8CF`.
- Map basemap: Esri World Imagery (real satellite, key-free; the "aerial photograph" mounted on the sheet). Past Esri's native z13 limit over this rural AOI, a Google satellite layer overlays it so the aerial stays sharp at plot level — both are imagery, so it reads as one continuous photograph (never a beige OSM road map, which broke the old deep-zoom view). Polygons sit at fillOpacity ~0.5 with near-opaque dark strokes so field boundaries read against terrain.
- Deliberately NOT the cream/serif/terracotta cluster: near-white paper, condensed sans (not serif display), and a true map red (not terracotta).

## Type

Cartographic-technical register. **Archivo Narrow** for the title block, sheet id, and marginalia headers (condensed, engraved-map feel); **Archivo** for body/labels; **IBM Plex Mono** for every measured value — coordinates, map-unit codes, plot IDs, areas, counts, timestamps, projection. Scale: 10–11px uppercase marginalia kickers (+0.06–0.12em tracking), 12–13px body/controls, 15–16px emphasis, 18–22px title block. No decorative display face; the plate is the hero.

## Elevation & radius

Flat print, no elevation. Survey sheets have no drop shadows and no glass. Blocks are square-cornered (0–2px) with **hairline ink rules** and, for the outer sheet, a **double-rule border frame** with corner registration ticks. Depth comes from rules, pattern fills, and paper, not shadow. Map controls stay square and ruled to match the sheet.

## Layout

A framed paper sheet fills the viewport. Center: the satellite map **plate**, bounded by the double-rule frame carrying graticule ticks and small lat/lon labels on the inner edges; a north arrow, a zoom-linked segmented scale bar, and a small locator inset (India outline + red Betul box) sit on the plate. Top margin: title block (left) + sheet identifier (right, with a **live, approximate scale ratio** `≈ 1:N` computed from zoom, never a fixed asserted scale, plus a center-coordinate readout). Right margin: an **EXPLANATION** key (5 patterned map-unit swatches coded `MU-1`…`MU-5` + class + count, click-to-toggle) above a **FIELD REGISTER** table (monospace plot IDs + hectares). Bottom margin: a **SOURCE / PROVENANCE** block (AOI, scenes, acquisition dates, method, EPSG:4326, generated) and a **NOTICES** block. Actions (quick-look, download GeoJSON) render as small ruled "order a sheet" index-tab buttons. Mobile: the frame tightens; margins collapse to stacked ruled blocks below a sticky reduced map plate.

Real runs emit tens of thousands of polygons: the plate renders them on a **canvas** renderer (not SVG), and the FIELD REGISTER lists a capped subset (first ~200) with a "showing N of total · all plotted on the plate" note. `MU-` codes tie the EXPLANATION key to the register.

## States

- Loading: faint construction-line skeleton in the margin blocks; plate quiet; console-free.
- Empty/missing files: a **NOTICE stamp** in the margin / centered on the plate — "NO DATA ISSUED — run `python backend.py`" with expected file paths listed; never a broken plate.
- Error (fetch 404/network): same notice, naming the failed artefact.
- Selection: polygon click → heavier ink outline + numbered index tag + a cartographic **callout** (thin leader line to a small printed "reading" box: class chip, area, centroid, any real props like cluster ID).
- Legend toggle: map unit hidden → swatch dims to ~40% with a diagonal strike across the hatch; keyboard-operable; counts persist.

## Motion

Minimal, Operate. One authored moment: the sheet "registers" on load — border frame rules draw in, margin blocks fade/settle up (≤260ms ease-out, staggered). Polygon hover lifts fill opacity; selection snaps (no long tween). `prefers-reduced-motion` respected. No scroll theater — single-viewport tool.

## Do-not

No drop shadows, glass, or rounded floating cards (this world is flat print). No gradient text. Stress-ramp colors never used for buttons/links/chrome. No cream ground, no serif display, no terracotta accent. No invented farmer names, yields, accuracy claims, or institutional logos in popups or marginalia. Patterns are functional (class legibility), not decoration.
