require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

/* =========================
   SECURITY CONFIGURATION
========================= */

// Helmet (basic security headers)
app.use(
  helmet({
    contentSecurityPolicy: false // disable CSP for simplicity in dev
  })
);

// Trust proxy (false for local dev, set to true/1 in production behind proxy)
app.set("trust proxy", false);

/* =========================
   BODY PARSERS
========================= */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* =========================
   SESSION CONFIGURATION
========================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      maxAge: 1000 * 60 * 30 // 30 minutes
    }
  })
);

/* =========================
   GLOBAL RATE LIMITER
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log("⚠️ Global rate limit triggered for key:", req.ip);
    res.status(429).json({ error: "Too many requests from this IP, try again later." });
  }
});
app.use(limiter);

/* =========================
   STATIC FILES
========================= */
app.use(express.static("public")); // serve index.html and other assets

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Root route: serve index.html automatically
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("=== GLOBAL ERROR ===");
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong!"
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running securely on port ${PORT}`));