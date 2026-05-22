import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import {
  generateAccessToken
} from "../services/tokenService.js";
//import csurf from "csurf";
//import cookieParser from "cookie-parser";

//const app = express(); //iniciar app express
const router = express.Router();

//app.set("trust proxy", 1);

//app.use(cookieParser());
//app.use(express.json()); // <-- Agregar esto para que el backend pueda leer JSON

// Configurar protección CSRF con cookies
/*const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // No accesible desde JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // Evita ataques CSRF desde otros sitios
  },
});*/

//app.use(csrfProtection);

// Configuración de intentos fallidos
/*const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos
const ANSWER = "verde"; // Respuesta correcta
const failedAttempts = new Map(); // Para rastrear intentos por IP*/

/* =========================
   CSRF TOKEN ENDPOINT
========================= */
/*app.get("/api/csrf-token", (req, res) => {
  try {

    res.json({
      csrfToken: req.csrfToken(),
    });
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});*/

// Middleware de Rate Limiting
/*const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP en 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/", globalLimiter);*/

/* =========================
   AUTH RATE LIMIT
========================= */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many failed attempts. Please try again later.",
  },
});

/* =========================
   SLOW DOWN
========================= */

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => Math.min(hits * 300, 5000),
  maxDelayMs: 3000,
});

// VALIDATION ENDPOINT
router.post("/",
  speedLimiter,
  authLimiter,
  async (req, res) => {
    try {
      const ANSWER = process.env.SECURITY_ANSWER;
      // BODY VALIDATION
      if ( !req.body || typeof req.body !== "object") {
        return res.status(400).json({
          success: false,
          message: "Invalid request.",
        });
      }
      
      const { respuesta } = req.body;
      
      // INPUT VALIDATION
      if (!respuesta || typeof respuesta !== "string"){
        return res.status(400).json({
          success: false,
          message: "Invalid request.",
        });
      }      

      if (!/^[a-zA-Z0-9\s]+$/.test(respuesta)) {
        return res.status(400).json({
          success: false,
          message: "Invalid input.",
        });
      }

      // CORRECT ANSWER
      if (respuesta.toLowerCase().trim() === ANSWER) {
        /* =========================
          GENERATE ACCESS TOKEN
        ========================= */

        const accessToken =
          generateAccessToken({

            access: true,
          });

        /* =========================
          SECURE COOKIE
        ========================= */

        res.cookie(

          "access_token",

          accessToken,

          {

            httpOnly: true,

            secure:
              process.env.NODE_ENV
              === "production",

            sameSite: "Strict",

            maxAge:
              10 * 60 * 1000,
          }
        );

        /* =========================
          SUCCESS RESPONSE
        ========================= */

        return res.status(200).json({

          success: true,

          message:
            "Access granted.",
        });
        /*return res.status(200).json({
          success: true,
          message: "Correct answer.",
          content: protectedContent,
        });*/
      }

      // WRONG ANSWER
      return res.status(401).json({
        success: false,
        message: "Incorrect answer.",
      });

    } catch (error) {

      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

export default router;