const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(cors());

/* =========================
   DB CONNECT
========================= */
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB ERROR:", err.message));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/tasks", taskRoutes);

/* =========================
   HEALTH / ROOT
========================= */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "CRM API is running" });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   ERROR HANDLING (BASIC)
========================= */
process.on("uncaughtException", (err) => {
  console.error("CRASH:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR:", err.message || err);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("ENV MONGO:", process.env.MONGO_URI ? "OK" : "NOT FOUND");
});
