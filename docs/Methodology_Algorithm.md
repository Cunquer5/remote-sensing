# Methodology & Algorithm Description

## 1. Overview
The prototype follows a classic remote‑sensing workflow: (1) acquire SAR imagery, (2) preprocess it, (3) isolate the crop of interest, (4) compute a physically‑based water‑stress proxy, (5) cluster the proxy into discrete stress levels, and (6) export the results as a vector map.

## 2. Detailed Steps
### 2.1. SAR Pre‑processing (GEE)
| Operation | Description | GEE Function |
|-----------|--------------|--------------|
| Radiometric Calibration | Convert digital numbers to backscatter coefficient (sigma‑0) | `image.select('VV').multiply(0.0001)` (internal calibration) |
| Speckle Filtering | Reduce multiplicative noise using Lee filter (3 × 3 window) | `image.focal_mean(3, 'square', 'pixels')` |
| Terrain Correction | Adjust backscatter for topography using SRTM DEM (30 m) | `image.addBands(elevation).terrainCorrection()` |
| Subset to Study Area | Clip to Betul bounding polygon | `image.clip(betul_polygon)` |

### 2.2. Sugarcane Mask
- Load Copernicus Global Land Cover (100 m) time‑independent layer.
- Extract class **16 – Sugarcane**.
- Resample to 10 m (matching SAR) using nearest‑neighbor.
- Convert to binary mask (`mask = landcover.eq(16)`).
- Apply mask to the SAR image: `sar_masked = sar_processed.updateMask(mask)`.

### 2.3. Water‑Stress Indicator
- Compute **VV/VH ratio** (both in linear scale):
  ```python
  ratio = sar_masked.select('VV').divide(sar_masked.select('VH')).rename('ratio')
  ```
- The ratio inversely correlates with canopy moisture: higher ratio ⇒ drier vegetation.

### 2.4. Sampling for Clustering
- Sample up to **5,000** non‑null pixels inside the mask:
  ```python
  sample = ratio.sample(region=betul_polygon, scale=10, numPixels=5000, geometries=True)
  ```
- Export sample to a local CSV (`data/ratio_samples.csv`).
- Load the CSV directly from the `data/` folder for clustering.
- Export the final GeoJSON and PNG map to the `output/` folder (local).

### 2.5. Unsupervised K‑means (Python)
```python
import numpy as np, pandas as pd
from sklearn.cluster import KMeans

# Load CSV exported from GEE
pts = pd.read_csv('data/ratio_samples.csv')
X = pts['ratio'].values.reshape(-1, 1)

kmeans = KMeans(n_clusters=5, random_state=42).fit(X)
pts['cluster'] = kmeans.labels_
```
- Map cluster IDs to stress levels based on the mean ratio of each cluster (lowest mean → Very Low, highest mean → Very High).

### 2.6. Raster Classification & Vector Export
- Push the cluster map back to GEE as an `ee.Image` using `ee.Image().paint()`.
- Convert the classified raster to polygons (`reduceToVectors`).
- Attach the stress‑level attribute to each polygon.
- Export the feature collection as a **GeoJSON** file.

## 3. Assumptions & Limitations
- **No field measurements** – the stress proxy is purely spectral; absolute water‑stress values cannot be calibrated.
- **Uniform Soil & Crop Management** – assumes similar soil texture and management across the village; local variation may affect backscatter.
- **Temporal Snapshot** – using only three recent images provides a static snapshot; seasonal dynamics are not captured.

## 4. Expected Output
- `betul_sugarcane_fields.geojson` – each feature has properties:
  - `stress_class` (Very Low, Low, Medium, High, Very High)
  - `mean_ratio`
- `betul_stress_map.png` – quick‑look map with a legend.

---
*The methodology is deliberately simple, reproducible, and runs entirely on a laptop using free open‑source data.*
