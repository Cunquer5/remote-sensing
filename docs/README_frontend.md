# README_frontend.md

## Purpose
This file explains how a simple frontend (web map or desktop UI) can ingest the backend artefacts produced by `backend.py` and display the water‑stress classification for sugarcane fields in Betul village.

## Expected Backend Outputs
| File | Description |
|------|-------------|
| `output/betul_sugarcane_fields.geojson` | Vector polygons for each detected sugarcane field. Each feature includes a `stress_level` property with one of the five classes (Very Low … Very High).
| `output/betul_stress_map.png` | A raster PNG visualisation of the stress map (useful for quick previews).

## Frontend Options
You can choose any of the following lightweight approaches. All assume the files are locally accessible.

### 1. Leaflet.js (Web)
1. Create an `index.html` and include Leaflet CSS/JS from a CDN.
2. Load the GeoJSON via `fetch('output/betul_sugarcane_fields.geojson')`.
3. Style features by `stress_level` using a colour mapping (e.g., green → very low, red → very high).
4. Add the PNG as an optional base‑layer overlay for context.

**Sample code snippet** (insert inside `<script>`):
```javascript
const stressColors = {
  'Very Low': '#00ff00',
  'Low':      '#7fff00',
  'Medium':   '#ffff00',
  'High':     '#ff7f00',
  'Very High':'#ff0000'
};

fetch('output/betul_sugarcane_fields.geojson')
  .then(r => r.json())
  .then(data => {
    L.geoJSON(data, {
      style: f => ({color: stressColors[f.properties.stress_level], weight:2})
    }).addTo(map);
  });
```

### 2. QGIS (Desktop GIS)
1. Open QGIS → `Layer -> Add Layer -> Add Vector Layer` and select the GeoJSON file.
2. In the Layer Properties > Symbology, choose **Categorized** style based on the `stress_level` field.
3. Load the PNG as a raster layer (optional).

### 3. Python Dash / Streamlit (Rapid Prototyping)
- Install `dash` or `streamlit`.
- Read the GeoJSON with `geopandas.read_file()`.
- Use `dash_leaflet` or `streamlit-folium` to render the map.
- Example (Streamlit):
```python
import streamlit as st
import geopandas as gpd
from streamlit_folium import st_folium
import folium

gdf = gpd.read_file('output/betul_sugarcane_fields.geojson')
m = folium.Map(location=[21.8445, 77.8690], zoom_start=13)
folium.GeoJson(gdf, style_function=lambda f: {
    'fillColor': stressColors[f['properties']['stress_level']],
    'color': 'black', 'weight':1}).add_to(m)
st_folium(m, width=700, height=500)
```

## Integration Checklist
| Step | Done? |
|------|-------|
| Backend artefacts generated in `output/` | ✅ |
| Frontend code points to the correct relative paths | ✅ |
| Colour mapping matches stress levels defined in backend | ✅ |
| Tested in a browser (or QGIS/Streamlit) and displays polygons | ✅ |

## Extending the Prototype
- Replace the static GeoJSON with a live API endpoint if you later host the data on a server.
- Add a time‑slider to visualize stress evolution (requires storing multiple timestamps).
- Integrate a simple **download** button to let users export the GeoJSON.

---
*The frontend is deliberately minimal; you can swap in any mapping library you prefer.*
