import express from "express";
import { getMetrics }
from "../utils/securityMetrics.js";

const router = express.Router();

router.get("/", (req, res) => {

  return res.status(200).json({

    status: "ok",

    uptimeSeconds:
      Math.floor(process.uptime()),

    security:
      getMetrics(),

    version:
      process.env.npm_package_version,

    environment:
      process.env.NODE_ENV,

    timestamp:
      new Date().toISOString()
  });
});

export default router;