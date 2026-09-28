# Progress Checklist — Water-Stress Detection Objectives ([ps-obj.md](ps-obj.md))

Each item is the minimum work that closes a clause of the objectives, with its
done-test. Current pipeline state (verified 2026-09-25): real Sentinel-1
acquisition, geocoding, 5-class K-means map, and Leaflet dashboard **work**;
the gaps below are what separates the demo from the stated objectives.

## Priority TODO (all 17 items, execution order)

Ordered by dependency and real-world lead time, not section number:

1. [ ] **1.1** Pull stage-spanning scenes — STAC archive already holds them, one code change, do today.
2. [ ] **2.1** Obtain CPS plot polygons — longest external dependency; start the paperwork now.
3. [ ] **1.2** Growth-stage labels per scene (config table, after 1.1 dates exist).
4. [ ] **1.3** Radiometric calibration to sigma0 (pure code, unblocks everything scientific).
5. [ ] **1.4** Speckle filter (after 1.3, same code path).
6. [ ] **2.2** Clip grid to plots, one record per plot (needs 2.1).
7. [ ] **2.3** Delete dead landcover-mask path (same commit as 2.2).
8. [ ] **3.4** Agronomist-reviewed irrigation strings — human lead-time, request alongside 2.1.
9. [ ] **1.5** Validate VV/VH² proxy vs in-situ moisture (needs 1.3 + field visits; schedule with 2.1).
10. [ ] **2.4** Calibrate 5 classes against labeled ground truth (needs 1.5, 2.2).
11. [ ] **2.5** Per-stage map exports (needs 1.2, 2.4).
12. [ ] **3.1** Join farmer/field attributes onto plots (needs 2.1).
13. [ ] **3.2** Per-farmer slip generator (needs 3.1, 3.4).
14. [ ] **3.3** Pilot delivery batch to real farmers (needs 3.2).
15. [ ] **A** Report >80% sugarcane-parcel overlap number (needs 2.1, 2.2).
16. [x] **B** Tests + one-command reproducible run (after each code item, final pass here).
17. [ ] **C** Methodology write-up of what the code actually does (last, once numbers exist).

## Objective 1 — Acquire & preprocess SAR

- [ ] **1.1 Span the four growth stages with acquisitions.**
  Collect dual-pol GRD scenes covering germination, tillering, grand growth,
  maturity (study-area calendar: ~Nov–Jun germination, Jun–Sep tillering,
  Sep–Jan grand growth, Jan–Apr maturity; 12-day revisit → ≥4 scenes, one per
  stage).
  *Done when:* `find_scenes` accepts a date window per stage and metadata.json
  lists at least one scene per stage.
- [ ] **1.2 Label each scene with its crop growth stage.**
  Map acquisition month → stage (config.yaml table, no code) and carry the
  label into outputs.
  *Done when:* every polygon's metadata records which stage(s) contributed.
- [ ] **1.3 Calibrate raw DNs to sigma0.**
  Radiometric calibration using the antenna patterns in each product's
  annotation XML (adds ~40 lines; no SNAP).
  *Done when:* per-scene sigma0 in dB, verified against known targets
  (asphalt ≈ −10 dB, water ≈ −20 dB at VV).
- [ ] **1.4 Apply a speckle filter.**
  3×3 refined Lee on the calibrated grid (numpy convolution, no new dep).
  *Done when:* classified map still separates the 5 levels; std-dev inside a
  homogeneous field drops measurably.
- [ ] **1.5 Validate the water-stress proxy.**
  Prove VV/VH² (or a polarimetric variant) actually tracks canopy/soil moisture:
  correlate stage-wise sigma0 statistics against ≥10 in-situ moisture or field
  health observations.
  *Done when:* reported correlation with n, or the proxy is replaced by whatever
  wins the comparison. If this fails, objectives 2–3 are built on sand.

## Objective 2 — Classification & plot-level GIS mapping

- [ ] **2.1 Ingest authoritative CPS plot polygons.**
  Digitised cane-plot boundaries (Cane Purchase Society / sugar-mill records)
  as a GeoJSON layer in `data/`.
  *Done when:* polygon file exists for the AOI with ≥100 plots.
- [ ] **2.2 Clip the stress grid to plot polygons; one record per plot.**
  Replace pixel-blob polygonisation ([backend.py export](../backend.py)) with
  zonal stats of the ratio per CPS plot; K-means on plot medians, not pixels.
  *Done when:* GeoJSON features carry a stable `plot_id`, and no feature is a
  sub-pixel artefact.
- [ ] **2.3 Remove the dead landcover-mask path.**
  `data/landcover/landcover_100m.tif` doesn't exist, so the cropland mask
  silently no-ops. With 2.1/2.2 done the mask is redundant — delete it.
  *Done when:* no `landcover` key in config.yaml; no masking branch in
  `stress_grid`.
- [ ] **2.4 Calibrate stress classes to ground truth.**
  The 5 levels are currently *relative rank within the AOI*. Label ≥30 plots
  healthy/stressed in the field, then either (a) confirm the ordering holds
  (report confusion matrix + ANOVA p-value) or (b) fit class thresholds on the
  ground truth.
  *Done when:* stress-level assignment has a measured accuracy number in the
  report.
- [ ] **2.5 Export geo-referenced plot maps per stage.**
  Stage-wise GeoJSON/PNG already trivially supported once 1.1–1.2 exist.
  *Done when:* `output/<stage>/...` maps + a combined "latest" map exist.

## Objective 3 — Farmer-oriented information framework

- [ ] **3.1 Attach farmer/field attributes to plots.**
  Join CPS records (farmer name, survey number, village, contact, area) onto
  plot polygons by `plot_id`.
  *Done when:* GeoJSON properties carry these fields; dashboard popup
  ([app.js popupHtml](../frontend/app.js)) shows them.
- [ ] **3.2 Per-farm output artifact.**
  Generate one printable slip (or PNG card) per farmer: village, plot id,
  stage, stress level, color+pattern chip, plain-language irrigation
  recommendation. One Jinja-less string template + file write is enough.
  *Done when:* `output/farmer_slips/<plot_id>.txt|png` generated in the run.
- [ ] **3.3 Delivery mechanism.**
  Cheapest that reaches farmers: WhatsApp/SMS broadcast of the slip via
  a manual upload from the dashboard (no infra). Automated API (Twilio/
  MSG91) only if the manual path is actually used.
  *Done when:* ≥1 pilot batch sent to real farmers with a named recipient per
  plot; feedback collected once.
- [ ] **3.4 Irrigation guidance text.**
  Map each stress level → one recommendation sentence, reviewed by an
  agronomist (a PS supervisor qualifies).
  *Done when:* 5 reviewed strings in config, rendered on slips and popup.

## Cross-cutting acceptance

- [ ] **A. Success criterion measurement:** the charter's ">80% overlap with
  sugarcane parcels" — computable only after 2.1; report the number.
- [x] **B. Reproducible run:** single `python backend.py` regenerates every
  output above; tests extended to each new function (follow
  [test_backend.py](../tests/test_backend.py) synthetic style).
  *(Done for current scope 2026-09-25: 6/6 tests pass, one command
  reproduces all four artefacts; re-open as each new item lands.)*
- [ ] **C. Write-up:** methodology doc updated to describe what the code
  *actually* does now (calibration, proxy validation stats, ground-truth
  accuracy), not the SNAP-era ideal in the older docs.

## Deliberately NOT doing

- Terrain correction — flat terrain at Betul; revisit only if RMS error says so.
- Custom model/ML classifier — K-means + ground-truth thresholds (2.4) answers
  the objective; a classifier needs training data nobody has yet.
- Farmer app/account system — slips + WhatsApp (3.2–3.3) are the objective's
  "suitable mechanism"; an app is scope creep.
