const express = require("express");
const router = express.Router();
const protectRoute = require("../Middlewares/ProtectedRoute");
const {
  createFolder,
  editFolder,
  deleteFolder,
  getFolders, // Import the new function
  getRecycleBinFolders,
  restoreFolder,
  permanentlyDeleteFolder,
} = require("../Controller/FolderController");

// Apply protection middleware to all routes
router.use(protectRoute);

router.post("/create", createFolder);
router.put("/edit/:id", editFolder);
router.delete("/delete/:id", deleteFolder);
router.get("/", getFolders); // Add the GET route for fetching folders
router.get("/recycle-bin", getRecycleBinFolders);
router.put("/restore/:id", restoreFolder);
router.delete("/permanently-delete/:id", permanentlyDeleteFolder);

module.exports = router;