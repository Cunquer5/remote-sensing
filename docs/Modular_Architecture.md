# Modular Architecture Specification

## Overview
The prototype is decomposed into **five independent modules**. Each module has a clear input‑output contract, can be executed stand‑alone, and can be swapped or scaled.

| Module | Purpose | Input | Output | Language / Tool |
|--------|---------|-------|--------|-----------------|
| `download` | Fetch Sentinel‑1 GRD scenes from a free source (AWS S3, Planetary Computer or Sentinel‑Hub). | AOI bounds, source selector, number of scenes | GeoTIFF zip files in `data/raw/` | Python (`boto3` / `planetary_computer`)
| `preprocess` | Radiometric calibration, Lee speckle filter, terrain correction. | Raw SAR zip → extracted TIFF bands | Pre‑processed multi‑band TIFFs in `data/processed/` | SNAP (`gpt` with XML graph)
| `mask` | Generate sugarcane mask from Copernicus Global Land Cover. | Land‑cover raster, AOI | Binary mask (`numpy` bool array) | Python (`rasterio`)
| `cluster` | Compute VV/VH ratio, sample pixels, run K‑means, assign stress classes. | Processed SAR TIFF, mask | Classified raster (int IDs) and CSV sample (`data/ratio_samples.csv`) | Python (`numpy`, `scikit‑learn`)
| `export` | Polygonise raster, map cluster IDs to stress levels, write GeoJSON & PNG. | Classified raster, mapping dict | `output/*.geojson`, `output/*.png` | Python (`rasterio.features`, `geopandas`, `matplotlib`)

### Interfaces
- All modules read/write **relative paths** rooted at project root. No global variables.
- Configuration lives in `config.yaml`; modules import it to obtain AOI, source, number of scenes, etc.
- CLI entry point `backend.py` orchestrates the modules sequentially but can be replaced by a workflow manager (e.g., `make` or Airflow) for larger scales.

### Extensibility
- To add a new source, implement a `download_<source>.py` that respects the same signature.
- To replace K‑means with a supervised model, swap `cluster.py` while keeping the CSV interface unchanged.
- New output formats (GeoPackage, Cloud‑Optimized GeoTIFF) can be added in `export.py` without touching upstream modules.
