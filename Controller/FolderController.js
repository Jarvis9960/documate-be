const Folder = require("../Models/FolderModel");
const Document = require("../Models/DocumentModel");

// Create a new folder
const createFolder = async (req, res) => {
  const { name, clientId } = req.body;

  if (!name || !clientId) {
    return res.status(400).json({
      status: false,
      message: "Folder name and client ID are required.",
    });
  }

  try {
    const folder = new Folder({ name, clientId });
    await folder.save();

    return res.status(201).json({
      status: true,
      message: "Folder created successfully.",
      data: folder,
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Edit folder name
const editFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Folder name is required.",
    });
  }

  try {
    const folder = await Folder.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({
        status: false,
        message: "Folder not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Folder updated successfully.",
      data: folder,
    });
  } catch (error) {
    console.error("Error updating folder:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Delete folder (soft delete)
const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({
        status: false,
        message: "Folder not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Folder deleted successfully.",
      data: folder,
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Get all folders for a specific client
const getFolders = async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({
      status: false,
      message: "Client ID is required.",
    });
  }

  try {
    const folders = await Folder.find({ clientId, isDeleted: false }).lean();

    // Ensure each folder has a 'files' property initialized as an empty array
    const foldersWithFiles = folders.map((folder) => ({
      ...folder,
      files: folder.files || [],
    }));

    return res.status(200).json({
      status: true,
      message: "Folders fetched successfully.",
      data: foldersWithFiles,
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Get folders in Recycle Bin
const getRecycleBinFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ isDeleted: true });

    return res.status(200).json({
      status: true,
      message: "Recycle Bin folders fetched successfully.",
      data: folders,
    });
  } catch (error) {
    console.error("Error fetching Recycle Bin folders:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Restore folder from Recycle Bin
const restoreFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({
        status: false,
        message: "Folder not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Folder restored successfully.",
      data: folder,
    });
  } catch (error) {
    console.error("Error restoring folder:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Permanently delete folder
const permanentlyDeleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findByIdAndDelete(id);

    if (!folder) {
      return res.status(404).json({
        status: false,
        message: "Folder not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Folder permanently deleted successfully.",
    });
  } catch (error) {
    console.error("Error permanently deleting folder:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  createFolder,
  editFolder,
  deleteFolder,
  getFolders,
  getRecycleBinFolders,
  restoreFolder,
  permanentlyDeleteFolder,
};