// api/validarRespuesta.js

export default function handler(req, res) {
    const respuestaCorrecta = "amarillo"; // Respuesta correcta
    const { respuesta } = req.query; // Obtén la respuesta del cliente
  
    // Verificar si la respuesta es correcta
    if (respuesta.toLowerCase() === respuestaCorrecta) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Respuesta incorrecta" });
    }
  }
  