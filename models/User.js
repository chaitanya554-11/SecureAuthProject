// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Prevent OverwriteModelError by reusing existing model if already compiled
module.exports = mongoose.models.User || mongoose.model("User", userSchema);