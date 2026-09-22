const express = require("express");

const db = require("../db");

const {
  authenticateToken,
  requireAdmin
} = require("../middleware/auth");

const router = express.Router();

// --------------------------------------------------
// Admin dashboard statistics
// --------------------------------------------------

router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  (req, res) => {

    const totalFields = db
      .prepare("SELECT COUNT(*) AS count FROM fields")
      .get().count;

    const veryLow = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE stress_level = ?"
      )
      .get("Very Low").count;

    const low = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE stress_level = ?"
      )
      .get("Low").count;

    const medium = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE stress_level = ?"
      )
      .get("Medium").count;

    const high = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE stress_level = ?"
      )
      .get("High").count;

    const veryHigh = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE stress_level = ?"
      )
      .get("Very High").count;

    const totalFarmers = db
      .prepare(
        "SELECT COUNT(*) AS count FROM users WHERE role = 'farmer'"
      )
      .get().count;

    res.json({
      totalFields,
      totalFarmers,
      stress: {
        veryLow,
        low,
        medium,
        high,
        veryHigh
      }
    });
  }
);

// --------------------------------------------------
// Get ALL fields
// Admin only
// --------------------------------------------------

router.get(
  "/fields",
  authenticateToken,
  requireAdmin,
  (req, res) => {

    const fields = db.prepare(`
      SELECT
        fields.*,
        users.name AS farmer_name,
        users.email AS farmer_email
      FROM fields
      LEFT JOIN users
        ON fields.farmer_id = users.id
      ORDER BY fields.id
    `).all();

    res.json(fields);
  }
);

// --------------------------------------------------
// Get ALL SAR images
// Admin only
// --------------------------------------------------

router.get(
  "/sar-images",
  authenticateToken,
  requireAdmin,
  (req, res) => {

    const images = db.prepare(`
      SELECT
        sar_images.*,
        fields.field_id,
        users.name AS farmer_name
      FROM sar_images
      JOIN fields
        ON sar_images.field_id = fields.id
      LEFT JOIN users
        ON fields.farmer_id = users.id
      ORDER BY sar_images.acquisition_date DESC
    `).all();

    res.json(images);
  }
);

module.exports = router;