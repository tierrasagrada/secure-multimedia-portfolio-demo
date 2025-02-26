const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const imageFolder = path.join(__dirname, "protectedimages");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Solicitud inválida." });
  }

  // Si no se envía un token ni filename, asumimos que se solicita la lista de imágenes
  if (!req.body.token && !req.body.filename) {
    return obtenerListaImagenes(res);
  }

  const { token, filename } = req.body;
  if (!token || !filename) {
    return res.status(400).json({ error: "Faltan parámetros." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.filename !== filename) {
      return res.status(403).json({ error: "Acceso no autorizado." });
    }

    const filePath = path.join(imageFolder, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    // 🔥 Configurar cabeceras de seguridad
    res.setHeader("Content-Type", getContentType(filename));
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    // 🔥 Enviar imagen como stream
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
}

// 🔹 Obtener lista de imágenes
function obtenerListaImagenes(res) {
  const imageFiles = fs.readdirSync(imageFolder).filter((file) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  const images = imageFiles.map((filename) => {
    const token = jwt.sign({ filename }, SECRET_KEY, { expiresIn: "1h" });
    return { filename, token };
  });

  return res.status(200).json(images);
}

// 🔹 Obtener tipo de contenido de la imagen
function getContentType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  }[ext] || "application/octet-stream";
}
