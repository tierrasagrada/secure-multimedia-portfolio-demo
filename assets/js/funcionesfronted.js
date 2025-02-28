const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async () => {
  const userAnswer = document.getElementById("answer").value;
    if (!userAnswer) {
      document.getElementById("error").textContent = "La respuesta no puede estar vacía";
      return;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(userAnswer)) {
  	document.getElementById("error").textContent = "Respuesta no válida. Usa solo letras y números.";
	return;
     }	
  try {
    // Llamada al backend para validar la respuesta y obtener todo el contenido necesario
      const response1 = await fetch("https://inchallah.vercel.app/api/validarRespuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta: userAnswer })
      });
    
    //if (!response1.ok) throw new Error("Error al obtener los datos del backend"); 

    const data = await response1.json();

    // Si la respuesta es correcta
    if (data.success) {// 1. Mostrar el contenido HTML oculto
      const protectedContent = document.getElementById("protected-content");
	    
const cleanHTML = DOMPurify.sanitize(data.content, {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "src", "title", "referrerpolicy"],
  FORBID_ATTR: ["onload", "onclick"], // Bloquea eventos inseguros
  FORBID_TAGS: ["script"], // Evita inyecciones de JS
});

const diveo = document.createElement("div");
diveo.innerHTML = cleanHTML;

// Validar que el iframe es de YouTube
const iframes = diveo.getElementsByTagName("iframe");
for (let iframe of iframes) {
  if (!iframe.src.startsWith("https://www.youtube.com/embed/")) {
    iframe.remove(); // Elimina iframes no seguros
  }
}

protectedContent.innerHTML = diveo.innerHTML;
	    
      const protectedContent2 = document.getElementById("sliker");//Obtener div enviado del backend
      const wanderitodiv = document.getElementById("wanderito");
      const wanderitodiv2 = document.getElementById("wanderito2");	
      const ninjadiv = `
        <div id="ninja-slider">
          <div class="slider-inner">
            <ul id="unDiv"></ul>
            <div class="fs-icon" title="Expand/Close"></div>
          </div>
        </div>
      `;
      protectedContent2.innerHTML =  DOMPurify.sanitize(ninjadiv);

       // 🔹 Obtener lista de imágenes con URLs seguras
    const response = await fetch("https://inchallah.vercel.app/api/obtenerImagenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({})
    });
	    
    if (!response.ok) throw new Error("Error al obtener imágenes");
      
    let imagesarray = await response.json();
    let sentences = 0;
    const sliderContainer = document.getElementById("unDiv");     
	    
	for (let i = imagesarray.length - 1; i >= 0; i--) {	
	   const image = imagesarray[i];
	   if (!image.secureUrl) return;
           //imagesarray.forEach((image) => {
           sentences++;
		
	  if(image.filename === "wanderers.png"){
		const imgsw = document.createElement("img");
		imgsw.src = image.secureUrl;
		imgsw.style.width = "250px";
		imgsw.style.height = "200px";
		wanderitodiv.appendChild(imgsw);
		imagesarray.splice(i, 1); // Eliminar del array 
		continue; // 🔥 Saltar el resto del código y pasar al siguiente elemento
	  }
	  if(image.filename === "img-01.jpg"){
		const imgsw2 = document.createElement("img");
		imgsw2.src = image.secureUrl;
 		imgsw2.className = "img-responsive";
		wanderitodiv2.appendChild(imgsw2);
  		imagesarray.splice(i, 1); // Eliminar del array
		continue; // 🔥 Saltar el resto del código y pasar al siguiente elemento
	  }
		
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.className = "ns-img";
          a.href = image.secureUrl;
          a.alt = image.filename || "Imagen protegida";
          const div = document.createElement("div");          

          div.className = "caption";
          div.textContent = "@colerise";
          li.appendChild(a);
          li.appendChild(div);
	 // if(image.filename != "wanderers.png" && image.filename != "img-01.jpg"){
             sliderContainer.appendChild(li);		
		console.log( {sentences} );  
	//  }
       // });        
	}   
        nslider.init ();
        protectedContent.style.display = "block";
        document.getElementById("security-container").style.display = "none";  	    
    } else {
     	document.getElementById("error").textContent = data.message;
    }
  } catch (error) {
	document.getElementById("error").textContent = "Ocurrió un error. Inténtalo nuevamente más tarde.";
  }
});

  document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.onload = function () {
        img.style.opacity = "1"; // Muestra la imagen cuando esté lista
      };
    });
  });
