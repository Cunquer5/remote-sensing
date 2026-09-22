const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// --------------------------------------------------
// Database location
// --------------------------------------------------

const dataDirectory = path.join(__dirname, "../data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const dbPath = path.join(dataDirectory, "sugarcane.db");

const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// --------------------------------------------------
// Create tables
// --------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'farmer')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT UNIQUE NOT NULL,
    farmer_id INTEGER,
    area REAL,
    stress_level TEXT NOT NULL,
    cluster_id INTEGER,
    latitude REAL,
    longitude REAL,
    FOREIGN KEY (farmer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sar_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    image_name TEXT NOT NULL,
    image_path TEXT,
    acquisition_date TEXT,
    satellite TEXT,
    polarization TEXT,
    FOREIGN KEY (field_id) REFERENCES fields(id)
  );
`);

module.exports = db;