import fs from "fs";
import path from "path";

import { verifyImageToken } from "../services/tokenService.js";

import logger from "../utils/logger.js";

import { increment } from "../utils/securityMetrics.js";

import { addAuditEvent } from "../utils/auditTrail.js";

import { sanitizeQueryForLogs } from "../utils/sanitizeQueryForLogs.js";

import { setImageSecurityHeaders } from "../utils/setImageSecurityHeaders.js";

import { validateProtectedImage } from "../utils/validateProtectedImage.js";

const imagePath = path.join(process.cwd(), "src/protectedimages");

export async function serveProtectedImage(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      increment("missingImageToken");
      logger.security("Missing image token", {
        ip: req.ip,
        requestId: req.requestId,
        path: sanitizeQueryForLogs(req.originalUrl),
      });

      return res.status(401).json({
        success: false,
        message: "Acceso no autorizado.",
      });
    }
    // 📌 Validar el token
    const decoded = verifyImageToken(token);
    const { filename, ip } = decoded;
    const imageValidation = validateProtectedImage(filename, imagePath);

    if (!imageValidation.valid) {
      if (imageValidation.ext) {
        logger.security("not valid image extension", {
          ip: req.ip,
          requestId: req.requestId,
          path: sanitizeQueryForLogs(req.originalUrl),
          extension: imageValidation.ext,
        });
      }

      return res.status(imageValidation.status).json({
        success: false,
        message: imageValidation.message,
      });
    }

    const { filePath, ext } = imageValidation;

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };

    /* =========================
       SECURITY HEADERS
    ========================= */
    setImageSecurityHeaders(res, mimeTypes[ext]);

    /* =========================
       STREAM FILE
    ========================= */

    const stream = fs.createReadStream(filePath);

    stream.pipe(res);
  } catch (error) {
    increment("notvalidImageToken");
    logger.security("Invalid or expired image token", {
      ip: req.ip,
      requestId: req.requestId,
      path: sanitizeQueryForLogs(req.originalUrl),
    });

    addAuditEvent("INVALID_IMAGE_TOKEN", {
      ip: req.ip,
      requestId: req.requestId,
    });

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
