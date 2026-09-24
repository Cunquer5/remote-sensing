/* Betul SAR water-stress dashboard — Cartographic Survey Plate.
 * Vanilla JS + Leaflet. Reads backend artefacts from a configurable base URL
 * (frontend/config.json -> { "base": "../output" }); every optional artefact
 * degrades gracefully, only the GeoJSON is required to draw the plate.
 */
(() => {
  "use strict";

  // Pinned ramp: docs/README_frontend.md + backend.py STRESS_COLORS.
  // Each map-unit also carries a pattern so it reads without hue. Overridden at
  // runtime by output/legend.json when the backend has produced it.
  const DEFAULT_LEGEND = [
    { level: "Very Low", color: "#00ff00", pattern: "hlines" },
    { level: "Low", color: "#7fff00", pattern: "diag" },
    { level: "Medium", color: "#ffff00", pattern: "cross" },
    { level: "High", color: "#ff7f00", pattern: "dots" },
    { level: "Very High", color: "#ff0000", pattern: "vlines" },
  ];
  const GEOJSON_FILE = "betul_sugarcane_fields.geojson";
  const PNG_FILE = "betul_stress_map.png";
  // Betul AOI fallback (config.yaml bounds) until real data fits the view.
  const DEFAULT_CENTER = [21.845, 77.864];
  const UNKNOWN_LEVEL = "Unclassified";

  const $ = (id) => document.getElementById(id);
  const el = {
    map: $("map"), center: $("center-readout"),
    tbScale: $("tb-scale"), tbDate: $("tb-date"),
    muList: $("mu-list"), legendAll: $("legend-all"),
    regList: $("reg-list"), regCount: $("reg-count"),
    srcAoi: $("src-aoi"), srcDates: $("src-dates"), srcScenes: $("src-scenes"),
    srcPixel: $("src-pixel"), srcRms: $("src-rms"), srcGen: $("src-generated"),
    btnQuicklook: $("btn-quicklook"), btnDownload: $("btn-download"),
    overlay: $("quicklook-overlay"), qlImg: $("quicklook-img"), qlClose: $("quicklook-close"),
    notice: $("notice"), noticeTitle: $("notice-title"), noticeBody: $("notice-body"),
    noticeFiles: $("notice-files"), noticeRetry: $("notice-retry"),
  };

  let map = null, deepLayer = null, renderer = null;
  let legend = DEFAULT_LEGEND;
  let colorOf = {}, patternOf = {};
  let levelGroups = {};       // level -> L.LayerGroup
  let featureRecords = [];    // { name, level, areaHa, lat, lng, props, layer }
  let hiddenLevels = new Set();
  let selectedLayer = null;
  let baseUrl = "../output";

  /* ---------------- pattern swatches (data URI, no plugin) ---------------- */

  function patSvg(kind, color) {
    let inner = "";
    if (kind === "hlines") inner = '<path d="M0 3H8M0 6.5H8" stroke="#141414" stroke-width="1"/>';
    else if (kind === "vlines") inner = '<path d="M3 0V8M6.5 0V8" stroke="#141414" stroke-width="1"/>';
    else if (kind === "diag") inner = '<path d="M-2 2L2 -2M0 8L8 0M6 10L10 6" stroke="#141414" stroke-width="1"/>';
    else if (kind === "cross") inner = '<path d="M0 4H8M4 0V8" stroke="#141414" stroke-width="0.8"/>';
    else if (kind === "dots") inner = '<circle cx="2" cy="2" r="1" fill="#141414"/><circle cx="6" cy="6" r="1" fill="#141414"/>';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="' + color + '"/>' + inner + '</svg>';
    // Single quotes inside url(): the value is injected into a double-quoted
    // style="..." attribute, so a raw double quote here would truncate it.
    return "url('data:image/svg+xml," + encodeURIComponent(svg) + "')";
  }

  /* ---------------- data loading ---------------- */

  async function resolveBaseUrl() {
    try {
      const cfg = await fetchJson("config.json");
      if (cfg && typeof cfg.base === "string" && cfg.base.trim()) return cfg.base.replace(/\/+$/, "");
    } catch (_) { /* optional */ }
    return baseUrl;
  }

  async function fetchJson(path) {
    const resp = await fetch(path, { cache: "no-store" });
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    return resp.json();
  }

  // Single entry point for field data. When the pipeline starts emitting
  // per-tile files under output/tiles/, aggregate here: fetch a tile manifest
  // and concat feature arrays before styling - the rest of the app only ever
  // sees one FeatureCollection.
  async function loadFields() {
    return fetchJson(`${baseUrl}/${GEOJSON_FILE}`);
  }

  /* ---------------- geometry helpers ---------------- */

  function ringAreaSqM(ring) {
    const R = 6378137;
    const rad = (d) => (d * Math.PI) / 180;
    let total = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];
      total += rad(lon2 - lon1) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
    }
    return Math.abs((total * R * R) / 2);
  }

  function ringCentroid(ring) {
    let x = 0, y = 0;
    const n = ring.length - 1 || 1;
    for (let i = 0; i < n; i++) { x += ring[i][0]; y += ring[i][1]; }
    return [y / n, x / n];
  }

  const fmtHa = (ha) =>
    ha >= 1 ? ha.toLocaleString(undefined, { maximumFractionDigits: 1 }) : ha.toFixed(2);

  /* ---------------- map ---------------- */

  const MAX_ZOOM = 20;          // let users zoom down to individual plots
  const ESRI_NATIVE_MAX = 13;   // Esri World Imagery has no real tiles past z13 over this rural AOI

  function initMap() {
    map = L.map(el.map, { center: DEFAULT_CENTER, zoom: 13, maxZoom: MAX_ZOOM, zoomControl: true, attributionControl: true });
    // Canvas renderer: real runs emit thousands of polygons; SVG would create one
    // DOM path each and collapse. Canvas keeps hit-testing + popups.
    renderer = L.canvas({ padding: 0.5, tolerance: 0.6 });
    // Base aerial: Esri World Imagery (key-free) to its native z13, upscaled beyond.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: MAX_ZOOM,
        maxNativeZoom: ESRI_NATIVE_MAX,
        attribution: 'Imagery &copy; <a href="https://www.esri.com/en-us/home">Esri</a>, Maxar',
      }
    ).addTo(map);
    map.on("zoomend", updateDeepImagery);
    map.on("moveend", updateReadouts);
    map.zoomControl.setPosition("topleft");
    L.control.scale({ position: "bottomright", imperial: false, metric: true }).addTo(map);
    updateDeepImagery();
    updateReadouts();
  }

  // Past Esri's native limit, overlay Google satellite so the aerial stays sharp at
  // plot level. Both sources are imagery, so it reads as one continuous photograph —
  // never the beige OSM road map that broke the deep-zoom view before.
  function updateDeepImagery() {
    if (!map) return;
    const wantDeep = map.getZoom() > ESRI_NATIVE_MAX;
    if (wantDeep && !deepLayer) {
      deepLayer = L.tileLayer("https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        subdomains: "0123", maxZoom: MAX_ZOOM, maxNativeZoom: 19,
        attribution: 'Deep imagery &copy; Google',
      }).addTo(map);
    } else if (!wantDeep && deepLayer) {
      map.removeLayer(deepLayer);
      deepLayer = null;
    }
  }

  // Live map scale ratio (honest, approximate at 96 CSS dpi) + centre readout.
  function updateReadouts() {
    if (!map) return;
    if (el.center) {
      const c = map.getCenter();
      const ns = c.lat >= 0 ? "N" : "S";
      const ew = c.lng >= 0 ? "E" : "W";
      el.center.textContent = `${Math.abs(c.lat).toFixed(4)}°${ns} ${Math.abs(c.lng).toFixed(4)}°${ew}`;
    }
    if (el.tbScale) {
      const lat = map.getCenter().lat;
      const mpp = 40075016.686 * Math.cos((lat * Math.PI) / 180) / (256 * Math.pow(2, map.getZoom()));
      const ratio = Math.round((mpp * 3779.529) / 100) * 100;
      el.tbScale.textContent = `≈ 1:${ratio.toLocaleString()}`;
    }
  }

  const baseStyle = (level) => ({
    color: "#141414", weight: 1.1, opacity: 0.92,
    fillColor: colorOf[level] || "#94a3b8", fillOpacity: 0.5,
  });

  function selectLayer(layer) {
    if (selectedLayer && selectedLayer !== layer) selectedLayer.setStyle({ color: "#141414", weight: 1.1, opacity: 0.92 });
    selectedLayer = layer;
    layer.setStyle({ color: "#c8102e", weight: 2.4, opacity: 1 });
  }

  function popupHtml(rec) {
    const rows = [["Area", `${fmtHa(rec.areaHa)} ha`], ["Centroid", `${rec.lat.toFixed(4)}, ${rec.lng.toFixed(4)}`]];
    const props = rec.props || {};
    const cid = props.cluster_id ?? props.clusterId ?? props.cluster;
    if (cid != null) rows.splice(1, 0, ["Cluster ID", String(cid)]);
    const extra = Object.entries(props)
      .filter(([k]) => !["stress_level", "stresslevel", "cluster_id", "clusterid", "cluster"].includes(k.toLowerCase()))
      .slice(0, 4);
    for (const [k, v] of extra) rows.push([k, String(v)]);
    return `
      <div class="pop">
        <div class="pop-head"><span class="pop-id">${rec.name}</span>
          <span class="pop-chip"><span class="sw" style="background:${patternOf[rec.level] || colorOf[rec.level] || "#94a3b8"};background-size:100% 100%"></span>${rec.level}</span></div>
        <dl>${rows.map(([d, v]) => `<dt>${d}</dt><dd>${v}</dd>`).join("")}</dl>
      </div>`;
  }

  function renderFields(fc) {
    const feats = (fc.features || []).filter((f) => f.geometry && f.geometry.type === "Polygon");
    featureRecords = [];
    const counts = {};
    const ALL = [...legend.map((l) => l.level), UNKNOWN_LEVEL];
    ALL.forEach((lv) => { counts[lv] = 0; levelGroups[lv] = L.layerGroup().addTo(map); });

    feats.forEach((f, i) => {
      const props = f.properties || {};
      let level = props.stress_level ?? props.stressLevel ?? null;
      if (!colorOf[level]) level = UNKNOWN_LEVEL; // never drop a feature silently
      const ring = f.geometry.coordinates[0];
      const areaHa = ringAreaSqM(ring) / 1e4;
      const [lat, lng] = ringCentroid(ring);
      const rec = { name: `MU-${String(i + 1).padStart(2, "0")}`, level, areaHa, lat, lng, props };
      const layer = L.polygon(ring.map(([lo, la]) => [la, lo]), Object.assign(baseStyle(level), { renderer }));
      layer.on("mouseover", () => { if (layer !== selectedLayer) layer.setStyle({ fillOpacity: 0.75 }); });
      layer.on("mouseout", () => { if (layer !== selectedLayer) layer.setStyle(baseStyle(level)); });
      layer.on("click", () => {
        selectLayer(layer);
        layer.bindPopup(popupHtml(rec), { closeButton: true, offset: [0, 2] }).openPopup();
      });
      levelGroups[level].addLayer(layer);
      counts[level]++;
      rec.layer = layer;
      featureRecords.push(rec);
    });

    renderLegend(counts);
    renderRegister();
    updateReadouts();

    const bounds = L.geoJSON({ type: "FeatureCollection", features: feats }).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [26, 26], maxZoom: 15 });
  }

  /* ---------------- explanation / legend ---------------- */

  const eyeOpen = '<svg width="15" height="15" viewBox="0 0 15 15"><path d="M.8 7.5S3 3.2 7.5 3.2 14.2 7.5 14.2 7.5 12 11.8 7.5 11.8.8 7.5.8 7.5Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7.5" cy="7.5" r="1.9" fill="currentColor"/></svg>';
  const eyeShut = '<svg width="15" height="15" viewBox="0 0 15 15"><path d="M.8 7.5S3 3.2 7.5 3.2 14.2 7.5 14.2 7.5 12 11.8 7.5 11.8.8 7.5.8 7.5Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".45"/><path d="M2.5 12.5 12.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  function legendRows() {
    const rows = legend.map((l, i) => ({ ...l, code: `MU-${i + 1}` }));
    if (featureRecords.some((r) => r.level === UNKNOWN_LEVEL)) rows.push({ level: UNKNOWN_LEVEL, color: "#94a3b8", pattern: "none", code: "—" });
    return rows;
  }

  function renderLegend(counts) {
    el.muList.innerHTML = "";
    legendRows().forEach((l) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mu-toggle";
      btn.setAttribute("aria-pressed", hiddenLevels.has(l.level) ? "false" : "true");
      const bg = l.pattern && l.pattern !== "none" ? patternOf[l.level] : l.color;
      btn.innerHTML = `
        <span class="mu-swatch" style="background:${bg};background-size:100% 100%"></span>
        <span class="mu-code">${l.code}</span>
        <span class="mu-name">${l.level}</span>
        <span class="mu-count">${counts && counts[l.level] != null ? counts[l.level] : ""}</span>
        <span class="mu-eye">${hiddenLevels.has(l.level) ? eyeShut : eyeOpen}</span>`;
      btn.addEventListener("click", () => toggleLevel(l.level));
      li.appendChild(btn);
      el.muList.appendChild(li);
    });
  }

  function toggleLevel(level) {
    if (hiddenLevels.has(level)) hiddenLevels.delete(level);
    else hiddenLevels.add(level);
    const group = levelGroups[level];
    if (group) {
      if (hiddenLevels.has(level)) map.removeLayer(group);
      else group.addTo(map);
    }
    renderLegend(currentCounts());
    updateShowAll();
  }

  function currentCounts() {
    const counts = {};
    legendRows().forEach((l) => (counts[l.level] = 0));
    featureRecords.forEach((r) => { if (counts[r.level] != null) counts[r.level]++; });
    return counts;
  }

  function updateShowAll() { el.legendAll.hidden = hiddenLevels.size === 0; }

  /* ---------------- field register ---------------- */

  function renderRegister() {
    el.regList.innerHTML = "";
    const total = featureRecords.length;
    el.regCount.textContent = total ? `${total.toLocaleString()} units` : "";
    if (!total) {
      el.regList.innerHTML = '<li class="reg-empty">No field polygons in this run.</li>';
      return;
    }
    const CAP = 200; // real runs emit thousands of units; render a scrollable subset
    featureRecords.slice(0, CAP).forEach((rec) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reg-row";
      const bg = patternOf[rec.level] || colorOf[rec.level] || "#94a3b8";
      btn.innerHTML = `
        <span class="reg-dot" style="background:${bg};background-size:100% 100%"></span>
        <span class="reg-id">${rec.name}</span>
        <span class="reg-lvl">${rec.level}</span>
        <span class="reg-ha">${fmtHa(rec.areaHa)} ha</span>`;
      btn.addEventListener("click", () => {
        if (hiddenLevels.has(rec.level)) toggleLevel(rec.level);
        const b = rec.layer.getBounds();
        map.setView(b.getCenter(), Math.max(map.getZoom(), 14));
        selectLayer(rec.layer);
        rec.layer.bindPopup(popupHtml(rec), { closeButton: true, offset: [0, 2] }).openPopup();
      });
      li.appendChild(btn);
      el.regList.appendChild(li);
    });
    if (total > CAP) {
      const li = document.createElement("li");
      li.className = "reg-empty";
      li.textContent = `Showing first ${CAP.toLocaleString()} of ${total.toLocaleString()} map-units \u00b7 all plotted on the plate`;
      el.regList.appendChild(li);
    }
  }

  /* ---------------- provenance ---------------- */

  function applySource(meta) {
    if (!meta) { el.srcAoi.textContent = "Betul (metadata.json not found)"; return; }
    if (meta.aoi) el.srcAoi.textContent = meta.aoi;
    const dates = Array.isArray(meta.acquisition_dates) ? meta.acquisition_dates : [];
    el.srcDates.textContent = dates.length ? dates.join(", ") : "— run backend —";
    el.srcScenes.textContent = meta.scenes_used != null ? String(meta.scenes_used) : "—";
    if (el.srcPixel) el.srcPixel.textContent = meta.pixel_metres != null ? `${meta.pixel_metres} m` : "—";
    if (el.srcRms) el.srcRms.textContent = meta.geolocation_rms_m != null ? `±${meta.geolocation_rms_m} m RMS` : "—";
    if (meta.generated_at) {
      const d = new Date(meta.generated_at);
      el.srcGen.textContent = isNaN(d) ? String(meta.generated_at) : d.toISOString().slice(0, 16).replace("T", " ") + "Z";
      el.tbDate.textContent = isNaN(d) ? String(meta.generated_at).slice(0, 10) : d.toISOString().slice(0, 10);
    } else {
      el.srcGen.textContent = "—";
    }
  }

  /* ---------------- quick-look ---------------- */

  function wireQuicklook() {
    el.btnQuicklook.addEventListener("click", async () => {
      el.overlay.hidden = false;
      el.qlClose.focus();
      const url = `${baseUrl}/${PNG_FILE}?v=${Date.now()}`;
      try {
        const resp = await fetch(url, { method: "GET", cache: "no-store" });
        if (!resp.ok) throw new Error(String(resp.status));
        el.qlImg.src = url;
        el.qlImg.style.visibility = "visible";
      } catch (_) {
        el.qlImg.style.visibility = "hidden";
        showNotice({
          title: "Quick-look unavailable",
          body: `${PNG_FILE} was not found in the output folder — run the backend first.`,
          missing: [PNG_FILE],
        });
        closeOverlay();
      }
    });
    el.overlay.addEventListener("click", (e) => { if (e.target === el.overlay) closeOverlay(); });
    el.qlClose.addEventListener("click", closeOverlay);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !el.overlay.hidden) closeOverlay(); });
  }

  function closeOverlay() { el.overlay.hidden = true; el.btnQuicklook.focus(); }

  /* ---------------- notice (missing / failed) ---------------- */

  function showNotice({ title, body, missing }) {
    el.noticeTitle.textContent = title;
    el.noticeBody.textContent = body;
    el.noticeFiles.innerHTML = "";
    for (const f of (missing || [])) {
      const li = document.createElement("li");
      li.textContent = `output/${f}`;
      el.noticeFiles.appendChild(li);
    }
    el.notice.hidden = false;
  }

  function hideNotice() { el.notice.hidden = true; }

  /* ---------------- boot ---------------- */

  async function boot() {
    if (!window.L) {
      showNotice({
        title: "Map library unavailable",
        body: "Leaflet could not be loaded — check the network connection, or vendor leaflet.js into frontend/ for offline demos.",
        missing: [],
      });
      return;
    }
    hideNotice();
    if (!map) initMap();
    baseUrl = await resolveBaseUrl();
    el.btnDownload.href = `${baseUrl}/${GEOJSON_FILE}`;
    el.btnDownload.setAttribute("download", GEOJSON_FILE);

    let meta = null, legendData = null;
    try { meta = await fetchJson(`${baseUrl}/metadata.json`); } catch (_) { /* optional */ }
    try {
      legendData = await fetchJson(`${baseUrl}/legend.json`);
      if (Array.isArray(legendData.stress_levels) && legendData.stress_levels.length) {
        legend = legendData.stress_levels.map((l, i) => ({
          level: l.level, color: l.color,
          pattern: (DEFAULT_LEGEND[i] && DEFAULT_LEGEND[i].pattern) || "hlines",
        }));
      }
    } catch (_) { /* optional */ }
    colorOf = Object.fromEntries(legend.map((l) => [l.level, l.color]));
    patternOf = Object.fromEntries(legend.map((l) => [l.level, patSvg(l.pattern || "hlines", l.color)]));
    applySource(meta);
    renderLegend(null);
    renderRegister();

    try {
      const fc = await loadFields();
      renderFields(fc);
    } catch (_) {
      showNotice({
        title: "Results are not ready yet",
        body: "The sheet could not load the field classification. Generate it first, then re-survey:",
        missing: [GEOJSON_FILE],
      });
    }
  }

  /* ---------------- wire + go ---------------- */

  el.legendAll.addEventListener("click", () => { [...hiddenLevels].forEach((lv) => toggleLevel(lv)); });
  el.noticeRetry.addEventListener("click", boot);
  wireQuicklook();

  const mq = window.matchMedia("(max-width: 900px)");
  const onResize = () => { if (map) setTimeout(() => map.invalidateSize(), 60); };
  if (mq.addEventListener) mq.addEventListener("change", onResize);
  window.addEventListener("resize", onResize);

  boot();
})();
