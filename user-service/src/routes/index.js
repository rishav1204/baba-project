import express from "express";
import v1 from "./v1/index.js"; // Make sure to include .js extension

const router = express.Router();

router.use("/v1", v1);

export default router;
