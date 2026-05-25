import {
  verifyAccessToken
} from "../services/tokenService.js";

import logger from
"../utils/logger.js";

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

    next();

  } catch (error) {

    /* =========================
       INVALID TOKEN LOG
    ========================= */

    logger.security(

      `Invalid JWT from IP: ${req.ip}`
    );

    return res.status(403).json({

      success: false,

      message:
        "Invalid or expired session.",
    });
  }
}

/*import {
  verifyAccessToken
} from "../services/tokenService.js";
import logger from
"../utils/logger.js";
/* =========================
   AUTH MIDDLEWARE
========================= */

/*export default function auth(
  req,
  res,
  next
) {

  try {

    /* =========================
       GET TOKEN
    ========================= */

    /*const token =
      req.cookies.access_token;

    /* =========================
       TOKEN REQUIRED
    ========================= */

    /*if (!token) {
      logger.security(
        `Invalid JWT from IP: ${req.ip}`
      );
      return res.status(401).json({

        success: false,

        message:
          "Authentication required.",
      });
    }

    /* =========================
       VERIFY TOKEN
    ========================= */

   /* const decoded =
      verifyAccessToken(token);

    /* =========================
       ATTACH USER DATA
    ========================= */

    //req.user = decoded;

   /* next();

  } catch (error) {

    return res.status(403).json({

      success: false,

      message:
        "Invalid or expired session.",
    });
  }
}*/