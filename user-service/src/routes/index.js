import express from "express";
import v1 from "./v1/index.js"; // Make sure to include .js extension

const router = express.Router();

router.use("/v1/api", v1);

export default router;
