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