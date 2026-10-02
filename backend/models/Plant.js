const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Plant name is required"], trim: true },
    species: { type: String, trim: true, default: "" },
    wateringEveryDays: { type: Number, required: true, min: 1, default: 3 },
    lastWatered: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
