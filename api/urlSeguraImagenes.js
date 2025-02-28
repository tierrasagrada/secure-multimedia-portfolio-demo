import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const secretKey = process.env.SECRET_KEY || "clave-segura"; // Usa variables de entorno
const verifyJWT = promisify(jwt.verify);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: { success: false, message: "Demasiadas solicitudes, intenta más tarde." },
  keyGenerator: (req) => req.headers["x-forwarded-for"] || req.connection.remoteAddress,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Generar URLs seguras con tokens
    const { filenames } = req.body;
    if (!Array.isArray(filenames)) {
      return res.status(400).json({ success: false, message: "Solicitud inválida." });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const images = filenames.map((filename) => {
      const token = jwt.sign({ filename, ip }, secretKey, { expiresIn: "10m" }); // Expira en 10 minutos
      return { filename, secureUrl: `https://inchallah.vercel.app/api/urlSeguraImagenes?token=${token}` };
    });

    return res.json(images);
  }

  if (req.method === "GET") {
    // Servir imagen validando el token
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token no proporcionado." });
    }

    try {
      const decoded = await verifyJWT(token, secretKey);
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      
      // Verificar que el token pertenece a la misma IP
      if (decoded.ip !== ip) {
        return res.status(403).json({ success: false, message: "Acceso no autorizado." });
      }

      const imagePath = path.join(process.cwd(), "assets/images", decoded.filename);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ success: false, message: "Imagen no encontrada." });
      }

      // Configurar caché para 5 minutos sin afectar seguridad
      res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Referrer-Policy", "no-referrer");

      fs.createReadStream(imagePath).pipe(res);
    } catch (error) {
      return res.status(403).json({ success: false, message: "Token inválido o expirado." });
    }
  } else {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }
}
