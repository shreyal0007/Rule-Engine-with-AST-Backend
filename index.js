// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const ruleRoutes = require("./routes/ruleRoutes"); // Import your routes

const MONGO_URL =
  "mongodb+srv://shreyaljain0007:AHSYLX2CG1I7qz8C@cluster0.nvrk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const MONGO_URL = process.env.MONGO_URL;
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // CORS middleware
app.use(bodyParser.json()); // Body parser middleware for JSON

// MongoDB connection
mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(
      `Failed to connect to MongoDB - retrying in 5 seconds\n${error}`
    );
    setTimeout(connectDb, 5000); // Retry connection after 5 seconds
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Lost MongoDB connection, retrying...");
});

// Start the MongoDB connection
connectDb();

// Routes
app.use("/api/rules", ruleRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
