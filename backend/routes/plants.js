const express = require("express");
const mongoose = require("mongoose");
const Plant = require("../models/Plant");

const router = express.Router();

// Reject invalid ids before they reach MongoDB
const checkId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid plant id" });
  }
  next();
};

// CREATE  ->  POST /api/plants
router.post("/", async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL  ->  GET /api/plants   (optional search: ?name=tul)
router.get("/", async (req, res) => {
  try {
    const filter = req.query.name ? { name: new RegExp(req.query.name, "i") } : {};
    const plants = await Plant.find(filter).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE  ->  GET /api/plants/:id
router.get("/:id", checkId, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE  ->  PUT /api/plants/:id
router.put("/:id", checkId, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// WATER NOW  ->  PATCH /api/plants/:id/water
router.patch("/:id/water", checkId, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { lastWatered: new Date() },
      { new: true }
    );
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE  ->  DELETE /api/plants/:id
router.delete("/:id", checkId, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant deleted", id: plant._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
