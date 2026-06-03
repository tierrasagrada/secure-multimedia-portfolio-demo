import rateLimit from "express-rate-limit";

const isProduction =
  process.env.NODE_ENV === "production";

const globalLimiter = rateLimit({

  windowMs:
    isProduction
      ? 15 * 60 * 1000
      : 1 * 60 * 1000,

  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    increment("rateLimitTriggered");
    logger.warn({
      event: "global_rate_limit",
      ip: req.ip,
      path: req.originalUrl,
      method: req.method
    });
    
    res.status(options.statusCode).json({
      success: false,
      message: "Too many failed attempts. Please try again later.",
    });
  }    
});

export default globalLimiter;