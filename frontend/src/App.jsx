import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import StressMap from "./components/StressMap";

function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === "admin";

  return (
    <div className="app">

      {/* Header */}
      <header className="header">

        <div>
          <h1>
            {isAdmin
              ? "Admin Monitoring Portal"
              : "Farmer Field Portal"}
          </h1>

          <p>
            Sugarcane water-stress monitoring and field intelligence
          </p>
        </div>

        <div className="header-actions">

          <div className="location">
            📍 Betul
          </div>

          <div className="user-badge">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
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

          <div>
            <span className="portal-label">
              {isAdmin ? "ADMIN PORTAL" : "FARMER PORTAL"}
            </span>

            <h1 className="welcome-title">
              Welcome, {user.name}
            </h1>

            <p>
              {isAdmin
                ? "Monitor sugarcane water stress across all registered fields."
                : "View the water-stress condition of your registered fields."}
            </p>
          </div>

        </section>

        {/* Summary Cards */}
        <section className="summary">

          <div className="stat-card">
            <span>
              {isAdmin ? "Total Fields" : "My Fields"}
            </span>

            <strong>
              {isAdmin ? "247" : "3"}
            </strong>
          </div>

          <div className="stat-card">
            <span>Very Low</span>
            <strong>{isAdmin ? "42" : "1"}</strong>
          </div>

          <div className="stat-card">
            <span>Medium</span>
            <strong>{isAdmin ? "63" : "1"}</strong>
          </div>

          <div className="stat-card">
            <span>High / Very High</span>
            <strong>{isAdmin ? "71" : "1"}</strong>
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