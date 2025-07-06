const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gst: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profileLink: {
      type: String,
    },
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionEndDate: {
      type: Date,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
