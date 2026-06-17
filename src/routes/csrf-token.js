import express from "express";

import rateLimit from "express-rate-limit";

const router = express.Router();

/* =========================
   CSRF TOKEN RATE LIMIT
========================= */

const csrfLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 30,

  standardHeaders: true,

  legacyHeaders: false,

  message: {

    success: false,

    message:
      "Too many token requests.",
  },
});

/* =========================
   CSRF TOKEN ROUTE
========================= */

router.get(
  "/",
  csrfLimiter,

  (req, res) => {

    res.status(200).json({

      success: true,

      csrfToken:
        req.csrfToken(),
    });
  }
);

export default router;