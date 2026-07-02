import express from "express";
import { getMetrics } from "../utils/securityMetrics.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    security: getMetrics(),    
  });
});

export default router;