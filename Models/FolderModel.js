const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Mark folders as deleted instead of permanently deleting them
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;