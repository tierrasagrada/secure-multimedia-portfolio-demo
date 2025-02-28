import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;
const imagePath = path.join(process.cwd(), "api/protectedimages");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }

  try {
    const { token } = req.query;
    if (!token) return res.status(401).json({ success: false, message: "Acceso no autorizado." });

    // 📌 Validar el token
    const decoded = jwt.verify(token, secretKey);
    const { filename, ip } = decoded;
    const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // 📌 Verificar la IP para evitar que la URL se comparta
    if (userIP !== ip) {
      return res.status(403).json({ success: false, message: "Token inválido o reutilizado en otro dispositivo." });
    }

    // 📌 Verificar que la imagen existe
    const filePath = path.join(imagePath, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Imagen no encontrada." });
    }

    // 📌 Servir la imagen protegida
    res.setHeader("Content-Type", "image/jpeg");
    res.send(fs.readFileSync(filePath));
  } catch (error) {
    res.status(403).json({ success: false, message: "Token inválido o expirado." });
  }
}
