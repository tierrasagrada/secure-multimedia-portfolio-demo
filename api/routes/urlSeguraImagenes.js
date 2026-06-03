import fs from "fs";
import path from "path";

import {
  verifyImageToken
} from "../services/tokenService.js";

import logger from
"../utils/logger.js";

import {
  increment
} from "../utils/securityMetrics.js";

import {
  addAuditEvent
} from "../utils/auditTrail.js";

import express from "express";

const router = express.Router();
const imagePath = path.join(process.cwd(), "api/protectedimages");

router.get("/", async (req, res) => {

  try {
    const { token } = req.query;

    if (!token){ 
      /*logger.security(
        `Invalid image token from IP: ${req.ip}`
      );*/
      increment("missingImageToken");
      logger.security(
        "Missing image token",
        {
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl
        }
      );      

      return res.status(401).json({ 
        success: false, message: "Acceso no autorizado." 
      });
    }
    // 📌 Validar el token
    const decoded =
      verifyImageToken(token);
    const { filename, ip } = decoded;
    const userIP = req.ip;

    // 📌 Verificar la IP para evitar que la URL se comparta
    if (userIP !== ip) {
      /*logger.security(
        `IP mismatch detected for protected image. Request IP: ${req.ip}`//IP DISTINTA
      );*/
      logger.security(
        "Image IP mismatch",
        {
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl
        }
      );

      return res.status(403).json({ 
        success: false, message: "Invalid token." 
      });
    }

    // 📌 Verificar que la imagen existe
    const safeFilename =
      path.basename(filename);

    const filePath =
      path.join(
        imagePath,
        safeFilename
      );
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    const ext = path.extname(filename).toLowerCase();
    /* =========================
      ALLOWED EXTENSIONS
    ========================= */

    const allowedExtensions = [

      ".jpg",
      ".jpeg",
      ".png",
    ];

    if ( !allowedExtensions.includes(ext) ) {

      /*logger.security(
        `Blocked invalid extension from IP: ${req.ip}`
      );*/
      logger.security(
        "Invalid image extension",{
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl,
          extension: ext
        }
      );

      return res
        .status(403)
        .json({

          success: false,

          message:
            "Invalid file type."
        });
    }
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };
    /* =========================
       SECURITY HEADERS
    ========================= */

    res.setHeader(
      "Content-Type",
      mimeTypes[ext] || "application/octet-stream"
    );

    res.setHeader(
      "Cache-Control",
      "private, max-age=300"
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    res.setHeader(
      "Cross-Origin-Resource-Policy",
      "same-origin"
    );

    res.setHeader(
      "Referrer-Policy",
      "no-referrer"
    );

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; img-src 'self';"
    );    
    /* =========================
       STREAM FILE
    ========================= */

    const stream = fs.createReadStream(filePath);

    stream.pipe(res);
    
  } catch (error) {
    //res.status(403).json({ success: false, message: "Token inválido o expirado." });
      /*logger.security(

        `Invalid or expired image token from IP: ${req.ip}`
      );*/
      increment("invalidImageToken");
      logger.security(
        "Invalid or expired image token",
        {
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl
        }
      );     

      addAuditEvent(
        "INVALID_IMAGE_TOKEN",
        {
          ip: req.ip,
          requestId: req.requestId
        }
      );

      return res.status(403).json({
        success: false,
        message:
          "Invalid or expired token.",
      });    
  }
});

export default router;
