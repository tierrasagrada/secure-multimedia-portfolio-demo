import logger from
"../utils/logger.js";

import {
  increment
} from "../utils/securityMetrics.js";

const errorHandler = (
  err,
  req,
  res,
  next
) => {

  /* =========================
     CSRF ERROR
  ========================= */

  if ( err.code === "EBADCSRFTOKEN" ) {

    increment("csrfBlocked");

    logger.security(
      "Invalid CSRF token",
      {
        ip: req.ip,
        requestId: req.requestId,
        path: req.originalUrl
      }
    );    
    /*logger.security(
      `Invalid CSRF token from IP: ${req.ip}`
    );*/    
    
    return res.status(403).json({

      success: false,

      message:
        "Invalid request.",
    });
  }

  /* =========================
     RATE LIMIT
  ========================= */

  if (err.status === 429) {

    return res.status(429).json({

      success: false,

      message:
        "Too many requests.",
    });
  }

  /* =========================
     SERVER LOG
  ========================= */

    /*logger.error(
      "Global error handler triggered.",
      err
    );*/

    logger.error(
      "Global error handler triggered",
      err,{
        ip: req.ip,
        requestId: req.requestId,
        path: req.originalUrl
      }
    );
        
  /* =========================
     GENERIC ERROR
  ========================= */

  return res.status(500).json({

    success: false,

    message:
      "Internal server error.",
  });
};

export default errorHandler;