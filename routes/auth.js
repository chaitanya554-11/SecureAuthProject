const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");

const router = express.Router();

/* =========================
   LOGIN RATE LIMITER
========================= */
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                   // allow 5 attempts per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({ error: "Too many login attempts. Try again later." });
  }
});

/* =========================
   REGISTER
========================= */
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.json({ success: true, message: "User registered successfully ✅" });
    } catch (err) {
      console.error("REGISTER ERROR:", err && err.stack ? err.stack : err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* =========================
   LOGIN
========================= */
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {
    console.log("LOGIN ROUTE HIT -> ip:", req.ip, "email:", req.body && req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

      req.session.userId = user._id;
      res.json({ success: true, message: "Login successful ✅" });
    } catch (err) {
      console.error("LOGIN ERROR:", err && err.stack ? err.stack : err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* =========================
   AUTH MIDDLEWARE
========================= */
function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ error: "Unauthorized ❌" });
}

/* =========================
   PROFILE (Protected Route)
========================= */
router.get("/profile", ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    console.error("PROFILE ERROR:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   LOGOUT
========================= */
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.json({ success: true, message: "Logged out successfully 👋" });
    });
  } else {
    res.json({ message: "No active session" });
  }
});

module.exports = router;