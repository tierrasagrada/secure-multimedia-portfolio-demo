import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
//import csurf from "csurf";
//import cookieParser from "cookie-parser";

//const app = express(); //iniciar app express
const router = express.Router();

//app.set("trust proxy", 1);

//app.use(cookieParser());
//app.use(express.json()); // <-- Agregar esto para que el backend pueda leer JSON

// Configurar protección CSRF con cookies
/*const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // No accesible desde JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // Evita ataques CSRF desde otros sitios
  },
});*/

//app.use(csrfProtection);

// Configuración de intentos fallidos
/*const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos
const ANSWER = "verde"; // Respuesta correcta
const failedAttempts = new Map(); // Para rastrear intentos por IP*/

/* =========================
   CSRF TOKEN ENDPOINT
========================= */
/*app.get("/api/csrf-token", (req, res) => {
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
});*/

// Middleware de Rate Limiting
/*const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP en 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/", globalLimiter);*/

/* =========================
   AUTH RATE LIMIT
========================= */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many failed attempts. Please try again later.",
  },
});

/* =========================
   SLOW DOWN
========================= */

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => Math.min(hits * 300, 5000),
  maxDelayMs: 3000,
});

const ANSWER = "verde"; // Respuesta correcta

// VALIDATION ENDPOINT
router.post("/",
  speedLimiter,
  authLimiter,
  async (req, res) => {
    try {

      // BODY VALIDATION
      if ( !req.body || typeof req.body !== "object") {
        return res.status(400).json({
          success: false,
          message: "Invalid request.",
        });
      }
      
      const { respuesta } = req.body;
      
      // INPUT VALIDATION
      if (!respuesta || typeof respuesta !== "string"){
        return res.status(400).json({
          success: false,
          message: "Invalid request.",
        });
      }      

      if (!/^[a-zA-Z0-9\s]+$/.test(respuesta)) {
        return res.status(400).json({
          success: false,
          message: "Invalid input.",
        });
      }

      // PROTECTED CONTENT
      const protectedContent = `<div class="responsive-container">
 <div class="hero-header">

    <div class="hero-logo left-logo">
        <div id="wanderito-left"></div>
    </div>

    <div class="hero-center">

        <h1>Alejandro Rivas</h1>

        <h2>Full Stack Developer</h2>

        <p>
            Valparaíso, Chile · Secure Multimedia Web Experience
        </p>

    </div>

<div class="fireworks">
    <canvas class="fireworks-canvas"></canvas>
    <div id="wanderito"></div>
</div>

</div>
          </div>
            <!-- Add your content of header -->
            <div class="background-color-layer"></div>
              <main class="content-wrapper">
                <header class="white-text-container section-container">
                </header>
                  <!-- Add your site or app content here -->
                  <div class="container">
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="card">
                          <div class="card-block">
                            <h2>🧾About</h2>
                            <div class="row">
                              <div class="col-md-4">
                                <p><div id="wanderito2"></div><img src="./assets/images/img-01.png" class="img-responsive" alt=""></p>
                              </div>
                              <div class="col-md-8">
                                <p>Alejandro Rivas is a developer and technology enthusiast with more than 10 years of experience designing digital solutions. Throughout his career, he has participated in projects focused on web security, API optimization, and interactive platform development. </p>
                                <p>From an early age, he showed a strong interest in computer science, starting with self-taught projects and evolving toward more advanced systems focused on data protection and user privacy.</p>
                                <h2>📖 Journey</h2>
                                <p>During his early professional years, he worked on multiple initiatives related to both public and private sectors, developing tools aimed at improving information management efficiency.</p>
                                <p>One of his main interests has been web application security, implementing robust authentication mechanisms, token-based access control, and strategies to prevent unauthorized access.</p>
                                <p>Currently, he is focused on personal projects centered around secure multimedia experiences, where access to content is protected through dynamic validation systems.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="card">
                          <div class="card-block">
                            <h2>Multimedia Highlights</h2>
                            <div class="row">
                                <div class="col-md-4">
                                <!--Inicio iframe -->
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/TlB_eWDSMt4?si=5EiVTZQVqhQue6IC"
                                  title="Node.js Backend Development"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerpolicy="strict-origin-when-cross-origin"
                                  allowfullscreen>
                                </iframe>                                                           
                                <h3 class="h5">Node.js Backend Development</h3>
                                <p>Introduction to backend architecture using Node.js and Express for scalable web applications.</p>
                              </div>
                              <div class="col-md-4">
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/7nafaH9SddU?si=tQ7_NzygZD_TnrRe"
                                  title="JWT Authentication"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerpolicy="strict-origin-when-cross-origin"
                                  allowfullscreen>
                                </iframe>                                                             
                                <h3 class="h5">JWT Authentication & Secure Access</h3>
                                <p>Token-based authentication concepts and protected access implementation.</p>
                              </div>
                              <div class="col-md-4">
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/-MTSQjw5DrM?si=ELHk1tx4UZQiFUPS"
                                  title="REST API Design"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerpolicy="strict-origin-when-cross-origin"
                                  allowfullscreen>
                                </iframe>                            
                                <h3 class="h5">REST API Design Principles</h3>
                                <p>Best practices for designing scalable and maintainable REST APIs.</p>
                              </div>
                              <!--
                              <div class="col-md-4">              
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/S-4hwfyK-XQ?si=YmJz3RlPZU2Uh3h2"
                                  title="Developer Focus Session"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerpolicy="strict-origin-when-cross-origin"
                                  allowfullscreen>
                                </iframe>                             
                                <h3 class="h5">Developer Focus Session</h3>
                                <p>Ambient lo-fi music frequently used during coding and development sessions.</p>
                              </div>
                              <div class="col-md-4">              
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/6a84f9ITDfs"
                                  title="YouTube video player"
                                  frameborder="0"
                                  allowfullscreen>
                                </iframe>                                
                                <h3 class="h5">Secure API Architecture</h3>
                                <p>Overview of scalable backend architecture and secure API communication using Node.js and Express.</p>
                              </div>
                              <div class="col-md-4">              
                                <iframe class="img-responsive"
                                  loading="lazy"
                                  src="https://www.youtube.com/embed/mbsmsi7l3r4?si=FUQjqijgaV9ffzOD"
                                  title="YouTube video player"
                                  frameborder="0"
                                  allowfullscreen>
                                </iframe>                                
                                <h3 class="h5">Modern Web Authentication</h3>
                                <p>Modern authentication concepts including token validation and protected resource access.</p>
                              </div>  -->      
    <!--Fin Iframe -->
                            </div>
                          </div>
                        </div>
                        <h2 id="titulode-ninja">Featured Projects</h2>
                 <!-- ninja--><div id="sliker"></div>
                    </div>
                  </div>
                  </div>
                 </main>
                <footer class="footer-container white-text-container text-center">
                <div class="container">
                  <div class="row">
                    <div class="col-xs-12">
                      <p><img src="./assets/images/shield2.png" alt=""></p>
                      
                      <p>© 2026 Alejandro Rivas. All rights reserved.</p>
                      <p>🔒 Protected multimedia access powered by dynamic validation.<p/>
                      <p>
                        <a class="fa-icon fa-icon-2x" href="https://facebook.com/" title="">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://x.com/" title="">                                                      
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://www.linkedin.com/" title="">
                          <i class="fa fa-linkedin"></i>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
                <style>
                  .fa-twitter:before {
                    content: "𝕏";
                    font-family: sans-serif;
                  }
                </style>`;

      // CORRECT ANSWER
      if (respuesta.toLowerCase().trim() === ANSWER) {

        return res.status(200).json({
          success: true,
          message: "Correct answer.",
          content: protectedContent,
        });
      }

      // WRONG ANSWER
      return res.status(401).json({
        success: false,
        message: "Incorrect answer.",
      });

    } catch (error) {

      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

export default router;