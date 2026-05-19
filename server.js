import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";


/* =========================
   IMPORT API ROUTES
========================= */

import validarRespuesta from "./api/validarRespuesta.js";
import csrfToken from "./api/csrf-token.js";
import obtenerImagenes from "./api/obtenerImagenes.js";
import urlSeguraImagenes from "./api/urlSeguraImagenes.js";

/* =========================
   EXPRESS APP
========================= */

const app = express();

const PORT = 3000;

/* =========================
   __dirname FIX
========================= */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

/* =========================
   TRUST PROXY
========================= */

app.set("trust proxy", 1);

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(cookieParser());

/* =========================
   JSON
========================= */

app.use(express.json());

/* =========================
   STATIC FILES
========================= */

app.use(
  express.static(__dirname)
);



/* =========================
   CSRF GLOBAL
========================= */

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  },
});

app.use(csrfProtection);

/* =========================
   GLOBAL RATE LIMIT
========================= */
const isProduction = process.env.NODE_ENV === "production";
const globalLimiter = rateLimit({

  windowMs: isProduction ? 15 * 60 * 1000: 1 * 60 * 1000,

   max: isProduction ? 15 : 100,

  standardHeaders: true,

  legacyHeaders: false,
  skip: (req, res) => {
    return req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  },
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api/", globalLimiter);


/* =========================
   API ROUTES
========================= */

app.use(
  "/api/validarRespuesta",
  validarRespuesta
);

app.use(
  "/api/csrf-token",
  csrfToken
);

app.use(
  "/api/obtenerImagenes",
  obtenerImagenes
);

app.use(
  "/api/urlSeguraImagenes",
  urlSeguraImagenes
);

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

});