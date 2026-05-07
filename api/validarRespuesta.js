import rateLimit from "express-rate-limit";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();
app.use(cookieParser());
app.use(express.json()); // <-- Agregar esto para que el backend pueda leer JSON

// Configurar protección CSRF con cookies
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // No accesible desde JavaScript
    secure: true, // Solo en HTTPS
    sameSite: "Strict", // Evita ataques CSRF desde otros sitios
  },
});

app.use(csrfProtection);

// Configuración de intentos fallidos
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos
const ANSWER = "bryan"; // Respuesta correcta
const failedAttempts = new Map(); // Para rastrear intentos por IP

// Middleware de Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP en 15 min
  message: { success: false, message: "Demasiadas solicitudes. Intenta más tarde." },
});





  // Endpoint para validar la respuesta
  app.post("/api/validarRespuesta", limiter, async (req, res) => {
    try {
      const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      // Validar el token CSRF
      csrfProtection(req, res, () => {});

      // Validar el body
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ success: false, message: "Solicitud inválida." });
      }

      const { respuesta } = req.body;

      if (typeof respuesta !== "string" || !/^[a-zA-Z0-9\s]+$/.test(respuesta)) {
        return res.status(400).json({ success: false, message: "Respuesta inválida." });
      }
      
      // Verificar intentos fallidos
      if (failedAttempts.has(userIP)) {
        const { attempts, lastAttempt } = failedAttempts.get(userIP);

        if (attempts >= MAX_ATTEMPTS) {
          const remainingTime = BLOCK_TIME - (Date.now() - lastAttempt);
          if (remainingTime > 0) {
            return res.status(429).json({ success: false, message: "Has alcanzado el límite de intentos. Inténtalo más tarde." });
          } else {
            failedAttempts.delete(userIP);
          }
        }
      }      

        // HTML protegido
        const protectedContent = `<div class="responsive-container">
          <h1>Alejandro Rivas</h1>
          <p class="classy">Fecha de nacimiento: 12 de marzo de 1987 - Ubicación: Valparaíso, Chile</p>
          <div class="topright">
            <div id="wanderito"></div>
            <!--<img src="./assets/images/wanderers.png" width="250" height="300" loading="lazy">-->
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
                            <h2>🧾Biografía</h2>
                            <div class="row">
                              <div class="col-md-4">
                                <p><div id="wanderito2"></div><img src="./assets/images/img-01.png" class="img-responsive" alt=""></p>
                              </div>
                              <div class="col-md-8">
                                <p>Alejandro Rivas es un desarrollador y entusiasta de la tecnología con más de 10 años de experiencia en el diseño de soluciones digitales. A lo largo de su carrera ha participado en proyectos enfocados en seguridad web, optimización de APIs y desarrollo de plataformas interactivas. </p>
                                <p>Desde temprana edad mostró interés por la informática, comenzando con proyectos autodidactas y evolucionando hacia sistemas más complejos orientados a la protección de datos y privacidad del usuario.</p>
                                <h2>📖 Historia</h2>
                                <p>Durante sus primeros años profesionales, trabajó en múltiples iniciativas relacionadas con el sector público y privado, desarrollando herramientas para mejorar la eficiencia en la gestión de información.</p>
                                <p>Uno de sus mayores intereses ha sido la seguridad en aplicaciones web, implementando mecanismos de autenticación robustos, control de acceso basado en tokens y estrategias para prevenir accesos no autorizados.</p>
                                <p>Actualmente, se encuentra desarrollando proyectos personales enfocados en experiencias seguras de contenido multimedia, donde el acceso a información está condicionado por validaciones dinámicas.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="card">
                          <div class="card-block">
                            <h2>Mi Música</h2>
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
                              </div>        
<!--Fin Iframe -->
                            </div>
                          </div>
                        </div>
                        <h2>Proyectos Destacados</h2>
                 <!-- ninja--><div id="sliker"></div>
                    </div>
                  </div>
                  </div>
                 </main>
                <footer class="footer-container white-text-container text-center">
                <div class="container">
                  <div class="row">
                    <div class="col-xs-12">
                      <p><img src="./assets/images/mashup-icon.svg" alt=""></p>
                      
                      <p>© 2026 Alejandro Rivas. Todos los derechos reservados</p>
                      <p>🔒 Acceso restringido mediante validación segura.<p/>
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
              `;

      // Respuesta correcta  
      if (respuesta.toLowerCase() === ANSWER) {
        failedAttempts.delete(userIP); // Restablecer intentos tras éxito
        return res.status(200).json({ success: true, message: "Correcto", content: protectedContent });
      }            
  
      // Registrar intento fallido
      const attempts = failedAttempts.get(userIP) || { attempts: 0, lastAttempt: 0 };
      failedAttempts.set(userIP, { attempts: attempts.attempts + 1, lastAttempt: Date.now() });

      return res.status(401).json({ success: false, message: "Respuesta incorrecta." });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
  });

export default app;
