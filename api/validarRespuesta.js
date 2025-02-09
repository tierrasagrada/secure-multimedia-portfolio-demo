// api/validarRespuesta.js

/*export default function handler(req, res) {
    const respuestaCorrecta = "amarillo"; // Respuesta correcta
    const { respuesta } = req.query; // Obtén la respuesta del cliente
  
    // Verificar si la respuesta es correcta
    if (respuesta.toLowerCase() === respuestaCorrecta) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Respuesta incorrecta" });
    }
  }*/
 export default function handler(req, res) {
  if (req.method === "GET") {
    const { respuesta } = req.query;

    // Validar si la respuesta es igual a "amarillo"
    if (respuesta && respuesta.toLowerCase() === "amarillo") {
      return res.status(200).json({ success: true, message: "Respuesta correcta." });
    }

    // Respuesta incorrecta
    return res.status(401).json({ success: false, message: "Respuesta incorrecta." });
  }

  // Método no permitido
  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ success: false, message: "Método no permitido." });
} 
