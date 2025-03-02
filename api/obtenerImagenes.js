import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secretKey = process.env.SECRET_KEY;
const imagePath = path.join(process.cwd(), "api/protectedimages");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }

  try {
    // 📌 Obtener IP del usuario
    const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // 📌 Leer imágenes en la carpeta segura
    const files = fs.readdirSync(imagePath).filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"));

    // 📌 Generar URLs seguras con JWT
    const images = files.map((filename) => {
      const token = jwt.sign({ filename, ip: userIP }, secretKey, { expiresIn: "5m" });
      return { filename, secureUrl: `https://inchallah.vercel.app/api/urlSeguraImagenes?token=${token}` };
    });

    // 📌 Enviar la lista de imágenes con URLs protegidas
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}
