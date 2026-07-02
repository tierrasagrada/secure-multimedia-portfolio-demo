import express from "express";
import auth from "../middleware/auth.js";
import { getMetrics } from "../utils/securityMetrics.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
  return res.status(200).json(getMetrics());
});

export default router;
