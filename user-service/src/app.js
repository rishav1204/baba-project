import express from "express";
import cors from "cors";
import "dotenv/config";
// import authRoutes from "./routes/authRoute.js";
import { ApiResponse } from "./utils/apiResponse.js";
import apiRoutes from "./routes/index.js";
//const apiRoutes = require("./routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/auth", authRoutes);

app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  return ApiResponse.success(res, {
    message: "Service is healthy",
    data: { timestamp: new Date() },
  });
});

// 404 Handler
app.use((req, res) => {
  return ApiResponse.error(res, {
    message: "Route not found",
    statusCode: 404,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return ApiResponse.error(res, {
    message,
    statusCode,
  });
});

export default app;
