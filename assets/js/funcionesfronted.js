  document.addEventListener("DOMContentLoaded", function (event) {
     scrollRevelation('.card');
  });
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async () => {
  const userAnswer = document.getElementById("answer").value;

  try {
    // Llamada al backend para validar la respuesta y obtener todo el contenido necesario
    const response1 = await fetch(
      `https://inchallah.vercel.app/api/validarRespuesta?respuesta=${encodeURIComponent(userAnswer)}`
    );

    if (!response1.ok) throw new Error("Error al obtener los datos del backend");

    const data = await response1.json();

    // Si la respuesta es correcta
    if (data.success) {
      const protectedContent = document.getElementById("protected-content");
      protectedContent.innerHTML = data.content; // Carga el contenido desde la API   
      // 1. Mostrar el contenido HTML oculto
      const protectedContent2 = document.getElementById("sliker");
      protectedContent2.innerHTML = `
        <div id="ninja-slider">
          <div class="slider-inner">
            <ul id="unDiv"></ul>
            <div class="fs-icon" title="Expand/Close"></div>
          </div>
        </div>
      `;

      // 2. Construir el slider dinámicamente en el frontend con las imágenes recibidas
      const sliderContainer = document.getElementById("unDiv");     

    const response2 = await fetch("https://inchallah.vercel.app/api/urlSeguraImagenes"); // Llamada al backend en Vercel
    if (!response2.ok) throw new Error(`Error HTTP: ${response2.status}`);  
      
    let imagesarray = await response2.json();

    // Si la respuesta es un objeto con claves numéricas, convertirlo en array
    if (!Array.isArray(imagesarray)) {
      imagesarray = Object.values(imagesarray);
    }      
      
      //antiguo forma de recorre imagenes
      /*if (sliderContainer && Array.isArray(data.images) && data.images.length > 0) {
        sliderContainer.innerHTML = data.images
          .map(
            (imgSrc) =>
              `<li>
                <a class="ns-img" href="${imgSrc.base64}"></a>
                <div class="caption">@colerise</div>
              </li>`
          )
          .join("");*/
        
        //Nueva forma de recorrer imagenes
        // Convertir imágenes base64 a Blob y Object URL
        imagesarray.forEach((image) => {
          //const binaryData = atob(image.buffer);
          //const arrayBuffer = new ArrayBuffer(binaryData.length);
          //const uint8Array = new Uint8Array(arrayBuffer);
    
          /*for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }*/
    
          //const blob = new Blob([uint8Array], { type: image.mimeType });
          //const imageUrl = URL.createObjectURL(blob); // Crear URL temporal

          //const blob = new Blob([data.buffer], { type: data.mimeType });
          //const imageUrl = URL.createObjectURL(blob);
          if (!image.secureUrl) {
            console.error("URL de imagen no encontrada:", image);
            return;
          }
          const li = document.createElement("li");
    
          const a = document.createElement("a");
          a.className = "ns-img";
          a.href = image.secureUrl; // Usamos el Blob URL
          a.alt = image.filename || "Imagen protegida";
          const div = document.createElement("div");          

          div.className = "caption";
          div.textContent = "@colerise";
    
          li.appendChild(a);
          li.appendChild(div);
          sliderContainer.appendChild(li);
        });          
      
//        protectedContent.innerHTML = data.content; // Carga el contenido desde la API   
        //const losSlikers = document.getElementById("sliker");
        // Mostrar el slider
        //losSlikers.appendChild= sliderContainer;
        nslider.init ();
        //const sliderWrapper = document.getElementById("ninja-slider");
        //sliderWrapper.style.display = "block";
        protectedContent.style.display = "block";
        document.getElementById("security-container").style.display = "none"; 
        console.log("Slider cargado correctamente.");
      //} else {
        //console.error("No se encontraron imágenes para cargar.");
      //}
    } else {
      alert("Respuesta incorrecta. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error. Inténtalo nuevamente más tarde.");
  }
});

  document.addEventListener("DOMContentLoaded", function() {
    // Code to be executed when the DOM is ready
//    nslider.init ();
  }); 
  document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.onload = function () {
        img.style.opacity = "1"; // Muestra la imagen cuando esté lista
      };
    });
  });

// Asegura que las secciones se rendericen correctamente sin mostrar el desplazamiento
/*document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section-container");

  // Guarda la posición inicial del scroll
  const originalScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Deshabilita el scroll temporalmente
  document.body.style.overflow = "hidden";

  // Desplaza cada sección al viewport sin que sea visible para el usuario
  sections.forEach((section) => {
    section.scrollIntoView({ block: "start" });
  });

  // Restaura la posición inicial y habilita el scroll
  setTimeout(() => {
    window.scrollTo(0, originalScrollPosition);
    document.body.style.overflow = ""; // Reactiva el scroll
  }, 50); // Ajusta el tiempo según sea necesario
});*/
