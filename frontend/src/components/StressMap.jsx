import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { STRESS_LEVELS } from "../data/stressConfig";

function StressMap() {

  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch("/output/betul_sugarcane_fields.geojson")

      .then((response) => {

        if (!response.ok) {
          throw new Error("GeoJSON file could not be loaded.");
        }

        return response.json();
      })

      .then((data) => {
        setGeoData(data);
      })

      .catch((err) => {
        setError(err.message);
      });

  }, []);


  const styleFeature = (feature) => {

    const stressLevel =
      feature?.properties?.stress_level;

    const color =
      STRESS_LEVELS[stressLevel]?.color || "#6b7280";

    return {
      color: "#ffffff",
      weight: 1,
      fillColor: color,
      fillOpacity: 0.7
    };
  };


  if (error) {

    return (
      <div className="map-error">
        <strong>Results not yet ready</strong>
        <p>{error}</p>
      </div>
    );

  }


  if (!geoData) {

    return (
      <div className="map-loading">
        Loading sugarcane field data...
      </div>
    );

  }


  return (
    <MapContainer
      center={[21.3, 77.9]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >

      <TileLayer
  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>

      <GeoJSON
        data={geoData}
        style={styleFeature}

        onEachFeature={(feature, layer) => {

          const properties =
            feature.properties || {};

          layer.bindPopup(`
            <strong>Water Stress</strong><br/>
            Stress Level:
            ${properties.stress_level || "Unknown"}<br/>
            Cluster:
            ${properties.cluster_id ?? "N/A"}<br/>
            Area:
            ${properties.area ?? "N/A"}
          `);

        }}
      />

    </MapContainer>
  );
}

export default StressMap;