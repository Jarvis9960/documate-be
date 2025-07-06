const Document = require("../Models/DocumentModel");

// Upload a document
const uploadDocument = async (req, res) => {
  const { name, folderId, clientId } = req.body;

  if (!name || !folderId || !clientId) {
    return res.status(400).json({
      status: false,
      message: "Document name, folder ID, and client ID are required.",
    });
  }

  try {
    const document = new Document({ name, folderId, clientId });
    await document.save();

    return res.status(201).json({
      status: true,
      message: "Document uploaded successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Delete document (soft delete)
const deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        status: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Document deleted successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

// Fetch documents for a specific folder and client
const getDocumentsByFolderAndClient = async (req, res) => {
  const { folderId, clientId } = req.query;

  if (!folderId || !clientId) {
    return res.status(400).json({
      status: false,
      message: "Folder ID and Client ID are required.",
    });
  }

  try {
    const documents = await Document.find({
      folderId,
      clientId,
      isDeleted: false, // Exclude deleted documents
    });

    return res.status(200).json({
      status: true,
      message: "Documents fetched successfully.",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  uploadDocument,
  deleteDocument,
  getDocumentsByFolderAndClient, // Export the new function
};