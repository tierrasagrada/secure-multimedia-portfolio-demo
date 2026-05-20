import rateLimit from "express-rate-limit";

const isProduction =
  process.env.NODE_ENV === "production";

const globalLimiter = rateLimit({

  windowMs:
    isProduction
      ? 15 * 60 * 1000
      : 1 * 60 * 1000,

  max:
    isProduction
      ? 100
      : 1000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests.",
  },
});

export default globalLimiter;