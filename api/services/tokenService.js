import jwt from "jsonwebtoken";
import { SESSION_VERSION } from "../config/sessionConfig.js";

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

  return jwt.verify(

    token,

    process.env.SECRET_KEY
  );
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

      expiresIn: "1m",//EN PRODUCCION expiresIn: "10m",
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