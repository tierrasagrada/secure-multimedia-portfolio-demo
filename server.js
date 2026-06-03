import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import globalLimiter from "./api/middleware/globalRateLimit.js";
import csrfProtection from "./api/middleware/csrfProtection.js";
import errorHandler from "./api/middleware/errorHandler.js";
import securityHeaders from "./api/middleware/securityHeaders.js";
import httpLogger from "./api/middleware/httpLogger.js";
import path from "path";
import { fileURLToPath } from "url";
import requestId from "./api/middleware/requestId.js";
import securityMetrics from "./api/routes/securityMetrics.js";
import health from "./api/routes/health.js";

/* =========================
   IMPORT API ROUTES
========================= */

import validarRespuesta from "./api/routes/validarRespuesta.js";
import csrfToken from "./api/routes/csrf-token.js";
import obtenerImagenes from "./api/routes/obtenerImagenes.js";
import urlSeguraImagenes from "./api/routes/urlSeguraImagenes.js";
import contenido from
"./api/routes/contenido.js"; //esta bien aqui la ruta de contenido?
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

app.use(requestId);

app.use(httpLogger);

app.use(securityHeaders);

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

app.use(
  "/api/contenido",
  contenido
);

app.use(
  "/api/security-metrics",
  securityMetrics
);

app.use(
  "/api/health",
  health
);

//ERROR HANDLER
app.use(errorHandler);

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

});