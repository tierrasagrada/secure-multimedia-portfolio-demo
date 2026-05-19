import express from "express";
//import csurf from "csurf";
//import cookieParser from "cookie-parser";

//const app = express();
const router = express.Router();
//app.use(cookieParser());
//router.use(cookieParser());

// Configurar protección CSRF con cookies seguras
/*const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // No accesible desde JavaScript
    //secure: true, // Solo en HTTPS
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // Evita ataques CSRF desde otros sitios
  },
});*/

// Middleware global de CSRF
//app.use(csrfProtection);
//router.use(csrfProtection);

/*app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});*/
router.get("/", (req, res) => {

  try {

    res.json({
      csrfToken: req.csrfToken(),
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});
//export default app;
export default router;
