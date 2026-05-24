import fs from "fs";
import path from "path";
//import jwt from "jsonwebtoken";
import {
  verifyImageToken
} from "../services/tokenService.js";
import logger from
"../utils/logger.js";
import express from "express";

const router = express.Router();
const imagePath = path.join(process.cwd(), "api/protectedimages");

//export default async function handler(req, res) {
router.get("/", async (req, res) => {
  /*if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }*/
  //const secretKey = process.env.SECRET_KEY;
  //console.log(process.env.SECRET_KEY);
  try {
    const { token } = req.query;

    if (!token){ 
      logger.security(
        `Invalid image token from IP: ${req.ip}`
      );
      return res.status(401).json({ 
        success: false, message: "Acceso no autorizado." 
      });
    }
    // 📌 Validar el token
    //const decoded = jwt.verify(token, secretKey);
    const decoded =
      verifyImageToken(token);
    const { filename, ip } = decoded;
    //const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userIP = req.ip;

    // 📌 Verificar la IP para evitar que la URL se comparta
    if (userIP !== ip) {
      logger.security(
        `IP mismatch detected for protected image. Request IP: ${req.ip}`//IP DISTINTA
      );
      return res.status(403).json({ 
        success: false, message: "Invalid token." 
      });
    }

    // 📌 Verificar que la imagen existe
    const filePath = path.join(imagePath, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    const ext = path.extname(filename).toLowerCase();

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

    /* =========================
       STREAM FILE
    ========================= */

    const stream = fs.createReadStream(filePath);

    stream.pipe(res);
    
    // 📌 Servir la imagen protegida
    /*res.setHeader("Content-Type", "image/jpeg");
    res.send(fs.readFileSync(filePath));*/
  } catch (error) {
    //res.status(403).json({ success: false, message: "Token inválido o expirado." });
    logger.security(

      `Invalid or expired image token from IP: ${req.ip}`
    );

    return res.status(403).json({

      success: false,

      message:
        "Invalid or expired token.",
    });    
  }
});

export default router;
