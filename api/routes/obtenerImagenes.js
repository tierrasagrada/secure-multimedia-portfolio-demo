import express from "express";
import * as fs from "fs";
import path from "path";
//import jwt from "jsonwebtoken";
import auth from
"../middleware/auth.js"; //va antes o despues de ../services/tokenService.js";?
import {
  generateImageToken
} from "../services/tokenService.js";
//import cookie from "cookie";

const router = express.Router();

const imagePath = path.join(process.cwd(), "api/protectedimages");

//export default async function handler(req, res) {
router.post("/", auth, async (req, res) => {
  /*if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }*/
  //const secretKey = process.env.SECRET_KEY;
  //console.log(process.env.SECRET_KEY);
  try {
    // 📌 Obtener IP del usuario
    //const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const userIP = req.ip;

    // 📌 Leer imágenes en la carpeta segura
    const files = fs.readdirSync(imagePath).filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"));
    /*const files = await fs.readdir(imagePath);
    const filteredFiles =
      files.filter((file) => {

        return (
          file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png")
        );
      });*/
    // 📌 Generar URLs seguras con JWT
    const images = files.map((filename) => {
      //const token = jwt.sign({ filename, ip: userIP }, secretKey, { expiresIn: "5m" });
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
    console.error("ERROR obtenerImagenes:",error);    
    return  res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});

export default router;
