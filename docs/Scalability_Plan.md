# Scalability & Modularity Plan

## 1. Data‑size scaling
- **Chunked AOI**: Split large study areas (district/state) into a grid of 5 km × 5 km tiles. Each tile runs the full pipeline independently (download → preprocess → mask → cluster → export).
- **Parallel execution**: Use GNU `parallel` or Python's `concurrent.futures` to launch up to **N** tile jobs (default = CPU count). SNAP supports multi‑threading via `-t <threads>` flag.
- **Dask integration (optional)**: Replace the NumPy raster stacks with Dask arrays; enables out‑of‑core processing for > 10 GB SAR mosaics.

## 2. Storage layout
```
project_root/
├─ data/
│   ├─ raw/          # original SAR zip files (S3 download)
│   ├─ processed/    # SNAP‑processed multi‑band TIFFs
│   ├─ landcover/    # Copernicus Land Cover raster (once per project)
│   └─ intermediate/ # CSV samples, intermediate masks
├─ output/
│   ├─ tiles/        # per‑tile GeoJSON/PNG (named by tile id)
│   └─ merged/       # final merged GeoJSON for whole region
└─ logs/            # module‑specific logs (download.log, preprocess.log…)
```
- **Retention policy**: Keep `raw/` for 30 days, purge older files automatically via a simple script (`cleanup.py`).

## 3. Containerisation
- **Dockerfile** builds an image with Python, SNAP, and required libraries.
- **docker‑compose.yml** spins up multiple containers, each assigned a tile via environment variable `TILE_ID`. Horizontal scaling is achieved by increasing `replicas`.
- **Kubernetes (future)**: Deploy as a Job per tile; the job writes its output to a shared Persistent Volume (the `output/` folder) or directly to an object store (e.g., AWS S3).

## 4. Config‑driven execution
`config.yaml` holds:
```yaml
aoi:
  name: Betul
  bounds: [77.8440, 21.8200, 77.8940, 21.8700]
source: aws   # options: aws | pc | hub
scenes: 3
snap_threads: 4
output_dir: output
log_dir: logs
```
Changing a single key changes the whole pipeline – no code edits needed.

## 5. CI / Automated testing
- **Unit tests** for each module (`tests/test_download.py`, `tests/test_preprocess.py`, …) using pytest.
- **Integration test** runs the entire pipeline on a synthetic 1 km² AOI and asserts that a valid GeoJSON is produced.
- **GitHub Actions** (`ci.yml`) runs linting (`ruff`), tests, and builds the Docker image on each push.

## 6. Monitoring & Logging
- Each module writes a structured JSON log entry (`timestamp`, `module`, `status`, `message`). Logs collected by the orchestrator can be visualised in Grafana or sent to CloudWatch.
- Errors abort the tile job but do not stop other tiles; failures are reported in a summary CSV (`tile_status.csv`).

## 7. Future extensions
- **Supervised stress model**: replace K‑means with a TensorFlow/ONNX model; only `cluster.py` changes.
- **Time‑series analysis**: keep multiple acquisition dates, compute temporal metrics, and feed them into a recurrent model.
- **Web API**: expose `backend.py` functionality as a FastAPI service; each request triggers the pipeline for the supplied AOI.

---
With this plan the prototype can grow from a single‑village proof‑of‑concept to a state‑wide, parallelised processing system while keeping code modular and maintainable.
