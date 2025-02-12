const fs = require("fs");
const path = require("path");
const mime = require("mime");
const util = require("util");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

export default async function handler(req, res) {
  if(req.method === "GET") {
      const { respuesta } = req.query;
      // Validar si la respuesta es igual a "amarillo"
      if(respuesta && respuesta.toLowerCase() === "amarillo") {
        // Ruta donde se encuentran las imágenes protegidas
        // Usa process.cwd() para obtener la ruta correcta
        const imageFolder = path.join(process.cwd(), "api/protectedimages");
        
        if (!fs.existsSync(imageFolder)) {
          return res.status(500).json({ error: "No se encontraron imágenes." });
        }       
        
        const imageFiles = fs.readdirSync(imageFolder); // Lee las imágenes en la carpeta

        if (imageFiles.length === 0) {
          return res.status(500).json({ error: "No hay imágenes en la carpeta." });
        }        

        const images = await Promise.all(
          imageFiles.map(async (filename) => {
            const filePath = path.join(imageFolder, filename);
            const imageBuffer = await readFileAsync(filePath);
            const mimeType = mime.getType(filePath);
    
            return {
              filename,
              buffer: imageBuffer.toString("base64"), // Lo enviamos como base64 pero en Blob en el front
              //buffer: imageBuffer,
              mimeType,
            };
          })
        );
        // HTML protegido (ejemplo básico)
        const protectedContent = `<div class="responsive-container">
          <h1>Manuel Teodoro Córdova Tapia</h1>
          <p class="classy">Silvester Stallone - Denzel Washington - Rambo - Condoro - Oso - Rimbi - Pichón</p>
          <div class="topright">
            <img src="./assets/images/wanderers.png" width="250" height="300" loading="lazy">
          </div>
          </div>
            <!-- Add your content of header -->
            <div class="background-color-layer" style="background-image: url('assets/images/img-01.jpg')"></div>
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
                                <p><img src="./assets/images/img-01.jpg" class="img-responsive" alt=""></p>
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

        // Respuesta al frontend      
        return res.status(200).json({
          success: true,
          message: "Respuesta correcta.",
          content: protectedContent,
          images, 
        });
      }
      // Respuesta incorrecta
      return res.status(401).json({ success: false, message: "Respuesta incorrecta." });
  }
  // Método no permitido
  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ success: false, message: "Método no permitido." });
} 
