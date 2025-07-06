const { validationResult } = require("express-validator");
const Client = require("../Models/ClientModel");
const mongoose = require("mongoose");

const createClient = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      data: errors.array(),
    });
  }

  const { company, name, gst, mobile, address } = req.body;

  try {
    // Generate profile link based on company name and client ID
    const newClient = new Client({
      company,
      name,
      gst,
      mobile,
      address,
      adminID: req.user.id, // Attach the logged-in admin's ID
      subscriptionEndDate: new Date(new Date().setDate(new Date().getDate() + 365)), // Set subscriptionEndDate to 1 year from now
    });

    // Save the client to generate an ID
    await newClient.save();

    // Generate the profile link
    newClient.profileLink = `${"http://127.0.0.1:3000"}/client-profile/${
      newClient._id
    }`;
    await newClient.save();

    return res.status(201).json({
      status: true,
      message: "Client created successfully",
      data: newClient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getClientProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  // Validate if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid client ID",
    });
  }

  try {
    const client = await Client.findById(id).populate(
      "adminID",
      "name mobileNumber role"
    );
    if (!client) {
      return res.status(404).json({
        status: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Client profile fetched successfully",
      data: client,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getAllClients = async (req, res) => {
  try {
    // Fetch all clients associated with the logged-in admin
    const clients = await Client.find({ adminID: req.user.id }).select(
      "-__v -createdAt -updatedAt"
    );

    if (!clients || clients.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No clients found for this admin",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Clients fetched successfully",
      data: clients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      data: errors.array(),
    });
  }

  const { company, name, gst, mobile, address } = req.body;

  try {
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { company, name, gst, mobile, address }, // Only update client details
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({
        status: false,
        message: "Client not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Client updated successfully.",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { subscriptionEndDate, subscriptionStatus } = req.body;

  // Ensure at least one field is provided
  if (!subscriptionEndDate && !subscriptionStatus) {
    return res.status(400).json({
      status: false,
      message: "Either subscription end date or status is required.",
    });
  }

  try {
    const updateData = {};
    if (subscriptionEndDate) updateData.subscriptionEndDate = subscriptionEndDate;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({
        status: false,
        message: "Client not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Subscription updated successfully.",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  createClient,
  getClientProfile,
  getAllClients, // Export the new controller
  updateClient, // Export the new controller
  updateSubscription, // Export the new subscription update function
};
