require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const db = require("./db");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const farmerRoutes = require("./routes/farmer");

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Sugarcane Water Stress API",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: "connected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerRoutes);

// --------------------------------------------------
// 404 handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found"
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log(" Sugarcane Water Stress Backend");
  console.log("======================================");
  console.log(` Server running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
  console.log("");
});