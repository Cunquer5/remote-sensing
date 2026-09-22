const bcrypt = require("bcryptjs");

const db = require("./db");

// --------------------------------------------------
// Demo users
// --------------------------------------------------

const adminPassword = bcrypt.hashSync(
  "Admin@123",
  10
);

const farmerPassword = bcrypt.hashSync(
  "Farmer@123",
  10
);

// --------------------------------------------------
// Insert users
// --------------------------------------------------

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users
  (name, email, password, role)
  VALUES (?, ?, ?, ?)
`);

insertUser.run(
  "System Administrator",
  "admin@sugarcane.local",
  adminPassword,
  "admin"
);

insertUser.run(
  "Ramesh Patil",
  "farmer1@sugarcane.local",
  farmerPassword,
  "farmer"
);

insertUser.run(
  "Suresh Sharma",
  "farmer2@sugarcane.local",
  farmerPassword,
  "farmer"
);

// --------------------------------------------------
// Get farmer IDs
// --------------------------------------------------

const farmer1 = db
  .prepare(
    "SELECT id FROM users WHERE email = ?"
  )
  .get("farmer1@sugarcane.local");

const farmer2 = db
  .prepare(
    "SELECT id FROM users WHERE email = ?"
  )
  .get("farmer2@sugarcane.local");

// --------------------------------------------------
// Insert fields
// --------------------------------------------------

const insertField = db.prepare(`
  INSERT OR IGNORE INTO fields
  (
    field_id,
    farmer_id,
    area,
    stress_level,
    cluster_id,
    latitude,
    longitude
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertField.run(
  "F001",
  farmer1.id,
  1.42,
  "Very Low",
  1,
  21.301,
  77.901
);

insertField.run(
  "F002",
  farmer1.id,
  1.87,
  "Low",
  1,
  21.301,
  77.903
);

insertField.run(
  "F003",
  farmer1.id,
  2.13,
  "Medium",
  2,
  21.301,
  77.906
);

insertField.run(
  "F004",
  farmer2.id,
  1.76,
  "High",
  2,
  21.303,
  77.901
);

insertField.run(
  "F005",
  farmer2.id,
  2.31,
  "Very High",
  3,
  21.303,
  77.903
);

insertField.run(
  "F006",
  farmer2.id,
  1.95,
  "Medium",
  3,
  21.303,
  77.906
);

// --------------------------------------------------
// Insert SAR image records
// --------------------------------------------------

const insertImage = db.prepare(`
  INSERT OR IGNORE INTO sar_images
  (
    field_id,
    image_name,
    image_path,
    acquisition_date,
    satellite,
    polarization
  )
  VALUES (?, ?, ?, ?, ?, ?)
`);

const fields = db.prepare(
  "SELECT id, field_id FROM fields"
).all();

for (const field of fields) {

  insertImage.run(
    field.id,
    `${field.field_id}_sar_demo.png`,
    `/output/${field.field_id}_sar_demo.png`,
    "2024-03-15",
    "Sentinel-1",
    "VV"
  );
}

console.log("Database seeded successfully.");

console.log("");
console.log("Demo accounts:");
console.log("--------------------------------------");
console.log("ADMIN");
console.log("Email: admin@sugarcane.local");
console.log("Password: Admin@123");
console.log("");
console.log("FARMER 1");
console.log("Email: farmer1@sugarcane.local");
console.log("Password: Farmer@123");
console.log("");
console.log("FARMER 2");
console.log("Email: farmer2@sugarcane.local");
console.log("Password: Farmer@123");
console.log("--------------------------------------");