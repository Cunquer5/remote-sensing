import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { STRESS_LEVELS } from "../data/stressConfig";

function FitMapToFields({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData?.features?.length) {
      return;
    }

    const coordinates = [];

    geoData.features.forEach((feature) => {
      const geometry = feature.geometry;

      if (!geometry) {
        return;
      }

      if (geometry.type === "Polygon") {
        geometry.coordinates.forEach((ring) => {
          ring.forEach(([longitude, latitude]) => {
            coordinates.push([latitude, longitude]);
          });
        });
      }

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach(([longitude, latitude]) => {
              coordinates.push([latitude, longitude]);
            });
          });
        });
      }
    });

    if (coordinates.length > 0) {
      map.fitBounds(coordinates, {
        padding: [24, 24],
        maxZoom: 15
      });
    }
  }, [geoData, map]);

  return null;
}

function StressMap({ onFieldSelect }) {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setError(null);

        const token = localStorage.getItem("sugarcane_token");
        const user = JSON.parse(
          localStorage.getItem("sugarcane_user")
        );

        if (!token || !user) {
          throw new Error("User session not found.");
        }

        // --------------------------------------------------
        // 1. Get authorized fields from backend
        // --------------------------------------------------

        const endpoint =
          user.role === "admin"
            ? "/api/admin/fields"
            : "/api/farmer/fields";

        const fieldResponse = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!fieldResponse.ok) {
          throw new Error("Unable to load authorized field data.");
        }

        const fields = await fieldResponse.json();

        // --------------------------------------------------
        // 2. Load polygon geometry
        // --------------------------------------------------

        const geoResponse = await fetch(
          "/output/betul_sugarcane_fields.geojson"
        );

        if (!geoResponse.ok) {
          throw new Error("Field map geometry could not be loaded.");
        }

        const geometry = await geoResponse.json();

        // --------------------------------------------------
        // 3. Keep only fields authorized by the backend
        // --------------------------------------------------

        const authorizedFieldIds = new Set(
          fields.map((field) => field.field_id)
        );

        const authorizedFeatures =
          geometry.features.filter((feature) => {
            const fieldId = feature?.properties?.field_id;
            return authorizedFieldIds.has(fieldId);
          });

        // --------------------------------------------------
        // 4. Merge backend data into map features
        // --------------------------------------------------

        const fieldMap = new Map(
          fields.map((field) => [field.field_id, field])
        );

        const enrichedFeatures = authorizedFeatures.map((feature) => {
          const fieldId = feature?.properties?.field_id;
          const backendField = fieldMap.get(fieldId);

          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...backendField
            }
          };
        });

        setGeoData({
          type: "FeatureCollection",
          features: enrichedFeatures
        });
      } catch (err) {
        console.error("Map data error:", err);
        setError(err.message);
      }
    };

    loadMapData();
  }, []);

  // --------------------------------------------------
  // Stress-based polygon styling
  // --------------------------------------------------

  const styleFeature = (feature) => {
    const stressLevel =
      feature?.properties?.stress_level;

    const color =
      STRESS_LEVELS[stressLevel]?.color || "#6b7280";

    return {
      color: "#ffffff",
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.7
    };
  };

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (error) {
    return (
      <div className="map-error">
        <strong>Unable to load field map</strong>
        <p>{error}</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (!geoData) {
    return (
      <div className="map-loading">
        Loading authorized field data...
      </div>
    );
  }

  // --------------------------------------------------
  // Map
  // --------------------------------------------------

  return (
    <MapContainer
      center={[21.3, 77.9]}
      zoom={12}
      style={{
        height: "500px",
        width: "100%"
      }}
    >
        <FitMapToFields geoData={geoData} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <GeoJSON
        data={geoData}
        style={styleFeature}
        onEachFeature={(feature, layer) => {
  const properties = feature.properties || {};

  const fieldId = properties.field_id || "Field";

  const stressLevel =
    properties.stress_level || "Unknown";

  const stressConfig =
    STRESS_LEVELS[stressLevel];

  const stressDescription =
    stressConfig?.description ||
    "Stress information unavailable";

  layer.bindPopup(`
    <div style="min-width: 210px;">
      <strong style="font-size: 16px;">
        ${fieldId}
      </strong>

      <br/><br/>

      <strong>Water Stress</strong><br/>

      <span style="
        display: inline-block;
        margin-top: 5px;
        padding: 4px 9px;
        border-radius: 999px;
        background: ${stressConfig?.color || "#6b7280"};
        color: white;
        font-weight: 700;
      ">
        ${stressLevel}
      </span>

      <br/><br/>

      Cluster:
      ${properties.cluster_id ?? "N/A"}<br/>

      Area:
      ${properties.area ?? "N/A"} acres<br/>

      Location:
      ${properties.latitude ?? "N/A"},
      ${properties.longitude ?? "N/A"}

      <br/><br/>

      <span style="color: #4f665b;">
        ${stressDescription}
      </span>
    </div>
  `);

  layer.on({
    mouseover: (event) => {
      if (selectedFieldId !== fieldId) {
        event.target.setStyle({
          weight: 3,
          fillOpacity: 0.85
        });
      }
    },

    mouseout: (event) => {
      if (selectedFieldId !== fieldId) {
        event.target.setStyle(
          styleFeature(feature)
        );
      }
    },

    click: (event) => {
      setSelectedFieldId(fieldId);

      event.target.setStyle({
        color: "#123c2a",
        weight: 4,
        fillOpacity: 0.9
      });

      if (onFieldSelect) {
        onFieldSelect({
          ...properties,
          stressColor:
            stressConfig?.color || "#6b7280",
          stressDescription
        });
      }
    }
  });
}}
      />
    </MapContainer>
  );
}

export default StressMap;
