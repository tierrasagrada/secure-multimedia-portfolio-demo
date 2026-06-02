import express from "express";
import { getMetrics } from "../utils/securityMetrics.js";

const router = express.Router();

router.get("/", (req, res) => {

  return res.status(200).json(
    getMetrics()
  );
});

export default router;