const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const app = express();

const SECRET_KEY = "radiolaclave"; // Clave para firmar el token
const imageFolder = path.join(__dirname, "api/protectedimages");

// Función para generar un token seguro
const generateToken = (filename) => {
  return jwt.sign({ filename }, SECRET_KEY, { expiresIn: "1h" }); // Expira en 1 hora
};

// Endpoint para obtener la lista de imágenes con URLs seguras
app.get("/images", async (req, res) => {
  try {
    const imageFiles = fs.readdirSync(imageFolder);

    const images = imageFiles.map((filename) => {
      const token = generateToken(filename);
      return {
        filename,
        secureUrl: `https://inchallah.vercel.app/api/secure-image/${filename}?token=${token}`,
      };
    });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las imágenes" });
  }
});

// Endpoint para servir imágenes protegidas
app.get("/api/secure-image/:filename", (req, res) => {
  const { filename } = req.params;
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.filename !== filename) {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    const filePath = path.join(imageFolder, filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Imagen no encontrada" });
    }
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
});

module.exports = app; // Para ser usado en Vercel
