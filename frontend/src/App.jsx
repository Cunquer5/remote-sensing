import "./App.css";
import StressMap from "./components/StressMap";

function App() {
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Sugarcane Water Stress Monitor</h1>
          <p>Remote sensing based crop water-stress analysis</p>
        </div>

        <div className="location">
          📍 Betul
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard">

        {/* Summary Cards */}
        <section className="summary">

          <div className="stat-card">
            <span>Total Fields</span>
            <strong>247</strong>
          </div>

          <div className="stat-card">
            <span>Very Low</span>
            <strong>42</strong>
          </div>

          <div className="stat-card">
            <span>Medium</span>
            <strong>63</strong>
          </div>

          <div className="stat-card">
            <span>High / Very High</span>
            <strong>71</strong>
          </div>

        </section>

        {/* Map + Side Panel */}
        <section className="content-grid">

          {/* Interactive Leaflet Map */}
          <div className="map-card">

            <div className="card-header">
              <div>
                <h2>Water Stress Map</h2>
                <p>Sugarcane field-level classification</p>
              </div>
            </div>

            <div className="map-container">
              <StressMap />
            </div>

          </div>

          {/* Right Side Panel */}
          <aside className="side-panel">

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
                <strong>3</strong>
              </div>
            </div>

          </aside>

        </section>

        {/* PNG Stress Map */}
        <section className="preview-card">

          <div>
            <h2>Satellite Stress Map</h2>
            <p>
              Satellite-derived visualization of crop water stress.
            </p>
          </div>

          <div className="png-preview">
            <img
              src="/output/betul_stress_map.png"
              alt="Betul sugarcane water stress map"
            />
          </div>

          <button>
            Download GeoJSON
          </button>

        </section>

      </main>

    </div>
  );
}

export default App;