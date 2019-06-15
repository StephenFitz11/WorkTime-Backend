const mongoose = require("mongoose");
const config = require("config");

// Gets Atlas Mongo credentials from default.json
const db = config.get("mongoURI");

// Configure Mongoose to let me use "unique" validator
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// Connects to the MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
