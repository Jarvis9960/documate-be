const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./ConnectDB/Database");
const adminRoutes = require("./Routes/AdminRoutes");
const clientRoutes = require("./Routes/ClientRoutes");
const folderRoutes = require("./Routes/FolderRoutes");
const documentRoutes = require("./Routes/DocumentRoutes");
const AWS = require("aws-sdk");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/documents", documentRoutes);

// Configure AWS S3
const s3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: "AKIASK5MCXW24CNMJEXR",
  secretAccessKey: "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",
});

// Generate pre-signed URL endpoint
app.post("/api/documents/presigned-url", (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({
      status: false,
      message: "File name and file type are required.",
    });
  }

  const params = {
    Bucket: "documatestore", // Replace with your S3 bucket name
    Key: fileName,
    Expires: 60, // URL expiration time in seconds
    ContentType: fileType,
  };

  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error("Error generating pre-signed URL:", err);
      return res.status(500).json({
        status: false,
        message: "Error generating pre-signed URL.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Pre-signed URL generated successfully.",
      url,
    });
  });
});

// Generate pre-signed GET URL for previewing a document
app.get("/api/documents/preview-url", (req, res) => {
  const { folderId, fileName } = req.query;

  if (!folderId || !fileName) {
    return res.status(400).json({
      status: false,
      message: "Folder ID and file name are required.",
    });
  }

  // If your S3 structure uses folders, adjust the Key accordingly:
  // const key = `${folderId}/${fileName}`;
  const key = fileName; // Or use the above if you store files in folder paths

  const params = {
    Bucket: "documatestore",
    Key: key,
    Expires: 60, // URL expiration time in seconds
  };

  s3.getSignedUrl("getObject", params, (err, url) => {
    if (err) {
      console.error("Error generating preview URL:", err);
      return res.status(500).json({
        status: false,
        message: "Error generating preview URL.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Preview URL generated successfully.",
      url,
    });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Documate API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: "Something broke!",
    error: err.message,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
