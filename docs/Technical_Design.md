# Technical Design

## Architecture Overview (Free Stack)
```
+-------------------+        +-----------------------+
|   Sentinel‑1 IW   |  -->   |   Pre‑processing (SNAP) |
|   (AWS S3 / PC /  |       |   - Calibration       |
|    Sentinel‑Hub)   |       |   - Speckle filter    |
+-------------------+        |   - Terrain corr.    |
                             +-----------+----------+
                                         |
                                         v
+-------------------+        +-----------------------+
| Copernicus Land   |  -->   |   Sugarcane Mask      |
| Cover (100 m)    |       |   - Reclassify sugarcane |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Processed SAR   |  -->   |   Stress Indicator    |
|   (VV, VH bands)  |       |   - Ratio VV/VH       |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Clustering (K‑means, k=5)   |
|   - Assign stress class 0‑4   |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Export Results  |  -->   |   GeoJSON + PNG map |
+-------------------+        +-----------------------+
```

## Component Details
1. **Data Ingestion (Free Sources)**
   - **AWS S3**: `s3://sentinel-s1-l1c/…/GRD/` – public bucket, no auth needed.
   - **Microsoft Planetary Computer**: STAC API; access via `planetary_computer` Python library.
   - **ESA Sentinel‑Hub**: WMS/WMTS free tier (50 × 50 km per request).
2. **Pre‑processing**
   - Performed locally with **SNAP** (`gpt` CLI) – radiometric calibration, Lee speckle filter, terrain correction using SRTM DEM.
3. **Sugarcane Mask**
   - Copernicus Global Land Cover (100 m) – class 16 = sugarcane. Download once (≈ 200 MB) from ESA Open Data portal.
4. **Stress Indicator**
   - Compute VV/VH ratio (linear scale) on the pre‑processed SAR stack.
5. **Clustering**
   - Sample masked pixels (≤ 5 000) → K‑means (`sklearn`). Map clusters to stress levels (Very Low → Very High).
6. **Export**
   - Convert clustered raster to vector polygons (`gpt` ReduceToVectors or `rasterio.features.shapes`).
   - Save as GeoJSON and PNG for quick visualisation.

## Dependencies
- Python 3.10+
- `boto3` (AWS S3 access) or `planetary_computer` + `xarray`
- SNAP (Earth observation toolbox) – CLI `gpt`
- `numpy`, `scikit-learn`, `geopandas`, `rasterio`, `matplotlib`

## Runtime Flow (backend.py)
1. Download the three newest Sentinel‑1 IW GRD files from the chosen free source.
2. Run SNAP preprocessing graph (calibration → speckle filter → terrain correction).
3. Load the Copernicus Land Cover mask, rasterise to the SAR resolution.
4. Compute VV/VH ratio, apply the mask.
5. Sample pixels, run K‑means, assign stress classes.
6. Polygonise the classified raster and export GeoJSON + PNG.

All heavy image processing stays in SNAP; only the small sampled matrix and clustering run in Python, keeping RAM usage low.

                                         v
+-------------------+        +-----------------------+
| Copernicus Land   |  -->   |   Sugarcane Mask      |
| Cover (100 m)     |       |   - Reclassify sugarcane |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Processed SAR   |  -->   |   Stress Indicator    |
|   (VV, VH bands)  |       |   - Ratio VV/VH       |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Clustering (K‑means, k=5)   |
|   - Assign stress class 0‑4   |
+-------------------+        +-----------+-----------+
                                         |
                                         v
+-------------------+        +-----------------------+
|   Export Results  |  -->   |   GeoJSON + PNG map |
+-------------------+        +-----------------------+
```

## Deprecated GEE sections removed – use free‑stack workflow only.

