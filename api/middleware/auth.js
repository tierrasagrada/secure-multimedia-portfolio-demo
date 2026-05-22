import {
  verifyAccessToken
} from "../services/tokenService.js";

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

    return res.status(403).json({

      success: false,

      message:
        "Invalid or expired session.",
    });
  }
}