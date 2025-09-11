import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import adminRoutes from "./routes/admin.js";
import companyRoutes from "./routes/companies.js";
import landRoutes from "./routes/lands.js";
import requirementRoutes from "./routes/requirements.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error(
      "MongoDB connection error:",

      error
    )
  );

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/upload", uploadRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Property Management API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
