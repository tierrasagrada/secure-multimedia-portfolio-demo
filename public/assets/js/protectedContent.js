import { apiFetch }
from "./api.js";

import {
  loadProtectedImages
}
from "./slider.js";

/* =========================
   RENDER PROTECTED CONTENT
========================= */

export async function
renderProtectedContent() {

  try {

    /* =========================
       GET CONTENT
    ========================= */

    const contentResponse =
      await apiFetch(

        "/api/contenido",

        {

          method: "GET",
        }
      );

    if (!contentResponse.ok) {

      return false;
    }

    const data =
      await contentResponse.json();

    /* =========================
       HIDE LOGIN UI
    ========================= */

    document.getElementById(
      "security-footer"
    ).style.display = "none";

    document.getElementById(
      "security-container"
    ).style.display = "none";

    /* =========================
       SANITIZE HTML
    ========================= */

    const cleanHTML =
      DOMPurify.sanitize(

        data.content,

        {

          ADD_TAGS: ["iframe"],

          ADD_ATTR: [

            "allow",

            "allowfullscreen",

            "frameborder",

            "src",

            "title",

            "referrerpolicy",
          ],

          FORBID_ATTR: [

            "onload",

            "onclick",
          ],

          FORBID_TAGS: [

            "script",
          ],
        }
      );

    const tempDiv =
      document.createElement(
        "div"
      );

    tempDiv.innerHTML = cleanHTML;

    /* =========================
       VALIDATE IFRAMES
    ========================= */

    const iframes = tempDiv.getElementsByTagName("iframe");

    const allowedHosts = [
      "www.youtube.com"
    ];      

    for (const iframe of iframes) {
      try {
        const url = new URL(iframe.src);
        if (!allowedHosts.includes(url.hostname)) {
            iframe.remove();
            continue;
        }
        if (!url.pathname.startsWith("/embed/")) {
          iframe.remove();
        }
      } catch {
        iframe.remove();
      }      
    }

    /* =========================
       RENDER HTML
    ========================= */

    const protectedContent =
      document.getElementById(
        "protected-content"
      );

if (!protectedContent.dataset.loaded) {

  protectedContent.innerHTML =
    tempDiv.innerHTML;

  protectedContent.dataset.loaded =
    "true";
}
 imprimirError(mensaje);
    protectedContent.style.display =
      "block";
      
    /* =========================
       LOAD IMAGES
    ========================= */

    await loadProtectedImages();

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}


      function imprimirError(mensaje) {
            const cajaError = document.getElementById('error-box');
            cajaError.textContent = "Error: " + mensaje;
            cajaError.style.display = 'block'; // Muestra el mensaje en la pantalla
        }
        imprimirError("estoy en la funcion imprimirError 1");
document.addEventListener("visibilitychange", function() {
  imprimirError("estoy en la funcion visibilitychange 2");
  if (document.visibilityState === "visible") {
   imprimirError("¡El usuario ha vuelto a la pestaña!");
    // Aquí puedes ejecutar tus funciones: pausar/reanudar videos, actualizar datos, etc.
  } else {
    imprimirError("La pestaña ha pasado a segundo plano.");
  }
});