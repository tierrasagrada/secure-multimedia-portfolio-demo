import csurf from "csurf";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();
app.use(cookieParser());

// Configurar protección CSRF con cookies seguras
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // No accesible desde JavaScript
    secure: true, // Solo en HTTPS
    sameSite: "Strict", // Evita ataques CSRF desde otros sitios
  },
});

// Middleware global de CSRF
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default app;
