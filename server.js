import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import globalLimiter from "./api/middleware/globalRateLimit.js";
import csrfProtection from "./api/middleware/csrfProtection.js";
import errorHandler from "./api/middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

/* =========================
   IMPORT API ROUTES
========================= */

import validarRespuesta from "./api/routes/validarRespuesta.js";
import csrfToken from "./api/routes/csrf-token.js";
import obtenerImagenes from "./api/routes/obtenerImagenes.js";
import urlSeguraImagenes from "./api/routes/urlSeguraImagenes.js";

/* =========================
   EXPRESS APP
========================= */

const app = express();

app.disable("x-powered-by");

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
   MIDDLEWARES
========================= */

app.use(cookieParser());

app.use(express.json({

  limit: "10kb",
}));

/* =========================
   STATIC FILES
========================= */

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

 //SECURITY
app.use(csrfProtection);
app.use("/api", globalLimiter);

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

//ERROR HANDLER
app.use(errorHandler);

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

});