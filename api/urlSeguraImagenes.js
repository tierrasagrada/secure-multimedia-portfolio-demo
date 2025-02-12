const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const app = express();
const SECRET_KEY = "tu_clave_secreta"; // 🔐 Cambia esto por una clave segura
const imageFolder = path.join(__dirname, "protectedimages"); // 📂 Asegúrate de que esta carpeta existe

app.use(express.json()); // ✅ Middleware para parsear JSON

app.all("/api/urlSeguraImagenes", async (req, res) => {
  try {
    // 📌 Si es una petición GET, devolver la lista de imágenes con URLs seguras
    if (req.method === "GET") {
      if (!fs.existsSync(imageFolder)) {
        return res.status(500).json({ error: "La carpeta de imágenes no existe" });
      }

      const imageFiles = fs.readdirSync(imageFolder);
      const images = imageFiles.map((filename) => {
        const token = jwt.sign({ filename }, SECRET_KEY, { expiresIn: "1h" });
        return { filename, secureUrl: `https://inchallah.vercel.app/api/urlSeguraImagenes?token=${token}&filename=${filename}` };
      });

      return res.json(images);
    }

    // 📌 Si es una petición GET con token y filename, devolver la imagen
    if (req.method === "GET" && req.query.token && req.query.filename) {
      const { filename, token } = req.query;

      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.filename !== filename) {
          return res.status(403).json({ error: "Acceso no autorizado" });
        }

        const filePath = path.join(imageFolder, filename);
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);
        } else {
          return res.status(404).json({ error: "Imagen no encontrada" });
        }
      } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
      }
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    res.status(500).json({ error: "Error en la API de imágenes" });
  }
});

module.exports = app; // ✅ Vercel necesita esta línea para reconocer el archivo

