import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import StressMap from "./components/StressMap";

function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === "admin";
    const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

    useEffect(() => {

    const fetchStats = async () => {

      try {

        setStatsLoading(true);
        setStatsError("");

        const token = localStorage.getItem("sugarcane_token");

        const endpoint = isAdmin
          ? "/api/admin/stats"
          : "/api/farmer/stats";

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Unable to load dashboard statistics");
        }

        const data = await response.json();

        setStats(data);

      } catch (error) {

        console.error("Statistics error:", error);

        setStatsError(
          "Unable to load live statistics."
        );

      } finally {

        setStatsLoading(false);

      }

    };

    fetchStats();

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
              <StressMap />
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