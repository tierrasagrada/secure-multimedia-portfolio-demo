import jwt from "jsonwebtoken";

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

    payload,

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