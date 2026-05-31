import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { generateAccessToken } from "../services/tokenService.js";
import logger from "../utils/logger.js";
import { validateAnswer } from "../middleware/validateInput.js";
import { sanitizeText } from "../utils/sanitize.js";

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

    logger.warn({
      event: "rate_limit",
      ip: req.ip,
      path: req.originalUrl,
      method: req.method
    });

    return res.status(429).json({
      success: false,
      message: "Too many failed attempts. Please try again later."
    });
  }
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
router.post("/",
  speedLimiter,
  authLimiter,
  validateAnswer,
  async (req, res) => {
    try {
            
      const ANSWER = process.env.SECURITY_ANSWER;
      const cleanUserAnswer = sanitizeText(req.body.respuesta);

      // CORRECT ANSWER
      const cleanServerAnswer = sanitizeText(ANSWER);
      if (cleanUserAnswer === cleanServerAnswer) {
        
        /* =========================
          GENERATE ACCESS TOKEN
        ========================= */

        const accessToken =
          generateAccessToken({

            access: true,
          });

        /* =========================
          SECURE COOKIE
        ========================= */

        res.cookie(

          "access_token",

          accessToken,

          {

            httpOnly: true,

            secure:
              process.env.NODE_ENV
              === "production",

            sameSite: "Strict",

            maxAge:
              10 * 60 * 1000,
          }
        );
        
        /* =========================
          SUCCESS RESPONSE
        ========================= */

        logger.info(
          `Successful authentication from IP: ${req.ip}`
        );
        
        return res.status(200).json({

          success: true,

          message:
            "Access granted.",
        });

      }

      logger.warn(
        `Failed authentication attempt from IP: ${req.ip}`
      );

      // WRONG ANSWER
      return res.status(401).json({
        success: false,
        message: "Incorrect answer.",
      });

    } catch (error) {

      logger.error(
        "Validation route failed.",
        error
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

export default router;