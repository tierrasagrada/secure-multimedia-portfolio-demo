import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SESSION_VERSION }
from "../config/sessionConfig.js";

/* =========================
   USED IMAGE TOKENS
========================= */

const usedImageTokens =
  new Map();

/* =========================
   CLEANUP EXPIRED JTIs
========================= */

setInterval(() => {

  const now = Date.now();

  for (const [jti, exp] of usedImageTokens) {

    if (now > exp) {

      usedImageTokens.delete(jti);
    }
  }

}, 60 * 1000);

/* =========================
   GENERATE IMAGE TOKEN
========================= */

export const generateImageToken = (
  payload
) => {

  const jti =
    crypto.randomUUID();

  return jwt.sign(

    {

      ...payload,

      jti,
    },

    process.env.SECRET_KEY,

    {

      expiresIn: "5m",
    }
  );
};

/* =========================
   VERIFY IMAGE TOKEN
========================= */

export const verifyImageToken = (
  token
) => {

  const decoded =
    jwt.verify(

      token,

      process.env.SECRET_KEY
    );

  const now =
    Date.now();

  /* =========================
     REPLAY DETECTION
  ========================= */

  if (

    usedImageTokens.has(
      decoded.jti
    )
  ) {

    throw new Error(
      "Replay attack detected."
    );
  }

  /* =========================
     STORE USED JTI
  ========================= */

  usedImageTokens.set(

    decoded.jti,

    now + (5 * 60 * 1000)
  );

  return decoded;
};

/* =========================
   GENERATE ACCESS TOKEN
========================= */

export const generateAccessToken = (
  payload
) => {

  return jwt.sign(

    {

      ...payload,

      sessionVersion:
        SESSION_VERSION
    },

    process.env.JWT_SECRET,

    {

      expiresIn: "15m",
    }
  );
};

/* =========================
   VERIFY ACCESS TOKEN
========================= */

export const verifyAccessToken = (
  token
) => {

  return jwt.verify(

    token,

    process.env.JWT_SECRET
  );
};