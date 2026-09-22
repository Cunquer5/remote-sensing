const BASE_URL = "http://localhost:5000";

// --------------------------------------------------
// Login
// --------------------------------------------------

async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  return await response.json();
}

// --------------------------------------------------
// Authenticated API request
// --------------------------------------------------

async function apiRequest(endpoint, token) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return {
    status: response.status,
    data: await response.json()
  };
}

// --------------------------------------------------
// Main test
// --------------------------------------------------

async function runTests() {

  console.log("======================================");
  console.log(" ROLE-BASED ACCESS TEST");
  console.log("======================================");

  // ----------------------------------------
  // ADMIN LOGIN
  // ----------------------------------------

  const admin = await login(
    "admin@sugarcane.local",
    "Admin@123"
  );

  console.log("\nADMIN LOGIN:");
  console.log(admin.user);

  // Admin → all fields
  const adminFields = await apiRequest(
    "/api/admin/fields",
    admin.token
  );

  console.log("\nADMIN → ALL FIELDS");
  console.log("HTTP Status:", adminFields.status);
  console.log(
    adminFields.data.map(field => field.field_id)
  );

  // Admin → statistics
  const adminStats = await apiRequest(
    "/api/admin/stats",
    admin.token
  );

  console.log("\nADMIN → STATISTICS");
  console.log("HTTP Status:", adminStats.status);
  console.log(adminStats.data);


  // ----------------------------------------
  // FARMER LOGIN
  // ----------------------------------------

  const farmer = await login(
    "farmer1@sugarcane.local",
    "Farmer@123"
  );

  console.log("\nFARMER LOGIN:");
  console.log(farmer.user);

  // Farmer → own fields
  const farmerFields = await apiRequest(
    "/api/farmer/fields",
    farmer.token
  );

  console.log("\nFARMER → OWN FIELDS");
  console.log("HTTP Status:", farmerFields.status);
  console.log(
    farmerFields.data.map(field => field.field_id)
  );


  // ----------------------------------------
  // SECURITY TEST
  // ----------------------------------------

  const farmerTryingAdmin = await apiRequest(
    "/api/admin/fields",
    farmer.token
  );

  console.log("\nFARMER → ADMIN API");
  console.log("HTTP Status:", farmerTryingAdmin.status);
  console.log(farmerTryingAdmin.data);


  console.log("\n======================================");
  console.log(" TEST COMPLETED");
  console.log("======================================");
}

runTests().catch(error => {
  console.error("\nTEST FAILED");
  console.error(error);
});