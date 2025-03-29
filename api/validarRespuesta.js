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
          <h1>Manuel Teodoro Córdova Tapia</h1>
          <p class="classy">Silvester Stallone - Denzel Washington - Rambo - Condoro - Oso - Rimbi - Pichón</p>
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
                            <h2>About me</h2>
                            <div class="row">
                              <div class="col-md-4">
                                <p><div id="wanderito2"></div><!--<img src="./assets/images/img-01.jpg" class="img-responsive" alt="">--></p>
                              </div>
                              <div class="col-md-8">
                                <p>En memoria para nuestro Padre de sus hijos Bryan y Valeria. </p>
                                <p>Le dejamos sus canciones favoritas para que baile en el cielo y en la eternidad, aquí  seguimos nosotros disfrutando sus gustos musicales y sus películas favoritas.</p>
                                <p>El amor es eterno y lo recordamos en cada momento y en cada canción.</p>
                                <h2>Te amamos papá.</h2>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="card">
                          <div class="card-block">
                            <h2>Mi Música</h2>
                            <div class="row">
                              <div class="col-md-4">              
                                <iframe class="img-responsive" alt="" src="https://www.youtube.com/embed/y626CKZs28I?si=ew1GWvqSJHPa0dkl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                <h3 class="h5">Bruce Springsteen</h3>
                                <p>Dancing In The Dark Extended Version</p>
                              </div>
                              <div class="col-md-4">              
                                <iframe class="img-responsive" alt="" src="https://www.youtube.com/embed/UM-sIozHT2k?si=9HsQYW3QE5AjMzWZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                <h3 class="h5">Jean Beauvoir</h3>
                                <p>Cobra - Feel The Heat - (1986)</p>
                              </div>
                              <div class="col-md-4">              
                                <iframe class="img-responsive" alt="" src="https://www.youtube.com/embed/dRnNpLOhn1Q?si=qCKgZ6jA0LS6mdJO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                <h3 class="h5">Cock Robin</h3>
                                <p>When Your Heart Is Weak</p>
                              </div>
                              <div class="col-md-4">              
                                <iframe class="img-responsive" alt="" src="https://www.youtube.com/embed/jS3tWFd5bew?si=MyK8Oegn4CfauODp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                <h3 class="h5">Upa! - Sueldos</h3>
                                <p>ROCK CHILENO. Upa! (1986)</p>
                              </div> 
                              <div class="col-md-4">              
                                <iframe class="img-responsive" alt="" src="https://www.youtube.com/embed/HXvQmPdc-30?si=h9svW1HOZXYnxqz5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                <h3 class="h5">G I T</h3>
                                <p> Oro - Grandes Éxitos</p>
                              </div>               
                            </div>
                          </div>
                        </div>
                        <h2>Fotos Bellas</h2>
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
                      
                      <p>©All right reserved. Design <a href="http://www.mashup-template.com/" title="Create website with free html template">Mashup Template</a>/<a href="https://unsplash.com/" title="Beautiful Free Images">Unsplash</a></p>
                      <p>
                        <a class="fa-icon fa-icon-2x" href="https://facebook.com/" title="">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://twitter.com/" title="">
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://dribbble.com/" title="">
                          <i class="fa fa-dribbble"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://www.linkedin.com/" title="">
                          <i class="fa fa-linkedin"></i>
                        </a>
                        <a class="fa-icon fa-icon-2x" href="https://vimeo.com/" title="">
                          <i class="fa fa-vimeo"></i>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </footer>`;

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
