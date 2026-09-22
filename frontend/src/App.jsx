import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import StressMap from "./components/StressMap";

function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === "admin";
const [selectedField, setSelectedField] = useState(null);
const [stats, setStats] = useState(null);
const [fields, setFields] = useState([]);
const [statsLoading, setStatsLoading] = useState(true);
const [statsError, setStatsError] = useState("");

    useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const token = localStorage.getItem("sugarcane_token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const statsEndpoint = isAdmin
        ? "/api/admin/stats"
        : "/api/farmer/stats";

      const fieldsEndpoint = isAdmin
        ? "/api/admin/fields"
        : "/api/farmer/fields";

      const [statsResponse, fieldsResponse] =
        await Promise.all([
          fetch(statsEndpoint, { headers }),
          fetch(fieldsEndpoint, { headers })
        ]);

      if (!statsResponse.ok) {
        throw new Error(
          "Unable to load dashboard statistics."
        );
      }

      if (!fieldsResponse.ok) {
        throw new Error(
          "Unable to load authorized field data."
        );
      }

      const statsData = await statsResponse.json();
      const fieldsData = await fieldsResponse.json();

      setStats(statsData);
      setFields(fieldsData);

    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );

      setStatsError(
        "Unable to load live dashboard data."
      );

    } finally {
      setStatsLoading(false);
    }
  };

  fetchDashboardData();
}, [isAdmin]);

  return (
    <div className="app">

      {/* Header */}
      <header className="header">

  <div className="brand-section">

    <div className="brand-icon">
      🌱
    </div>

    <div className="brand-text">
      <h1>Sugarcane Intelligence</h1>

      <p>
        Remote sensing &nbsp;•&nbsp; Water stress monitoring
      </p>
    </div>

  </div>


  <div className="header-actions">

    <div className="location-badge">
      <span className="location-icon">📍</span>
      <div>
        <span className="badge-label">LOCATION</span>
        <strong>Betul</strong>
      </div>
    </div>


    <div className="user-profile">

      <div className="user-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="user-info">

        <strong>{user.name}</strong>

        <span>
          {isAdmin ? "Administrator" : "Farmer"}
        </span>

      </div>

    </div>


    <button
      className="logout-button"
      onClick={onLogout}
    >
      Sign out
    </button>

  </div>

</header>

      {/* Main Dashboard */}
      <main className="dashboard">

        {/* Welcome */}
        <section className="welcome-section">

  <div className="welcome-content">

    <div className="welcome-label-row">

      <span className="portal-label">
        {isAdmin ? "ADMIN PORTAL" : "FARMER PORTAL"}
      </span>

      <span className="system-status">
        <span className="status-dot"></span>
        SAR MONITORING ACTIVE
      </span>

    </div>


    <h1 className="welcome-title">
      Welcome, {user.name}
    </h1>


    <p className="welcome-description">
      {isAdmin
        ? "Monitor sugarcane water stress across registered fields in Betul using remote sensing and SAR-based field intelligence."
        : "Monitor the water-stress condition of your registered sugarcane fields and identify areas that may require attention."
      }
    </p>


    <div className="welcome-meta">

      <div className="meta-item">
        <span className="meta-icon">🛰️</span>

        <div>
          <span className="meta-label">
            MONITORING SOURCE
          </span>

          <strong>
            SAR Remote Sensing
          </strong>
        </div>
      </div>


      <div className="meta-divider"></div>


      <div className="meta-item">
        <span className="meta-icon">📍</span>

        <div>
          <span className="meta-label">
            MONITORING AREA
          </span>

          <strong>
            Betul, Madhya Pradesh
          </strong>
        </div>
      </div>

    </div>

  </div>


  <div className="welcome-visual">

    <div className="radar-circle radar-circle-1"></div>
    <div className="radar-circle radar-circle-2"></div>
    <div className="radar-circle radar-circle-3"></div>

    <div className="radar-center">
      🛰️
    </div>

  </div>

</section>

        {/* Summary Cards */}
        <section className="summary">

          <div className="stat-card">
  <span>
    {isAdmin ? "Total Fields" : "My Fields"}
  </span>

  <strong>
    {statsLoading
      ? "—"
      : stats
        ? stats.totalFields
        : "—"}
  </strong>
</div>


<div className="stat-card">
  <span>Very Low</span>

  <strong>
    {statsLoading
      ? "—"
      : stats
        ? stats.stress.veryLow
        : "—"}
  </strong>
</div>


<div className="stat-card">
  <span>Medium</span>

  <strong>
    {statsLoading
      ? "—"
      : stats
        ? stats.stress.medium
        : "—"}
  </strong>
</div>


<div className="stat-card">
  <span>High / Very High</span>

  <strong>
    {statsLoading
      ? "—"
      : stats
        ? stats.stress.high + stats.stress.veryHigh
        : "—"}
  </strong>
</div>

        </section>

{/* Field Intelligence */}
<section className="intelligence-section">

  <div className="intelligence-header">
    <div>
      <span className="section-kicker">
        {isAdmin
          ? "REGIONAL FIELD INTELLIGENCE"
          : "MY FIELD INTELLIGENCE"}
      </span>

      <h2>
        Water Stress Overview
      </h2>

      <p>
        {isAdmin
          ? "A quick overview of monitored fields and areas requiring attention."
          : "A quick overview of your monitored fields and areas requiring attention."}
      </p>
    </div>
  </div>


  <div className="intelligence-grid">

    {/* Overview */}
    <div className="intelligence-card overview-card">

      <div className="intelligence-card-title">
        <span className="intelligence-icon">
          🌱
        </span>

        <div>
          <span>FIELDS MONITORED</span>

          <strong>
            {statsLoading
              ? "—"
              : stats?.totalFields ?? "—"}
          </strong>
        </div>
      </div>


      <div className="intelligence-mini-grid">

        <div>
          <span>Need Attention</span>

          <strong>
            {statsLoading || !stats
              ? "—"
              : stats.stress.high +
                stats.stress.veryHigh}
          </strong>
        </div>


        <div>
          <span>Very High</span>

          <strong>
            {statsLoading || !stats
              ? "—"
              : stats.stress.veryHigh}
          </strong>
        </div>


        {isAdmin && (
          <div>
            <span>Farmers</span>

            <strong>
              {statsLoading || !stats
                ? "—"
                : stats.totalFarmers}
            </strong>
          </div>
        )}

      </div>

    </div>


    {/* Stress Distribution */}
    <div className="intelligence-card distribution-card">

      <div className="intelligence-card-heading">
        <span>STRESS DISTRIBUTION</span>
      </div>


      <div className="stress-distribution">

        {[
          ["Very Low", "veryLow", "very-low"],
          ["Low", "low", "low"],
          ["Medium", "medium", "medium"],
          ["High", "high", "high"],
          ["Very High", "veryHigh", "very-high"]
        ].map(
          ([label, key, colorClass]) => {

            const count =
              stats?.stress?.[key] ?? 0;

            const total =
              stats?.totalFields || 1;

            const width =
              `${Math.max(
                (count / total) * 100,
                count > 0 ? 8 : 0
              )}%`;

            return (
              <div
                className="distribution-row"
                key={key}
              >

                <div className="distribution-label">
                  <span>
                    <span
                      className={`legend-dot ${colorClass}`}
                    ></span>

                    {label}
                  </span>

                  <strong>
                    {statsLoading ? "—" : count}
                  </strong>
                </div>


                <div className="distribution-track">
                  <div
                    className={`distribution-bar ${colorClass}`}
                    style={{
                      width:
                        statsLoading
                          ? "0%"
                          : width
                    }}
                  ></div>
                </div>

              </div>
            );
          }
        )}

      </div>

    </div>


    {/* Attention Fields */}
    <div className="intelligence-card attention-card">

      <div className="intelligence-card-heading">
        <span>FIELDS REQUIRING ATTENTION</span>

        <span className="attention-count">
          {statsLoading || !stats
            ? "—"
            : stats.stress.high +
              stats.stress.veryHigh}
        </span>
      </div>


      {statsLoading ? (
        <div className="intelligence-empty">
          Loading field intelligence...
        </div>
      ) : fields.filter(
          (field) =>
            field.stress_level === "High" ||
            field.stress_level === "Very High"
        ).length === 0 ? (

        <div className="intelligence-empty">
          No fields currently require attention.
        </div>

      ) : (

        <div className="attention-list">

          {fields
            .filter(
              (field) =>
                field.stress_level === "High" ||
                field.stress_level === "Very High"
            )
            .sort((a, b) => {
              const severity = {
                "Very High": 2,
                "High": 1
              };

              return (
                severity[b.stress_level] -
                severity[a.stress_level]
              );
            })
            .map((field) => {

              const stressInfo =
                field.stress_level === "Very High"
                  ? "very-high"
                  : "high";

              return (
                <button
                  key={field.field_id}
                  className="attention-field"
                  onClick={() => {
                    setSelectedField({
                      ...field,
                      stressColor:
                        field.stress_level ===
                        "Very High"
                          ? "#c62828"
                          : "#ef6c00",
                      stressDescription:
                        field.stress_level ===
                        "Very High"
                          ? "Severe water stress"
                          : "Significant water stress",
                      description:
                        field.stress_level ===
                        "Very High"
                          ? "Severe water stress"
                          : "Significant water stress"
                    });
                  }}
                >

                  <div className="attention-field-main">

                    <strong>
                      {field.field_id}
                    </strong>

                    {isAdmin &&
                      field.farmer_name && (
                        <span>
                          {field.farmer_name}
                        </span>
                      )}

                  </div>


                  <div className="attention-field-meta">

                    <span
                      className={`attention-badge ${stressInfo}`}
                    >
                      {field.stress_level}
                    </span>

                    <span>
                      {field.area ?? "N/A"} acres
                    </span>

                  </div>

                </button>
              );
            })}

        </div>
      )}

    </div>

  </div>

</section>

        {/* Map + Side Panel */}
        <section className="content-grid">

          {/* Map */}
          <div className="map-card">

            <div className="card-header">

              <div>
                <h2>
                  {isAdmin
                    ? "Regional Water Stress Map"
                    : "My Field Stress Map"}
                </h2>

                <p>
                  {isAdmin
                    ? "Field-level water stress classification across the monitored area"
                    : "Water stress classification for your registered sugarcane fields"}
                </p>
              </div>

            </div>

            <div className="map-container">
  <StressMap onFieldSelect={setSelectedField} />
</div>

          </div>

          {/* Right Panel */}
          <aside className="side-panel">

            {/* Stress Legend */}
            <div className="card">

              <h2>Stress Levels</h2>

              <div className="legend-item">
                <span className="legend-dot very-low"></span>
                Very Low
              </div>

              <div className="legend-item">
                <span className="legend-dot low"></span>
                Low
              </div>

              <div className="legend-item">
                <span className="legend-dot medium"></span>
                Medium
              </div>

              <div className="legend-item">
                <span className="legend-dot high"></span>
                High
              </div>

              <div className="legend-item">
                <span className="legend-dot very-high"></span>
                Very High
              </div>

            </div>

            {/* SAR Information */}
            <div className="card">

              <h2>SAR Information</h2>

              <div className="info-row">
                <span>Location</span>
                <strong>Betul</strong>
              </div>

              <div className="info-row">
                <span>SAR Date</span>
                <strong>15 Mar 2024</strong>
              </div>

              <div className="info-row">
                <span>Scenes Used</span>
                <strong>{isAdmin ? "3" : "1"}</strong>
              </div>

              <div className="info-row">
                <span>Access</span>
                <strong>
                  {isAdmin ? "All Fields" : "Own Fields"}
                </strong>
              </div>

            </div>

          </aside>

        </section>

                {/* Selected Field Details */}
        {selectedField && (
          <section className="field-details-section">

            <div className="field-details-card">

              <div className="field-details-header">

                <div>
                  <span className="field-details-label">
                    SELECTED FIELD
                  </span>

                  <h2>
                    {selectedField.field_id}
                  </h2>
                </div>

                <button
                  className="field-details-close"
                  onClick={() => setSelectedField(null)}
                  aria-label="Close field details"
                >
                  ×
                </button>

              </div>


              <div className="field-details-grid">

                <div className="field-detail-item">
                  <span>Water Stress</span>

                  <strong
                    className="stress-value"
                    style={{
                      color:
                        selectedField.stressColor
                    }}
                  >
                    {selectedField.stress_level}
                  </strong>
                </div>


                <div className="field-detail-item">
                  <span>Area</span>

                  <strong>
                    {selectedField.area ?? "N/A"} acres
                  </strong>
                </div>


                <div className="field-detail-item">
                  <span>Cluster</span>

                  <strong>
                    {selectedField.cluster_id ?? "N/A"}
                  </strong>
                </div>


                <div className="field-detail-item">
                  <span>Latitude</span>

                  <strong>
                    {selectedField.latitude ?? "N/A"}
                  </strong>
                </div>


                <div className="field-detail-item">
                  <span>Longitude</span>

                  <strong>
                    {selectedField.longitude ?? "N/A"}
                  </strong>
                </div>


                {isAdmin && selectedField.farmer_name && (
                  <div className="field-detail-item">
                    <span>Farmer</span>

                    <strong>
                      {selectedField.farmer_name}
                    </strong>
                  </div>
                )}

              </div>


              <div className="field-condition">

                <span>Water Condition</span>

                <p>
                  {selectedField.description ||
                    "Stress information unavailable."}
                </p>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}


function App() {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("sugarcane_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("sugarcane_user");
      return null;
    }

  });


  const handleLogin = (userData) => {

    setUser(userData);

    localStorage.setItem(
      "sugarcane_user",
      JSON.stringify(userData)
    );

  };


  const handleLogout = () => {

    localStorage.removeItem("sugarcane_user");

    localStorage.removeItem("sugarcane_token");

    setUser(null);

  };


  if (!user) {

    return (
      <Login onLogin={handleLogin} />
    );

  }


  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );

}


export default App;