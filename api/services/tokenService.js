import jwt from "jsonwebtoken";

import {
  SESSION_VERSION
} from "../config/sessionConfig.js";

/* =========================
   USED IMAGE TOKENS
========================= */

const usedImageTokens =
  new Set();

/* =========================
   GENERATE IMAGE TOKEN
========================= */

export const generateImageToken = (
  payload
) => {

  return jwt.sign(

    payload,

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

  /* =========================
     REPLAY PROTECTION
  ========================= */

  if (
    usedImageTokens.has(token)
  ) {

    throw new Error(
      "Replay attack detected."
    );
  }

  /* =========================
     VERIFY JWT
  ========================= */

  const decoded =
    jwt.verify(

      token,

      process.env.SECRET_KEY
    );

  /* =========================
     MARK TOKEN AS USED
  ========================= */

  usedImageTokens.add(
    token
  );

  /* =========================
     AUTO CLEANUP
  ========================= */

  setTimeout(() => {

    usedImageTokens.delete(
      token
    );

  }, 5 * 60 * 1000);

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

      expiresIn: "1m",
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