# Data Acquisition Plan

## 1. Study Area – Betul Village (Madhya Pradesh)
- Approximate centroid: 21.8445° N, 77.8690° E
- Bounding box (≈ 5 km × 5 km):
  - North: 21.8700° N
  - South: 21.8200° N
  - East:  77.8940° E
  - West:  77.8440° E
- The polygon will be defined directly in the script (GeoJSON Feature).

## Satellite Data Source
- **Sentinel‑1 Interferometric Wide (IW) Ground‑Range Detected (GRD)**
  - Provider: ESA – free via AWS S3, Microsoft Planetary Computer, or Sentinel‑Hub (any of the three can be used at no cost).
  - Polarisation: Dual‑polarisation VV & VH (required for water‑stress ratio).
  - Temporal resolution: 6‑day repeat; we will grab the **three most recent acquisitions** (≈ 2 weeks) to keep the data set small.
  - Spatial resolution: 10 m ground‑range.
- **Copernicus Global Land Cover (100 m)** – free download; class 16 corresponds to sugarcane.

## 3. Ground‑Truth Strategy (no in‑situ data)
- **Reference Land‑Cover**: Use the Copernicus Land Cover product to obtain an official sugarcane mask.
- **Unsupervised Classification**: K‑means clustering on the VV/VH ratio provides relative stress classes. Validation will be visual (compare with known field boundaries from open‑source cadastral maps – e.g., OpenStreetMap) and with expert judgement.

## 4. Data Volume Management (local execution)
- Limit SAR collection to **3 images** (latest available) within the 5 km² bounding box.
- Export only the **masked sugarcane pixels** (≈ 10 k‑30 k pixels) to a NumPy array for clustering.
- All intermediate raster products stay in GEE; only the final vector (GeoJSON) and PNG map are downloaded locally (~few hundred KB).

## 5. Storage Paths (local)
- `data/` – raw export folder (will contain a small CSV of sampled pixels).
- `output/` – final artefacts:
  - `betul_sugarcane_fields.geojson`
  - `betul_stress_map.png`

## 6. Quality Checks
- Verify that the sugarcane mask overlaps > 80 % with OpenStreetMap agricultural polygons.
- Ensure the ratio image has no NaN values after masking.
- Confirm K‑means converged (inertia < 0.01 of max‑scale).

---
*All steps are designed to run on a standard laptop (8 GB RAM, Python 3.10). No external paid services are required.*
