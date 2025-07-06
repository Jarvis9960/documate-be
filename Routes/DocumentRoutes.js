const express = require("express");
const router = express.Router();
const protectRoute = require("../Middlewares/ProtectedRoute");
const {
  uploadDocument,
  deleteDocument,
  getDocumentsByFolderAndClient,
} = require("../Controller/DocumentController");

// Apply protection middleware to all routes
router.use(protectRoute);

router.post("/upload", uploadDocument);
router.delete("/delete/:id", deleteDocument);

// Add a new route to fetch documents for a specific folder and client
router.get("/documents", getDocumentsByFolderAndClient);

module.exports = router;