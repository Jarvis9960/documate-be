const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createAdmin,
  loginAdmin,
  verifyOTP,
  logoutAdmin,
  getAdminProfile,
  getAllAdmins, // Import the getAllAdmins controller
  updateAdminRole, // Import the updateAdminRole controller
} = require("../Controller/AdminController");
const protectRoute = require("../Middlewares/ProtectedRoute");

// Validation middleware for createAdmin route
const createAdminValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "superadmin"])
    .withMessage("Role must be either admin or superadmin"),
];

// Public routes (no authentication required)
router.post("/login", loginAdmin);
// router.post('/verify-otp', otpValidation, verifyOTP);

// Protected routes (authentication required)
router.use(protectRoute); // Apply protectRoute middleware to all routes below
router.post("/create", createAdminValidation, createAdmin);
router.post("/logout", logoutAdmin);
router.get("/profile", getAdminProfile);
router.get("/all", getAllAdmins); // Add the route for fetching all admins
router.put("/:id/role", protectRoute, updateAdminRole); // Update admin role route

module.exports = router;
