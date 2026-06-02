import {
  verifyAccessToken
} from "../services/tokenService.js";

import logger from
"../utils/logger.js";

import {
  SESSION_VERSION
}
from "../config/sessionConfig.js";

import {
  increment
} from "../utils/securityMetrics.js";

/* =========================
   AUTH MIDDLEWARE
========================= */

export default function auth(
  req,
  res,
  next
) {

  try {

    /* =========================
       GET TOKEN
    ========================= */

    const token =
      req.cookies.access_token;

    /* =========================
       TOKEN REQUIRED
    ========================= */

    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication required.",
      });
    }

    /* =========================
       VERIFY TOKEN
    ========================= */

    const decoded =
      verifyAccessToken(token);

    /* =========================
       ATTACH USER DATA
    ========================= */

    req.user = decoded;

    /* =========================
    SESSION VERSION CHECK
    ========================= */

    if (

      decoded.sessionVersion !==
      SESSION_VERSION
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Session invalidated.",
      });
    }

    next();

  } catch (error) {

    /* =========================
       INVALID TOKEN LOG
    ========================= */

    /*logger.security(

      `Invalid JWT from IP: ${req.ip}`
    );*/
    increment("invalidJwt");

    logger.security(
      "Invalid JWT",
      {
        ip: req.ip,
        requestId: req.requestId,
        path: req.originalUrl
      }
    );    

    return res.status(403).json({

      success: false,

      message:
        "Invalid or expired session.",
    });
  }
}