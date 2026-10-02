require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const plantRoutes = require("./routes/plants");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "LeafLog API is running" }));
app.use("/api/plants", plantRoutes);

// Unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Create a .env file (see .env.example).");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected:", mongoose.connection.name);
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
