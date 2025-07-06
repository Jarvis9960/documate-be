const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createClient,
  getClientProfile,
  getAllClients,
  updateClient,
  updateSubscription,
} = require("../Controller/ClientController");
const protectRoute = require("../Middlewares/ProtectedRoute");

// Validation middleware for creating a client
const createClientValidation = [
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("name").trim().notEmpty().withMessage("Client name is required"),
  body("gst").trim().notEmpty().withMessage("GST number is required"),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit mobile number"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

// Protected routes
router.use(protectRoute);

// Create a new client
router.post("/create", createClientValidation, createClient);

// Get client profile by ID
router.get("/getsingleclient/:id", getClientProfile);

// Get all clients for the logged-in admin
router.get("/all-clients", getAllClients);

// Update client by ID
router.put("/update/:id", createClientValidation, updateClient);

// Update subscription by client ID
router.put("/update-subscription/:id", updateSubscription);

module.exports = router;
