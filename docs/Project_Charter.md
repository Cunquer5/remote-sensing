# Project Charter

**Project Title:** Remote Sensing‑Based Detection and Classification of Water Stress in Sugarcane (Betul Village Prototype)

**Sponsor / Stakeholder:** Aakash (PI)

**Purpose / Problem Statement**
- Sugarcane productivity in Betul, Madhya Pradesh is highly sensitive to water stress.
- Traditional field surveys are costly and cannot provide timely, plot‑level information.
- The prototype aims to demonstrate that Synthetic Aperture Radar (SAR) imagery can be used to (a) identify sugarcane fields and (b) classify water‑stress severity at a fine spatial scale.

**Scope**
- **In‑Scope**: 
  - Acquire Sentinel‑1 IW GRD SAR data over Betul village.
  - Pre‑process SAR data (radiometric calibration, speckle filtering, terrain correction).
  - Generate a sugarcane mask using the Copernicus Land Cover product.
  - Derive a water‑stress indicator from VV/VH backscatter ratios.
  - Classify stress into five levels (Very Low → Very High) using unsupervised K‑means clustering (no ground‑truth needed).
  - Export results as a GeoJSON shapefile for each field.
- **Out‑of‑Scope**: 
  - Development of a full‑featured web or mobile frontend (only a README for integration is provided).
  - Large‑scale deployment beyond the single village prototype.
  - Procurement of in‑situ sensor measurements.

**Deliverables**
1. **Documentation Package** (Markdown files):
   - Project Charter (this document)
   - Technical Design
   - Data Acquisition Plan
   - Methodology & Algorithm Description
   - Implementation Guide (backend script)
   - Evaluation Plan
   - Risk & Mitigation Register
   - README for frontend integration
2. **Backend Code** (`backend.py`) – fully functional Python script that fetches, processes, and classifies SAR data.
3. **Result Artefacts** (generated on first run):
   - `betul_sugarcane_fields.geojson` – field polygons with stress class attribute.
   - Quick‑look PNG map of stress classes.

**Assumptions**
- Sentinel‑1 IW GRD data is freely accessible from the ESA public archive on AWS S3, the Microsoft Planetary Computer, or ESA Sentinel‑Hub (all have generous free tiers).
- A sugarcane mask can be derived from the Copernicus Global Land Cover (100 m) product (downloadable at no cost).
- The prototype runs locally on a laptop with ≥ 8 GB RAM and Python 3.10.
- No paid cloud services or proprietary APIs are required.

**Constraints**
- Dataset size must be limited to a few months (e.g., last 3 months) to keep local processing lightweight.
- No ground‑truth measurements; classification relies on statistical separation of backscatter values.

**Success Criteria**
- Successful generation of a GeoJSON file where > 80 % of detected polygons overlap with known sugarcane parcels (visual verification).
- Clear visual separation of the five stress classes on the output map.

**Approvals**
- Project Owner: Aakash (signature: __________)
- Date: __________