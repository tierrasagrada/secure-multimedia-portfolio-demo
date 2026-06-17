import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import globalLimiter from "./src/middleware/globalRateLimit.js";
import csrfProtection from "./src/middleware/csrfProtection.js";
import errorHandler from "./src/middleware/errorHandler.js";
import securityHeaders from "./src/middleware/securityHeaders.js";
import httpLogger from "./src/middleware/httpLogger.js";
import path from "path";
import { fileURLToPath } from "url";
import requestId from "./src/middleware/requestId.js";
import securityMetrics from "./src/routes/securityMetrics.js";
import health from "./src/routes/health.js";
import auditTrail from "./src/routes/auditTrail.js";
import logoutRoute from "./src/routes/logout.js";

/* =========================
   IMPORT API ROUTES
========================= */

import validarRespuesta from "./src/routes/validarRespuesta.js";
import csrfToken from "./src/routes/csrf-token.js";
import obtenerImagenes from "./src/routes/obtenerImagenes.js";
import urlSeguraImagenes from "./src/routes/urlSeguraImagenes.js";
import contenido from
"./src/routes/contenido.js"; //esta bien aqui la ruta de contenido?
/* =========================
   EXPRESS APP
========================= */

const app = express();

app.disable("x-powered-by");

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
  "/api/logout",
  logoutRoute
);

app.use(
  "/api/health",
  health
);

app.use(
  "/api/security-metrics",
  securityMetrics
);

app.use(
  "/api/auditTrail",
  auditTrail
);

//ERROR HANDLER
app.use(errorHandler);

export default app;