import express from "express";
import * as fs from "fs";
import path from "path";
import auth from
"../middleware/auth.js";
import {
  generateImageToken
} from "../services/tokenService.js";

const router = express.Router();

const imagePath = path.join(process.cwd(), "api/protectedimages");

//export default async function handler(req, res) {
router.post("/", auth, async (req, res) => {
  try {
    // 📌 Obtener IP del usuario
    const userIP = req.ip;
    // 📌 Leer imágenes en la carpeta segura
    const files = fs.readdirSync(imagePath).filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"));
    // 📌 Generar URLs seguras con JWT
    const images = files.map((filename) => {
      const token =
        generateImageToken({

          filename,

          ip: userIP,
        });
      return { filename, secureUrl: `/api/urlSeguraImagenes?token=${token}` };
    });

    res.setHeader(
      "Cache-Control",
      "private, max-age=60"
    );    

    // 📌 Enviar la lista de imágenes con URLs protegidas
    return res.status(200).json(images);
  } catch (error) {
      logger.error(
        "Failed loading protected images.",
        error
      );        
    return  res.status(500).json({ success: false, message: "Internal server error." });
  }
});

export default router;
