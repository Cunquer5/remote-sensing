const express = require("express");

const db = require("../db");

const {
  authenticateToken,
  requireFarmer
} = require("../middleware/auth");

const router = express.Router();

// --------------------------------------------------
// Farmer's own fields
// --------------------------------------------------

router.get(
  "/fields",
  authenticateToken,
  requireFarmer,
  (req, res) => {

    const fields = db.prepare(`
      SELECT *
      FROM fields
      WHERE farmer_id = ?
      ORDER BY id
    `).all(req.user.id);

    res.json(fields);
  }
);

// --------------------------------------------------
// Farmer's own SAR images
// --------------------------------------------------

router.get(
  "/sar-images",
  authenticateToken,
  requireFarmer,
  (req, res) => {

    const images = db.prepare(`
      SELECT
        sar_images.*,
        fields.field_id,
        fields.stress_level
      FROM sar_images
      JOIN fields
        ON sar_images.field_id = fields.id
      WHERE fields.farmer_id = ?
      ORDER BY sar_images.acquisition_date DESC
    `).all(req.user.id);

    res.json(images);
  }
);

// --------------------------------------------------
// Farmer dashboard statistics
// --------------------------------------------------

router.get(
  "/stats",
  authenticateToken,
  requireFarmer,
  (req, res) => {

    const totalFields = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ?"
      )
      .get(req.user.id).count;

    const veryLow = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ? AND stress_level = ?"
      )
      .get(req.user.id, "Very Low").count;

    const low = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ? AND stress_level = ?"
      )
      .get(req.user.id, "Low").count;

    const medium = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ? AND stress_level = ?"
      )
      .get(req.user.id, "Medium").count;

    const high = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ? AND stress_level = ?"
      )
      .get(req.user.id, "High").count;

    const veryHigh = db
      .prepare(
        "SELECT COUNT(*) AS count FROM fields WHERE farmer_id = ? AND stress_level = ?"
      )
      .get(req.user.id, "Very High").count;

    res.json({
      totalFields,
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
// Farmer dashboard
// --------------------------------------------------

router.get(
  "/dashboard",
  authenticateToken,
  requireFarmer,
  (req, res) => {

    const fields = db.prepare(`
      SELECT *
      FROM fields
      WHERE farmer_id = ?
    `).all(req.user.id);

    res.json({
      farmer: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      fields
    });
  }
);

module.exports = router;