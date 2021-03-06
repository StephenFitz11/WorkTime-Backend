const express = require("express");
const config = require("config");
const cors = require("cors");
require("express-async-errors");

const connectDB = require("./config/db");
const error = require("./middleware/error");

const app = express();

// Environment variable
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

// Connect to the database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Routes
app.use("/api/time", require("./routes/api/time"));
app.use("/api/clients", require("./routes/api/clients"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/employees", require("./routes/api/employees"));
app.use("/api/auth", require("./routes/api/auth"));

app.use(error);

// Find the PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
