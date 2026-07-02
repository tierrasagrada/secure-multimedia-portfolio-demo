import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { validateAnswer } from "../middleware/validateInput.js";
import { validateSecurityAnswer } from "../controllers/authController.js";

const router = express.Router();

/* =========================
   AUTH RATE LIMIT
========================= */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    increment("rateLimitTriggered");
    logger.warn({
      event: "rate_limit",
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(429).json({
      success: false,
      message: "Too many failed attempts. Please try again later.",
    });
  },
});

/* =========================
   SLOW DOWN
========================= */

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => Math.min(hits * 300, 5000),
  maxDelayMs: 3000,
});

// VALIDATION ENDPOINT
router.post(
  "/",
  speedLimiter,
  authLimiter,
  validateAnswer,
  validateSecurityAnswer,
);

export default router;